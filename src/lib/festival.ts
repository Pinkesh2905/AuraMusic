export interface Festival {
  name: string;
  month: number; // 0-indexed (e.g. 4 is May)
  day: number;
  greeting: string;
  color1: string;
  color2: string;
}

export const FESTIVALS: Festival[] = [
  { name: "New Year's Day", month: 0, day: 1, greeting: "Happy New Year", color1: "#F59E0B", color2: "#EF4444" },
  { name: "Valentine's Day", month: 1, day: 14, greeting: "Happy Valentine's Day", color1: "#EC4899", color2: "#F43F5E" },
  { name: "Holi", month: 2, day: 28, greeting: "Happy Holi", color1: "#EC4899", color2: "#10B981" },
  { name: "Halloween", month: 9, day: 31, greeting: "Happy Halloween", color1: "#F97316", color2: "#7C3AED" },
  { name: "Diwali", month: 10, day: 8, greeting: "Happy Diwali", color1: "#D97706", color2: "#DC2626" },
  { name: "Christmas", month: 11, day: 25, greeting: "Merry Christmas", color1: "#DC2626", color2: "#059669" },
  { name: "Aura Music Festival", month: 4, day: 20, greeting: "Happy Aura Music Festival", color1: "#D946EF", color2: "#06B6D4" }
];

export function getActiveFestival(date: Date = new Date()): Festival | null {
  const m = date.getMonth();
  const d = date.getDate();
  return FESTIVALS.find(f => f.month === m && f.day === d) || null;
}

export function getGreeting(date: Date = new Date(), userName?: string): string {
  const festival = getActiveFestival(date);
  const nameStr = userName ? `, ${userName.split(" ")[0]}` : "";
  
  if (festival) {
    return `${festival.greeting}${nameStr}!`;
  }
  
  const hour = date.getHours();
  let baseGreeting = "Welcome";
  
  if (hour >= 5 && hour < 12) {
    baseGreeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    baseGreeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 22) {
    baseGreeting = "Good Evening";
  } else {
    baseGreeting = "Good Night";
  }
  
  return `${baseGreeting}${nameStr}`;
}
