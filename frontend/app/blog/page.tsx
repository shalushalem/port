const posts = [
  "Designing Voice-First Portfolios That Convert",
  "Event-Driven UI Orchestration for AI Products",
  "Balancing Cinematic Frontends with SEO"
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-slate-200">
      <h1 className="mb-6 text-4xl font-semibold text-gradient">Blog</h1>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post} className="glass rounded-xl px-4 py-3">
            {post}
          </li>
        ))}
      </ul>
    </main>
  );
}
