import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">WORKOUT LIBRARY</p>

        <h1>
          TRAIN WITH INTENT.
          <br />
          LOG EVERY SET.
        </h1>

        <p className="hero-text">
          FitLog is a dark, no-nonsense gym companion:
          pick a lift, lock it into today&apos;s plan,
          and watch the week&apos;s work add up.
        </p>

        <a href="#library" className="primary-btn">
          BROWSE WORKOUTS <span>→</span>
        </a>
      </div>

      <div className="hero-image">
        <Image
          src="/banner.png"
          alt="FitLog workout"
          width={800}
          height={600}
          priority
        />
      </div>
    </section>
  );
}