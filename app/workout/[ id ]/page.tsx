"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getWorkout, Workout } from "@/lib/api";
import {
  getPlan,
  getSaved,
  savePlan,
  saveSaved,
} from "@/lib/storage";

export default function WorkoutDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [workout, setWorkout] = useState<Workout | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadWorkout() {
      try {
        const data = await getWorkout(id);
        setWorkout(data);
      } catch (error) {
        console.error(error);
        setWorkout(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadWorkout();
    }
  }, [id]);

  function showToast(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function addToPlan() {
    if (!workout) return;

    const plan = getPlan();

    if (plan.some((item) => item.id === workout.id)) {
      showToast("Already in today's plan");
      return;
    }

    if (plan.length >= 5) {
      showToast("Today's plan is full");
      return;
    }

    savePlan([...plan, workout]);

    window.dispatchEvent(
      new Event("fitlog-update")
    );

    showToast("Added to today's plan");
  }

  function saveForLater() {
    if (!workout) return;

    const saved = getSaved();

    if (
      saved.some(
        (item) => item.id === workout.id
      )
    ) {
      showToast("Already saved");
      return;
    }

    saveSaved([...saved, workout]);

    window.dispatchEvent(
      new Event("fitlog-update")
    );

    showToast("Saved for later");
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading workout…</p>
        </div>

        <Footer />
      </>
    );
  }

  if (!workout) {
    return (
      <>
        <Navbar />

        <main className="not-found">
          <p className="eyebrow">
            404 ERROR
          </p>

          <h1>WORKOUT NOT FOUND</h1>

          <p>
            The workout you are looking for
            does not exist.
          </p>

          <Link
            href="/"
            className="primary-btn"
          >
            BACK TO WORKOUTS →
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="details-page">
        <Link
          href="/"
          className="back-link"
        >
          ← Back to library
        </Link>

        <div className="details-grid">
          {/* Image */}
          <div className="details-image">
            <img
              src={workout.image}
              alt={workout.name}
            />
          </div>

          {/* Content */}
          <div className="details-content">
            <div className="tags">
              {workout.muscleGroups.map(
                (group) => (
                  <span key={group}>
                    {group}
                  </span>
                )
              )}
            </div>

            <h1>{workout.name}</h1>

            <p className="description">
              {workout.description}
            </p>

            {/* Specifications */}
            <div className="specs">
              <div>
                <span>EQUIPMENT</span>
                <strong>
                  {workout.equipment}
                </strong>
              </div>

              <div>
                <span>DIFFICULTY</span>
                <strong>
                  {workout.difficulty}
                </strong>
              </div>

              <div>
                <span>SETS</span>
                <strong>
                  {workout.sets}
                </strong>
              </div>

              <div>
                <span>REPS</span>
                <strong>
                  {workout.reps}
                </strong>
              </div>

              <div>
                <span>DURATION</span>
                <strong>
                  {workout.duration} min
                </strong>
              </div>

              <div>
                <span>CALORIES</span>
                <strong>
                  {workout.caloriesBurned} kcal
                </strong>
              </div>

              <div>
                <span>RATING</span>
                <strong>
                  ★ {workout.rating}
                </strong>
              </div>
            </div>

            {/* Instructions */}
            <div className="instructions">
              <h2>INSTRUCTIONS</h2>

              <ol>
                {workout.instructions.map(
                  (instruction, index) => (
                    <li key={index}>
                      {instruction}
                    </li>
                  )
                )}
              </ol>
            </div>

            {/* Buttons */}
            <div className="action-buttons">
              <button
                onClick={addToPlan}
                className="primary-btn"
              >
                + ADD TO TODAY&apos;S PLAN
              </button>

              <button
                onClick={saveForLater}
                className="secondary-btn"
              >
                ♡ SAVE FOR LATER
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {message && (
        <div className="toast">
          {message}
        </div>
      )}
    </>
  );
}