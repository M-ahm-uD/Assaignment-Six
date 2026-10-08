"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getWorkout, type Workout } from "@/lib/api";

export default function WorkoutDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkout() {
      const data = await getWorkout(id);
      setWorkout(data);
      setLoading(false);
    }

    if (id) {
      loadWorkout();
    }
  }, [id]);

  if (loading) {
    return <div>Loading workout...</div>;
  }

  if (!workout) {
    return <div>Workout not found.</div>;
  }

  return (
    <main>
      <h1>{workout.name}</h1>

      <img
        src={workout.image}
        alt={workout.name}
        width={500}
      />

      <p>{workout.description}</p>

      <p>Category: {workout.category}</p>
      <p>Difficulty: {workout.difficulty}</p>
      <p>Duration: {workout.duration} min</p>
      <p>Calories: {workout.calories} kcal</p>
      <p>Rating: ★ {workout.rating}</p>

      <h2>Instructions</h2>

      <ol>
        {workout.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </main>
  );
}