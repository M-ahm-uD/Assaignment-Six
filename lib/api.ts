export type Workout = {
  id: string | number;
  name: string;
  description: string;
  category: string;
  duration: number;
  calories: number;
  rating: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  equipment: string[];
  instructions: string[];
  sets: number;
  reps: string;
  muscleGroups: string[];
};

type ApiWorkout = {
  id: string | number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

export async function getWorkouts(): Promise<Workout[]> {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch workouts: ${response.status}`);
  }

  const data: ApiWorkout[] = await response.json();

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.muscleGroups[0] ?? "Workout",
    duration: item.duration,
    calories: item.caloriesBurned,
    rating: item.rating,
    difficulty: item.difficulty,
    image: item.image,
    equipment: item.equipment
      ? item.equipment.split(",").map((item) => item.trim())
      : [],
    instructions: item.instructions,
    sets: item.sets,
    reps: item.reps,
    muscleGroups: item.muscleGroups,
  }));
}

export async function getWorkout(
  id: string | number
): Promise<Workout | null> {
  const workouts = await getWorkouts();

  const workout = workouts.find(
    (item) => String(item.id) === String(id)
  );

  return workout ?? null;
}