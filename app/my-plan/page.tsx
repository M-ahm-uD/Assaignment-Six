"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock3,
  Flame,
  Star,
  Trash2,
  Eye,
} from "lucide-react";

import { getWorkouts, Workout } from "../../lib/api";
import {
  getPlan,
  getSaved,
  removeFromPlan,
  markDone,
} from "../../lib/storage";

type Tab = "plan" | "saved";
type SortType = "duration" | "calories" | "rating";

export default function MyPlanPage() {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [sortBy, setSortBy] = useState<SortType>("duration");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function load() {
      try {
        await getWorkouts();
        setPlan(getPlan());
        setSaved(getSaved());
      } finally {
        setLoading(false);
      }
    }

    load();

    const update = () => {
      setPlan(getPlan());
      setSaved(getSaved());
    };

    window.addEventListener("fitlog-storage", update);

    return () => {
      window.removeEventListener("fitlog-storage", update);
    };
  }, []);

  const currentList = activeTab === "plan" ? plan : saved;

  const sortedList = useMemo(() => {
    return [...currentList].sort((a, b) => {
      if (sortBy === "calories") {
        return b.calories - a.calories;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return b.duration - a.duration;
    });
  }, [currentList, sortBy]);

  const totalMinutes = plan.reduce(
    (sum, item) => sum + item.duration,
    0
  );

  const totalCalories = plan.reduce(
    (sum, item) => sum + item.calories,
    0
  );

  function handleRemove(id: number) {
    removeFromPlan(id);

    setPlan(getPlan());
    setToast("Workout removed.");

    setTimeout(() => setToast(""), 2500);
  }

  function handleDone() {
    markDone();

    setToast("Workout marked as done.");

    setTimeout(() => setToast(""), 2500);
  }

  return (
    <section className="plan-page">
      <div className="plan-container">
        <div className="plan-heading">
          <div>
            <p className="eyebrow">YOUR WORKOUTS</p>

            <h1>MY PLAN</h1>

            <p>
              Cap of five lifts for today. Finish them, then load more.
            </p>
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as SortType)
            }
          >
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div className="metrics">
          <div className="metric-card">
            <span>Exercises</span>
            <strong>{plan.length}</strong>
          </div>

          <div className="metric-card">
            <span>Minutes</span>
            <strong>{totalMinutes}</strong>
          </div>

          <div className="metric-card">
            <span>Calories</span>
            <strong>{totalCalories}</strong>
          </div>
        </div>

        <div className="tabs">
          <button
            className={activeTab === "plan" ? "active" : ""}
            onClick={() => setActiveTab("plan")}
          >
            Today's Plan
          </button>

          <button
            className={activeTab === "saved" ? "active" : ""}
            onClick={() => setActiveTab("saved")}
          >
            Saved
          </button>
        </div>

        {loading ? (
          <div className="loading-box">
            Loading workouts...
          </div>
        ) : sortedList.length === 0 ? (
          <div className="empty-state">
            <h2>NOTHING HERE YET</h2>

            <p>
              Browse the library and add a lift to get today moving.
            </p>

            <Link href="/" className="primary-btn">
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="plan-list">
            {sortedList.map((workout) => (
              <article className="plan-card" key={workout.id}>
                <img
                  src={workout.image}
                  alt={workout.name}
                />

                <div className="plan-card-content">
                  <span className="category">
                    {workout.category}
                  </span>

                  <h3>{workout.name}</h3>

                  <p>{workout.equipment}</p>

                  <div className="stats">
                    <span>
                      <Clock3 size={15} />
                      {workout.duration} min
                    </span>

                    <span>
                      <Flame size={15} />
                      {workout.calories} kcal
                    </span>

                    <span>
                      <Star size={15} />
                      {workout.rating}
                    </span>
                  </div>

                  <div className="plan-actions">
                    <Link
                      href={`/workout/${workout.id}`}
                      className="secondary-btn"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>

                    {activeTab === "plan" && (
                      <>
                        <button
                          className="success-btn"
                          onClick={handleDone}
                        >
                          <Check size={16} />
                          Mark as Done
                        </button>

                        <button
                          className="danger-btn"
                          onClick={() =>
                            handleRemove(workout.id)
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
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}