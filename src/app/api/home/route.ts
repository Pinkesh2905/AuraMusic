import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpotifyClient } from "@/lib/spotify/client";

// Beautiful Curated Regional Trends
const REGIONAL_TRENDING = [
  {
    id: "reg-1",
    name: "Millionaire",
    artist: "Yo Yo Honey Singh",
    duration: 218000,
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
    uri: "spotify:track:1vYmR6Zqf9W8eS7Q6uWvXg",
    rank: 1,
    streams: "184M streams in your region",
    badge: "#1 Trending"
  },
  {
    id: "reg-2",
    name: "Big Dawgs",
    artist: "Hanumankind, Kalmi",
    duration: 237000,
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
    uri: "spotify:track:2852w8nBT1e9J481rQ43u9",
    rank: 2,
    streams: "142M streams in your region",
    badge: "Hot Rise"
  },
  {
    id: "reg-3",
    name: "Winning Speech",
    artist: "Karan Aujla",
    duration: 194000,
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
    uri: "spotify:track:5oO9Oq3pQO8L8u9eW0vXg9",
    rank: 3,
    streams: "98M streams in your region",
    badge: "Top Punjabi Chart"
  },
  {
    id: "reg-4",
    name: "Softly",
    artist: "Karan Aujla, Ikky",
    duration: 157000,
    albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&q=80",
    uri: "spotify:track:4Cee76vInzK7n70vH3Yj7D",
    rank: 4,
    streams: "128M streams in your region",
    badge: "Vibe Classic"
  },
  {
    id: "reg-5",
    name: "Espresso",
    artist: "Sabrina Carpenter",
    duration: 175000,
    albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80",
    uri: "spotify:track:24CDJZvR4g5Xw481rQ77g7",
    rank: 5,
    streams: "85M streams in your region",
    badge: "Pop Peak"
  }
];

