const CARDS = [
  { title: "UI Design", body: "Interfaces, components, states.", wide: false },
  {
    title: "Design Systems",
    body: "Tokens, patterns, documentation that scale past one project.",
    wide: true,
  },
  { title: "Branding", body: "Identity, type, color.", wide: false },
  { title: "Prototyping", body: "Click-through flows that feel real.", wide: false },
];

export default function CapabilitiesSection() {
  return (
    <section className="body-surface mx-auto max-w-[1100px] px-6 py-28">
      <div className="mb-3.5 font-mono text-xs font-semibold tracking-[0.06em] text-body-fg">
        CAPABILITIES
      </div>
      <h2 className="mb-5 font-serif text-[clamp(28px,4vw,46px)] font-semibold tracking-[-0.01em]">
        Built for how design actually happens
      </h2>
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className={`flex min-h-[150px] flex-col justify-between rounded-[20px] bg-paper p-5 ${
              card.wide ? "col-span-2" : "col-span-1"
            }`}
          >
            <h4 className="font-serif text-[15px] font-semibold">{card.title}</h4>
            <p className="mt-1.5 text-xs text-body-muted">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
