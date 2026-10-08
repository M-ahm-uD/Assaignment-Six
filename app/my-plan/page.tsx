"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Eye, Trash2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getWorkout, type Workout } from "@/lib/api";

import {
  getPlan,
  getSaved,
  addToPlan,
  removeFromPlan,
  removeSaved,
  markDone,
} from "@/lib/storage";

type SortOption = "duration" | "calories" | "rating";

export default function MyPlanPage() {
  const [planWorkouts, setPlanWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);

  const [activeTab, setActiveTab] =
    useState<"plan" | "saved">("plan");

  const [sortBy, setSortBy] =
    useState<SortOption>("duration");

  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    try {
      const planIds = getPlan();
      const savedIds = getSaved();

      const planResults = await Promise.all(
        planIds.map((id) => getWorkout(id))
      );

      const savedResults = await Promise.all(
        savedIds.map((id) => getWorkout(id))
      );

      setPlanWorkouts(
        planResults.filter(
          (workout): workout is Workout =>
            workout !== null
        )
      );

      setSavedWorkouts(
        savedResults.filter(
          (workout): workout is Workout =>
            workout !== null
        )
      );
    } catch (error) {
      console.error(
        "Failed to load workout data:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener(
      "fitlog-storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "fitlog-storage",
        handleStorageChange
      );
    };
  }, []);

  const currentWorkouts = useMemo(() => {
    const workouts =
      activeTab === "plan"
        ? [...planWorkouts]
        : [...savedWorkouts];

    workouts.sort((a, b) => {
      if (sortBy === "duration") {
        return a.duration - b.duration;
      }

      if (sortBy === "calories") {
        return b.calories - a.calories;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return 0;
    });

    return workouts;
  }, [
    activeTab,
    planWorkouts,
    savedWorkouts,
    sortBy,
  ]);

  const totalDuration = useMemo(() => {
    return planWorkouts.reduce(
      (total, workout) =>
        total + workout.duration,
      0
    );
  }, [planWorkouts]);

  const totalCalories = useMemo(() => {
    return planWorkouts.reduce(
      (total, workout) =>
        total + workout.calories,
      0
    );
  }, [planWorkouts]);

  const averageRating = useMemo(() => {
    if (planWorkouts.length === 0) {
      return 0;
    }

    const total = planWorkouts.reduce(
      (sum, workout) =>
        sum + workout.rating,
      0
    );

    return total / planWorkouts.length;
  }, [planWorkouts]);

  function handleRemove(id: string | number) {
    removeFromPlan(id);
    loadData();
  }

  function handleRemoveSaved(id: string | number) {
    removeSaved(id);
    loadData();
  }

  function handleDone(id: string | number) {
    markDone(id);
    loadData();
  }

  function handleAddToPlan(id: string | number) {
    addToPlan(id);
    loadData();
  }

  return (
    <div className="site-shell">
      <Navbar />

      <main className="page-container">
        {/* HEADER */}
        <section className="page-header">
          <div>
            <p className="eyebrow">YOUR WORKOUTS</p>

            <h1>My Plan</h1>

            <p className="page-subtitle">
              Manage your workout plan and saved
              workouts.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">
              Workouts
            </span>

            <strong>{planWorkouts.length}</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Total Duration
            </span>

            <strong>{totalDuration} min</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Calories
            </span>

            <strong>{totalCalories}</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Avg. Rating
            </span>

            <strong>
              {averageRating > 0
                ? averageRating.toFixed(1)
                : "0.0"}
            </strong>
          </div>
        </section>

        {/* TABS */}
        <div className="tabs-row">
          <div className="tabs">
            <button
              type="button"
              className={
                activeTab === "plan"
                  ? "tab-button active"
                  : "tab-button"
              }
              onClick={() =>
                setActiveTab("plan")
              }
            >
              My Plan ({planWorkouts.length})
            </button>

            <button
              type="button"
              className={
                activeTab === "saved"
                  ? "tab-button active"
                  : "tab-button"
              }
              onClick={() =>
                setActiveTab("saved")
              }
            >
              Saved ({savedWorkouts.length})
            </button>
          </div>

          {/* SORT */}
          <div className="sort-control">
            <label htmlFor="sort">
              Sort by:
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as SortOption
                )
              }
            >
              <option value="duration">
                Duration
              </option>

              <option value="calories">
                Calories
              </option>

              <option value="rating">
                Rating
              </option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <section className="empty-state">
            <h2>Loading...</h2>

            <p>
              Please wait while your workouts are
              loading.
            </p>
          </section>
        ) : currentWorkouts.length === 0 ? (
          /* EMPTY */
          <section className="empty-state">
            <div className="empty-icon">🏋️</div>

            <h2>
              {activeTab === "plan"
                ? "Your plan is empty"
                : "No saved workouts"}
            </h2>

            <p>
              {activeTab === "plan"
                ? "Add workouts to your plan from the workout library."
                : "Save workouts you want to try later."}
            </p>

            <Link
              href="/"
              className="primary-button"
            >
              Browse Workouts
            </Link>
          </section>
        ) : (
          /* WORKOUT LIST */
          <section className="workout-list">
            {currentWorkouts.map((workout) => (
              <article
                key={String(workout.id)}
                className="plan-workout-card"
              >
                <div className="plan-workout-image">
                  <img
                    src={workout.image}
                    alt={workout.name}
                  />
                </div>

                <div className="plan-workout-content">
                  <div className="workout-top-row">
                    <div>
                      <span className="workout-category">
                        {workout.category}
                      </span>

                      <h2>{workout.name}</h2>
                    </div>

                    <span className="rating">
                      ★ {workout.rating}
                    </span>
                  </div>

                  <p className="workout-description">
                    {workout.description}
                  </p>

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

                  <div className="workout-actions">
                    <Link
                      href={`/workout/${workout.id}`}
                      className="secondary-button"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>

                    {activeTab === "plan" ? (
                      <>
                        <button
                          type="button"
                          className="success-button"
                          onClick={() =>
                            handleDone(workout.id)
                          }
                        >
                          <Check size={16} />
                          Done
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() =>
                            handleRemove(workout.id)
                          }
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() =>
                            handleAddToPlan(
                              workout.id
                            )
                          }
                        >
                          + Add to Plan
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() =>
                            handleRemoveSaved(
                              workout.id
                            )
                          }
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}