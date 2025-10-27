import { StoryboardApp } from "@/components/storyboard/storyboard-app";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-8 px-6 pb-16 pt-12">
      <section className="rounded-3xl bg-gradient-to-r from-deepPurple to-[#302060] p-[1px] shadow-xl">
        <div className="glass-surface relative overflow-hidden rounded-[1.45rem] p-10">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber/20 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-teal/30 blur-3xl" />
          <div className="relative flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-deepPurple shadow-sm">
              StoryVid Studio
            </div>
            <h1 className="max-w-3xl text-4xl font-bold text-slate-900 md:text-5xl">
              Transform your script into an animated storyboard in minutes.
            </h1>
            <p className="max-w-2xl text-base text-slate-600 md:text-lg">
              StoryVid Storyboard Creator combines AI scene intelligence, professional SVG illustrations, and expressive motion presets to bring explainer videos to life without leaving your browser.
            </p>
          </div>
        </div>
      </section>

      <StoryboardApp />
    </main>
  );
}
