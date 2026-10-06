"use client";

import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import WorkoutCard from "../components/WorkoutCard";
import { getWorkouts, Workout } from "../lib/api";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch {
        setToast("Could not load workouts.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <Hero />

      <section id="library" className="library-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WORKOUT LIBRARY</p>
            <h2>THE LIBRARY</h2>
            <p>
              Twelve lifts covering every major muscle group.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-box">
            Loading workouts...
          </div>
        ) : (
          <div className="workout-grid">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
              />
            ))}
          </div>
        )}
      </section>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}