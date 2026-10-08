const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";
const DONE_KEY = "fitlog-done";

type StorageId = string | number;

function isBrowser() {
  return typeof window !== "undefined";
}

function notify() {
  if (isBrowser()) {
    window.dispatchEvent(new Event("fitlog-storage"));
  }
}

function getStoredIds(key: string): string[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((id) => String(id));
  } catch {
    return [];
  }
}

function setStoredIds(
  key: string,
  ids: StorageId[]
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(ids.map((id) => String(id)))
  );

  notify();
}

// ==================== PLAN ====================

export function getPlan(): string[] {
  return getStoredIds(PLAN_KEY);
}

export function isInPlan(id: StorageId): boolean {
  const workoutId = String(id);

  return getPlan().includes(workoutId);
}

export function addToPlan(id: StorageId): void {
  const current = getPlan();
  const workoutId = String(id);

  if (current.length >= 5) {
    return;
  }

  if (current.includes(workoutId)) {
    return;
  }

  setStoredIds(PLAN_KEY, [
    ...current,
    workoutId,
  ]);
}

export function removeFromPlan(
  id: StorageId
): void {
  const workoutId = String(id);

  const updated = getPlan().filter(
    (item) => item !== workoutId
  );

  setStoredIds(PLAN_KEY, updated);
}

export function clearPlan(): void {
  setStoredIds(PLAN_KEY, []);
}

// ==================== SAVED ====================

export function getSaved(): string[] {
  return getStoredIds(SAVED_KEY);
}

export function isSaved(id: StorageId): boolean {
  const workoutId = String(id);

  return getSaved().includes(workoutId);
}

export function saveWorkout(
  id: StorageId
): void {
  const current = getSaved();
  const workoutId = String(id);

  if (current.includes(workoutId)) {
    return;
  }

  setStoredIds(SAVED_KEY, [
    ...current,
    workoutId,
  ]);
}

export function removeSaved(
  id: StorageId
): void {
  const workoutId = String(id);

  const updated = getSaved().filter(
    (item) => item !== workoutId
  );

  setStoredIds(SAVED_KEY, updated);
}

export function clearSaved(): void {
  setStoredIds(SAVED_KEY, []);
}

// ==================== DONE ====================

export function getDone(): string[] {
  return getStoredIds(DONE_KEY);
}

export function isDone(id: StorageId): boolean {
  const workoutId = String(id);

  return getDone().includes(workoutId);
}

export function markDone(id: StorageId): void {
  const current = getDone();
  const workoutId = String(id);

  if (current.includes(workoutId)) {
    return;
  }

  setStoredIds(DONE_KEY, [
    ...current,
    workoutId,
  ]);
}

export function clearDone(): void {
  setStoredIds(DONE_KEY, []);
}