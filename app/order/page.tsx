const STEPS = [
  { num: "01", title: "Inquire", body: "Send a DM on Discord with what you need." },
  { num: "02", title: "Scope", body: "We agree on deliverables, timeline, and price." },
  { num: "03", title: "Deposit", body: "50% upfront to lock in the slot." },
  { num: "04", title: "Drafts", body: "You get rounds of revisions." },
  { num: "05", title: "Delivery", body: "Final files, handed off." },
];

export default function OrderPage() {
  return (
    <section className="body-surface mx-auto max-w-[1100px] px-6 pb-24 pt-44">
      <div className="mb-3.5 font-mono text-xs font-semibold tracking-[0.06em] text-body-fg">
        HOW TO ORDER
      </div>
      <h2 className="mb-6 font-serif text-[clamp(28px,4vw,46px)] font-semibold tracking-[-0.01em]">
        Commissions
      </h2>
      <div>
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="flex gap-5 border-b border-[#e5e2da] py-5 dark:border-white/10"
          >
            <div className="w-8 shrink-0 font-mono text-[13px] font-bold text-body-fg">
              {step.num}
            </div>
            <div>
              <h4 className="mb-1 font-serif text-base font-semibold">{step.title}</h4>
              <p className="text-[13px] text-body-muted">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
