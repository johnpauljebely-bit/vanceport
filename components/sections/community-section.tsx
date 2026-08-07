export default function CommunitySection() {
  return (
    <section className="body-surface mx-auto max-w-[1100px] px-6 pb-16">
      <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-[#1c1c1e] p-10 text-white sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 font-mono text-xs font-semibold tracking-[0.06em] text-white">
            COMMUNITY
          </div>
          <h2 className="font-serif text-[clamp(24px,3vw,36px)] font-semibold">
            Join the Discord
          </h2>
        </div>
        <a
          href="https://discord.com"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1c1c1e] transition-transform hover:-translate-y-0.5"
        >
          Join →
        </a>
      </div>
    </section>
  );
}
