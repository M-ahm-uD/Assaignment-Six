export type Workout = {
  id: number;
  name: string;
  category: string;
  secondaryCategory: string;
  equipment: string;
  difficulty: string;
  sets: number;
  reps: string;
  duration: number;
  calories: number;
  rating: number;
  image: string;
  description: string;
  instructions: string[];
};

const fallbackWorkouts: Workout[] = [
  {
    id: 1,
    name: "Barbell Bench Press",
    category: "Chest",
    secondaryCategory: "Arms",
    equipment: "Barbell, Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "6-8",
    duration: 25,
    calories: 180,
    rating: 4.8,
    image: "/banner.png",
    description:
      "A compound press that builds chest thickness, triceps, and pressing power from a stable bench.",
    instructions: [
      "Lie flat on the bench and grip the bar slightly wider than shoulder width.",
      "Lower the bar toward the middle of your chest with control.",
      "Press the bar upward while keeping your feet planted.",
      "Return the bar safely to the rack.",
    ],
  },
  {
    id: 2,
    name: "Russian Twist",
    category: "Core",
    secondaryCategory: "Abs",
    equipment: "Medicine Ball",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: 15,
    calories: 110,
    rating: 4.6,
    image: "/banner.png",
    description:
      "A controlled core exercise designed to challenge rotation and improve trunk stability.",
    instructions: [
      "Sit with your knees bent and chest lifted.",
      "Hold the weight close to your torso.",
      "Rotate your torso from side to side.",
      "Keep the movement controlled throughout.",
    ],
  },
  {
    id: 3,
    name: "Barbell Squat",
    category: "Legs",
    secondaryCategory: "Glutes",
    equipment: "Barbell, Rack",
    difficulty: "Intermediate",
    sets: 4,
    reps: "6-10",
    duration: 30,
    calories: 240,
    rating: 4.9,
    image: "/banner.png",
    description:
      "A foundational lower-body lift targeting the quads, glutes and posterior chain.",
    instructions: [
      "Place the bar securely across your upper back.",
      "Brace your core and descend by bending your knees and hips.",
      "Drive through your feet to stand back up.",
      "Repeat with controlled technique.",
    ],
  },
  {
    id: 4,
    name: "Lat Pulldown",
    category: "Back",
    secondaryCategory: "Arms",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "8-12",
    duration: 20,
    calories: 150,
    rating: 4.7,
    image: "/banner.png",
    description:
      "A vertical pulling movement for developing the lats and upper back.",
    instructions: [
      "Sit upright and grip the bar wider than shoulder width.",
      "Pull the bar toward your upper chest.",
      "Squeeze your back at the bottom.",
      "Slowly return the bar to the starting position.",
    ],
  },
  {
    id: 5,
    name: "Overhead Press",
    category: "Shoulders",
    secondaryCategory: "Arms",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "6-10",
    duration: 22,
    calories: 165,
    rating: 4.7,
    image: "/banner.png",
    description:
      "A standing press that develops shoulder strength and upper-body stability.",
    instructions: [
      "Hold the bar at shoulder height.",
      "Brace your core and keep your body stable.",
      "Press the bar overhead.",
      "Lower it slowly back to shoulder level.",
    ],
  },
  {
    id: 6,
    name: "Barbell Curl",
    category: "Arms",
    secondaryCategory: "Biceps",
    equipment: "Barbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    duration: 15,
    calories: 100,
    rating: 4.5,
    image: "/banner.png",
    description:
      "A simple and effective movement for building biceps strength.",
    instructions: [
      "Stand tall while holding the barbell.",
      "Keep your elbows close to your body.",
      "Curl the bar toward your shoulders.",
      "Lower it under control.",
    ],
  },
];

export async function getWorkouts(): Promise<Workout[]> {
  try {
    const response = await fetch(
      "https://wger.de/api/v2/exercise/?language=2&limit=50",
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return fallbackWorkouts;
    }

    const apiWorkouts: Workout[] = data.results
      .filter((item: any) => item.name)
      .slice(0, 12)
      .map((item: any, index: number) => ({
        id: item.id || index + 1,
        name: item.name,
        category:
          item.category?.name || "Full Body",
        secondaryCategory: "Fitness",
        equipment:
          item.equipment?.[0]?.name || "Gym Equipment",
        difficulty: "Intermediate",
        sets: 4,
        reps: "8-12",
        duration: 20 + (index % 3) * 5,
        calories: 120 + (index % 5) * 20,
        rating: Number(
          (4.4 + (index % 6) * 0.1).toFixed(1)
        ),
        image: "/banner.png",
        description:
          item.description
            ?.replace(/<[^>]+>/g, "")
            .trim() ||
          "A focused workout designed to build strength and improve performance.",
        instructions: [
          "Prepare your body and use controlled movement.",
          "Keep your posture stable throughout the exercise.",
          "Perform each repetition with proper technique.",
          "Finish the set safely and rest before the next set.",
        ],
      }));

    return apiWorkouts.length > 0
      ? apiWorkouts
      : fallbackWorkouts;
  } catch {
    return fallbackWorkouts;
  }
}