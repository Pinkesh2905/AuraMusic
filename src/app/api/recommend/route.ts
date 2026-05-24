import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpotifyClient } from "@/lib/spotify/client";

// ─── Audio Feature Keys for ML taste matching ───
const FEATURE_KEYS = [
  "danceability",
  "energy",
  "valence",
  "tempo",
  "acousticness",
  "instrumentalness",
  "liveness",
  "speechiness",
] as const;

type AudioVector = Record<(typeof FEATURE_KEYS)[number], number>;

// ─── Extract feature vector from Spotify audio_features object ───
function extractVector(feat: any): AudioVector | null {
  if (!feat) return null;
  const vec = {} as AudioVector;
  for (const key of FEATURE_KEYS) {
    vec[key] = typeof feat[key] === "number" ? feat[key] : 0;
  }
  return vec;
}

// ─── Cosine similarity between two normalized feature vectors ───
function cosineSimilarity(a: AudioVector, b: AudioVector): number {
  const normalize = (v: AudioVector): number[] =>
    FEATURE_KEYS.map((k) => (k === "tempo" ? (v[k] - 40) / 160 : v[k]));

  const vecA = normalize(a);
  const vecB = normalize(b);

  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  const mag = Math.sqrt(magA) * Math.sqrt(magB);
  return mag === 0 ? 0 : dot / mag;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { trackId } = await req.json();

    if (!trackId) {
      return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
    }

    const client = new SpotifyClient(accessToken);

    // ── Step 1: Get the current track's audio features ──
    let currentVector: AudioVector | null = null;
    let currentTrackData: any = null;
    try {
      const [featuresData, trackData] = await Promise.all([
        client.getAudioFeatures([trackId]),
        client.getTrack(trackId),
      ]);
      currentVector = extractVector(featuresData.audio_features?.[0]);
      currentTrackData = trackData;
    } catch {
      // Continue without features — will use default recommendation
    }

    // Get seed artist from the current track
    const seedArtistId = currentTrackData?.artists?.[0]?.id || "";

    // ── Step 2: Generate candidates using Spotify Recommendations ──
    // Use audio features as target parameters for precise matching
    const recParams = new URLSearchParams();
    recParams.append("seed_tracks", trackId);
    if (seedArtistId) {
      recParams.append("seed_artists", seedArtistId);
    }
    recParams.append("limit", "40");

    // If we have the current track's audio features, tune the recommendation
    if (currentVector) {
      recParams.append("target_energy", currentVector.energy.toFixed(2));
      recParams.append("target_valence", currentVector.valence.toFixed(2));
      recParams.append("target_danceability", currentVector.danceability.toFixed(2));
      recParams.append("target_tempo", currentVector.tempo.toFixed(0));
      recParams.append("target_acousticness", currentVector.acousticness.toFixed(2));

      // Set ranges: ±0.2 for features, ±15 BPM for tempo
      recParams.append("min_energy", Math.max(0, currentVector.energy - 0.2).toFixed(2));
      recParams.append("max_energy", Math.min(1, currentVector.energy + 0.2).toFixed(2));
      recParams.append("min_valence", Math.max(0, currentVector.valence - 0.25).toFixed(2));
      recParams.append("max_valence", Math.min(1, currentVector.valence + 0.25).toFixed(2));
      recParams.append("min_tempo", Math.max(40, currentVector.tempo - 15).toFixed(0));
      recParams.append("max_tempo", Math.min(200, currentVector.tempo + 15).toFixed(0));
    }

    let candidates: any[] = [];
    try {
      const recResponse = await fetch(
        `https://api.spotify.com/v1/recommendations?${recParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const recData = await recResponse.json();
      candidates = recData.tracks || [];
    } catch {
      candidates = [];
    }

    // Filter out the current track from candidates
    candidates = candidates.filter((t: any) => t.id !== trackId);

    if (candidates.length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    // ── Step 3: Re-rank candidates by cosine similarity to source track ──
    if (currentVector) {
      // Fetch audio features for all candidates in one batch call
      let candidateFeatures: any[] = [];
      try {
        const candidateIds = candidates.map((t: any) => t.id);
        const featData = await client.getAudioFeatures(candidateIds);
        candidateFeatures = featData.audio_features || [];
      } catch {
        candidateFeatures = [];
      }

      const scored = candidates.map((track: any, idx: number) => {
        const feat = candidateFeatures[idx];
        const vec = extractVector(feat);
        const similarity = vec ? cosineSimilarity(currentVector!, vec) : 0.5;

        // Small variety bonus: prefer different artists
        const sameArtist = track.artists?.some(
          (a: any) => a.id === seedArtistId
        );
        const bonus = sameArtist ? -0.03 : 0.01;

        return { track, score: similarity + bonus };
      });

      scored.sort((a, b) => b.score - a.score);
      candidates = scored.slice(0, 10).map((s) => s.track);
    } else {
      candidates = candidates.slice(0, 10);
    }

    return NextResponse.json({ tracks: candidates });
  } catch (error) {
    console.error("POST /api/recommend error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
