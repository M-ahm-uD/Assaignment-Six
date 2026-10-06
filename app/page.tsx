"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkoutCard from "@/components/WorkoutCard";
import { getWorkouts, Workout } from "@/lib/api";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("duration");

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === "duration") {
      return a.duration - b.duration;
    }

    if (sortBy === "calories") {
      return a.caloriesBurned - b.caloriesBurned;
    }

    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section id="library" className="library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WORKOUTS</p>
              <h2>THE LIBRARY</h2>
              <p>
                Twelve lifts covering every major muscle group.
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="duration">Sort By: Duration</option>
              <option value="calories">Sort By: Calories</option>
              <option value="rating">Sort By: Rating</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading workouts…</p>
            </div>
          ) : (
            <div className="workout-grid">
              {sortedWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}