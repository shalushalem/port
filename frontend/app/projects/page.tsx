const projects = [
  {
    name: "AI Comic Generator",
    summary: "Prompt-to-comic pipeline with style consistency and iterative controls."
  },
  {
    name: "Voice OS Portfolio",
    summary: "Cinematic voice-first portfolio with event-driven UI orchestration."
  },
  {
    name: "Realtime Idea Analyzer",
    summary: "Speech-to-insight system for startup ideation sessions."
  }
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-slate-200">
      <h1 className="mb-8 text-4xl font-semibold text-gradient">Projects</h1>
      <div className="grid gap-4">
        {projects.map((project) => (
          <article key={project.name} className="glass rounded-2xl p-5">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="mt-2 text-slate-300">{project.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
