"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getPlan,
  getSaved,
  savePlan,
  saveSaved,
} from "@/lib/storage";
import { Workout } from "@/lib/api";

type Tab = "plan" | "saved";

export default function MyPlanPage() {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPlan(getPlan());
    setSaved(getSaved());

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  function showToast(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function removeWorkout(id: number) {
    const updatedPlan = plan.filter(
      (workout) => workout.id !== id
    );

    setPlan(updatedPlan);
    savePlan(updatedPlan);

    window.dispatchEvent(new Event("fitlog-update"));

    showToast("Workout removed");
  }

  function markAsDone(id: number) {
    const workout = plan.find(
      (item) => item.id === id
    );

    if (!workout) return;

    const updatedPlan = plan.filter(
      (item) => item.id !== id
    );

    setPlan(updatedPlan);
    savePlan(updatedPlan);

    window.dispatchEvent(new Event("fitlog-update"));

    showToast(`${workout.name} marked as done`);
  }

  function removeSaved(id: number) {
    const updatedSaved = saved.filter(
      (workout) => workout.id !== id
    );

    setSaved(updatedSaved);
    saveSaved(updatedSaved);

    window.dispatchEvent(new Event("fitlog-update"));

    showToast("Workout removed from saved");
  }

  const currentList =
    activeTab === "plan" ? plan : saved;

  const totalMinutes = plan.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  const totalCalories = plan.reduce(
    (total, workout) =>
      total + workout.caloriesBurned,
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading workouts…</p>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="my-plan-page">
        <section className="plan-header">
          <div>
            <p className="eyebrow">
              YOUR WORKOUT LOG
            </p>

            <h1>MY PLAN</h1>

            <p>
              Cap of five lifts for today. Finish them,
              then load more.
            </p>
          </div>
        </section>

        <section className="metrics">
          <div className="metric-card">
            <span>EXERCISES</span>
            <strong>{plan.length}</strong>
          </div>

          <div className="metric-card">
            <span>MINUTES</span>
            <strong>{totalMinutes}</strong>
          </div>

          <div className="metric-card">
            <span>CALORIES</span>
            <strong>{totalCalories}</strong>
          </div>
        </section>

        <div className="plan-tabs">
          <button
            onClick={() => setActiveTab("plan")}
            className={
              activeTab === "plan"
                ? "tab active"
                : "tab"
            }
          >
            Today&apos;s Plan{" "}
            <span>{plan.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={
              activeTab === "saved"
                ? "tab active"
                : "tab"
            }
          >
            Saved <span>{saved.length}</span>
          </button>
        </div>

        <section className="plan-list">
          {currentList.length === 0 ? (
            <div className="empty-state">
              <p className="eyebrow">
                NOTHING HERE YET
              </p>

              <h2>YOUR LIST IS EMPTY</h2>

              <p>
                Browse the library and add a lift to
                get today moving.
              </p>

              <Link
                href="/"
                className="primary-btn"
              >
                GO TO WORKOUTS →
              </Link>
            </div>
          ) : (
            currentList.map((workout) => (
              <article
                key={workout.id}
                className="plan-card"
              >
                <img
                  src={workout.image}
                  alt={workout.name}
                />

                <div className="plan-card-content">
                  <div className="tags">
                    {workout.muscleGroups.map(
                      (group) => (
                        <span key={group}>
                          {group}
                        </span>
                      )
                    )}
                  </div>

                  <h2>{workout.name}</h2>

                  <p className="equipment">
                    {workout.equipment}
                  </p>

                  <div className="stats">
                    <span>
                      ◷ {workout.duration} min
                    </span>

                    <span>
                      🔥 {workout.caloriesBurned} kcal
                    </span>

                    <span>
                      ★ {workout.rating}
                    </span>
                  </div>
                </div>

                <div className="plan-actions">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="secondary-btn"
                  >
                    VIEW DETAILS
                  </Link>

                  {activeTab === "plan" && (
                    <button
                      onClick={() =>
                        markAsDone(workout.id)
                      }
                      className="done-btn"
                    >
                      ✓ MARK AS DONE
                    </button>
                  )}

                  <button
                    onClick={() =>
                      activeTab === "plan"
                        ? removeWorkout(workout.id)
                        : removeSaved(workout.id)
                    }
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
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