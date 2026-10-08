import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="error-code">404</p>

      <h1>PAGE NOT FOUND</h1>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link href="/" className="primary-btn">
        Back to Home
      </Link>
    </section>
  );
}