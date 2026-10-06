"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPlan, getSaved } from "@/lib/storage";

export default function Navbar() {
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      setPlanCount(getPlan().length);
      setSavedCount(getSaved().length);
    };

    updateCounts();

    window.addEventListener("storage", updateCounts);
    window.addEventListener("fitlog-update", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("fitlog-update", updateCounts);
    };
  }, []);

  return (
    <header className="navbar">
      <Link href="/" className="logo">
        <span className="logo-icon">F</span>
        FITLOG
      </Link>

      <nav className="nav-links">
        <Link href="/">Workout</Link>
        <Link href="/my-plan">My Plan</Link>
      </nav>

      <div className="nav-badges">
        <Link href="/my-plan" className="plan-badge">
          Plan <span>{planCount}</span>
        </Link>

        <Link href="/my-plan" className="saved-badge">
          Saved <span>{savedCount}</span>
        </Link>
      </div>
    </header>
  );
}