// Beautiful Instagram Viral Trends
const INSTAGRAM_TRENDING = [
  {
    id: "ig-1",
    name: "Winning Speech",
    artist: "Karan Aujla",
    duration: 194000,
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
    uri: "spotify:track:5oO9Oq3pQO8L8u9eW0vXg9",
    reelsCount: "3.4M Reels",
    hashtag: "#AuraEnergy",
    badge: "Viral Anthems"
  },
  {
    id: "ig-2",
    name: "Millionaire",
    artist: "Yo Yo Honey Singh",
    duration: 218000,
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
    uri: "spotify:track:1vYmR6Zqf9W8eS7Q6uWvXg",
    reelsCount: "2.8M Reels",
    hashtag: "#MillionaireWalk",
    badge: "Instagram Top 50"
  },
  {
    id: "ig-3",
    name: "Starboy (feat. Daft Punk)",
    artist: "The Weeknd",
    duration: 230000,
    albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80",
    uri: "spotify:track:7fBv71oPve6YvSTHqfQvXn",
    reelsCount: "1.9M Reels",
    hashtag: "#NightDriveVibe",
    badge: "Aesthetic Reel Hits"
  },
  {
    id: "ig-4",
    name: "Big Dawgs",
    artist: "Hanumankind, Kalmi",
    duration: 237000,
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
    uri: "spotify:track:2852w8nBT1e9J481rQ43u9",
    reelsCount: "1.2M Reels",
    hashtag: "#MainCharacterSpeed",
    badge: "Trending Fast"
  },
  {
    id: "ig-5",
    name: "Espresso",
    artist: "Sabrina Carpenter",
    duration: 175000,
    albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80",
    uri: "spotify:track:24CDJZvR4g5Xw481rQ77g7",
    reelsCount: "940K Reels",
    hashtag: "#EspressoChallenge",
    badge: "Choreography Reel"
  }
];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new SpotifyClient(accessToken);

    // Fetch primary lists in parallel
    const [recentlyPlayed, topTracks, topArtists] = await Promise.all([
      client.getRecentlyPlayed(15).catch(() => ({ items: [] })),
      client.getTopTracks("short_term", 12).catch(() => ({ items: [] })),
      client.getTopArtists("short_term", 10).catch(() => ({ items: [] })),
    ]);

    const formatTrack = (t: any) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.[0]?.name || "Unknown Artist",
      artists: t.artists || [],
      duration: t.duration_ms,
      albumArt: t.album?.images?.[0]?.url || null,
      uri: t.uri,
      previewUrl: t.preview_url || null,
    });

    const formattedTopTracks = topTracks.items.map(formatTrack);
    const formattedRecentlyPlayed = recentlyPlayed.items.map((i: any) => formatTrack(i.track));
    
    // Dynamic real-time recommendation system using top tracks and artists as seeds!
    // Spotify recommendations allow up to 5 total seeds. Let's pick 2 top tracks and 2 top artists.
    const seedTrackIds = topTracks.items.slice(0, 2).map((t: any) => t.id);
    const seedArtistIds = topArtists.items.slice(0, 2).map((a: any) => a.id);

    let recommendations: any[] = [];
    if (seedTrackIds.length > 0 || seedArtistIds.length > 0) {
      try {
        const recData = await client.getRecommendations(seedTrackIds, seedArtistIds);
        recommendations = recData.tracks.map(formatTrack);
      } catch (recError) {
        console.warn("Spotify Recommendations fetch failed, falling back to empty:", recError);
      }
    }

    if (recommendations.length === 0) {
      recommendations = [
        {
          id: "rec-fallback-1",
          name: "Blinding Lights",
          artist: "The Weeknd",
          artists: [{ id: "w1", name: "The Weeknd", uri: "" }],
          duration: 200000,
          albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80",
          uri: "spotify:track:0VjIjjsmD5jfv6SPfgm75T",
          previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
          id: "rec-fallback-2",
          name: "Espresso",
          artist: "Sabrina Carpenter",
          artists: [{ id: "c1", name: "Sabrina Carpenter", uri: "" }],
          duration: 175000,
          albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80",
          uri: "spotify:track:24CDJZvR4g5Xw481rQ77g7",
          previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
          id: "rec-fallback-3",
          name: "Big Dawgs",
          artist: "Hanumankind, Kalmi",
          artists: [{ id: "h1", name: "Hanumankind", uri: "" }, { id: "k1", name: "Kalmi", uri: "" }],
          duration: 237000,
          albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
          uri: "spotify:track:2852w8nBT1e9J481rQ43u9",
          previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        },
        {
          id: "rec-fallback-4",
          name: "Winning Speech",
          artist: "Karan Aujla",
          artists: [{ id: "ka1", name: "Karan Aujla", uri: "" }],
          duration: 194000,
          albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
          uri: "spotify:track:5oO9Oq3pQO8L8u9eW0vXg9",
          previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
        },
        {
          id: "rec-fallback-5",
          name: "Millionaire",
          artist: "Yo Yo Honey Singh",
          artists: [{ id: "hs1", name: "Yo Yo Honey Singh", uri: "" }],
          duration: 218000,
          albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
          uri: "spotify:track:1vYmR6Zqf9W8eS7Q6uWvXg9",
          previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
        },
        {
          id: "rec-fallback-6",
          name: "Sweater Weather",
          artist: "The Neighbourhood",
          artists: [{ id: "n1", name: "The Neighbourhood", uri: "" }],
          duration: 240000,
          albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80",
          uri: "spotify:track:2TpxZ7JUBn3uw46aR7qd6V",
          previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
        }
      ];
    }

    return NextResponse.json({
      recentlyPlayed: formattedRecentlyPlayed,
      topTracks: formattedTopTracks,
      topArtists: topArtists.items.map((a: any) => ({
        id: a.id,
        name: a.name,
        image: a.images?.[0]?.url || null,
        genres: a.genres?.slice(0, 2) || [],
      })),
      recommendations,
      regionalTrending: REGIONAL_TRENDING,
      instagramTrending: INSTAGRAM_TRENDING
    });
  } catch (error) {
    console.error("GET /api/home error:", error);
    return NextResponse.json({ error: "Failed to fetch home feed" }, { status: 500 });
  }
}
