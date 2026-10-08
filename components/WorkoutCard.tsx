"use client";

import Link from "next/link";
import type { Workout } from "@/lib/api";

type WorkoutCardProps = {
  workout: Workout;
};

export default function WorkoutCard({
  workout,
}: WorkoutCardProps) {
  return (
    <article className="workout-card">
      <div className="workout-card-image">
        <img
          src={workout.image}
          alt={workout.name}
        />
      </div>

      <div className="workout-card-content">
        <div className="workout-card-top">
          <span className="workout-category">
            {workout.category}
          </span>

          <span className="workout-rating">
            ★ {workout.rating}
          </span>
        </div>

        <h3>{workout.name}</h3>

        <p>{workout.description}</p>

        <div className="workout-meta">
          <span>
            ⏱ {workout.duration} min
          </span>

          <span>
            🔥 {workout.calories} kcal
          </span>

          <span>
            {workout.difficulty}
          </span>
        </div>

        <div className="workout-equipment">
          {workout.equipment.length > 0
            ? workout.equipment.join(", ")
            : "No equipment"}
        </div>

        <Link
          href={`/workout/${workout.id}`}
          className="primary-btn"
        >
          VIEW WORKOUT →
        </Link>
      </div>
    </article>
  );
}