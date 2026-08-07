import FaqAccordion from "@/components/sections/faq-accordion";

export default function FaqPage() {
  return (
    <section className="body-surface mx-auto max-w-[1100px] px-6 pb-24 pt-44">
      <div className="mb-3.5 font-mono text-xs font-semibold tracking-[0.06em] text-body-fg">
        FAQ
      </div>
      <h2 className="mb-6 font-serif text-[clamp(28px,4vw,46px)] font-semibold tracking-[-0.01em]">
        Questions
      </h2>
      <FaqAccordion />
    </section>
  );
}
