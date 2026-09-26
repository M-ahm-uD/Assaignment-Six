"use client";

import Link from "next/link";
import { Workout } from "@/lib/api";

export default function WorkoutCard({
  workout,
}: {
  workout: Workout;
}) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="workout-card"
    >
      <div className="card-image">
        <img
          src={workout.image}
          alt={workout.name}
        />
      </div>

      <div className="card-content">
        <div className="tags">
          {workout.muscleGroups.map((group) => (
            <span key={group}>{group}</span>
          ))}
        </div>

        <h3>{workout.name}</h3>

        <p className="equipment">
          {workout.equipment}
        </p>

        <div className="stats">
          <span>◷ {workout.duration} min</span>
          <span>🔥 {workout.caloriesBurned} kcal</span>
          <span>★ {workout.rating}</span>
        </div>
      </div>
    </Link>
  );
}