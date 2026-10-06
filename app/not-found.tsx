import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 ERROR</p>

      <h1>WORKOUT NOT FOUND</h1>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link href="/" className="primary-btn">
        BACK TO WORKOUTS →
      </Link>
    </main>
  );
}