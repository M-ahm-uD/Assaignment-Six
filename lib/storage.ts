import { Workout } from "./api";

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitUpdate() {
  if (!isBrowser()) return;

  window.dispatchEvent(
    new Event("fitlog-storage")
  );
}

export function getPlan(): Workout[] {
  if (!isBrowser()) return [];

  try {
    const data = localStorage.getItem(PLAN_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getSaved(): Workout[] {
  if (!isBrowser()) return [];

  try {
    const data = localStorage.getItem(SAVED_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToPlan(workout: Workout): boolean {
  if (!isBrowser()) return false;

  const current = getPlan();

  if (current.length >= 5) {
    return false;
  }

  if (
    current.some(
      (item) => item.id === workout.id
    )
  ) {
    return false;
  }

  localStorage.setItem(
    PLAN_KEY,
    JSON.stringify([...current, workout])
  );

  emitUpdate();

  return true;
}

export function saveWorkout(workout: Workout): boolean {
  if (!isBrowser()) return false;

  const current = getSaved();

  if (
    current.some(
      (item) => item.id === workout.id
    )
  ) {
    return false;
  }

  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify([...current, workout])
  );

  emitUpdate();

  return true;
}

export function removeFromPlan(id: number) {
  if (!isBrowser()) return;

  const updated = getPlan().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    PLAN_KEY,
    JSON.stringify(updated)
  );

  emitUpdate();
}

export function markDone() {
  if (!isBrowser()) return;

  const current = getPlan();

  if (current.length > 0) {
    const updated = current.slice(1);

    localStorage.setItem(
      PLAN_KEY,
      JSON.stringify(updated)
    );
  }

  emitUpdate();
}