export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 text-center">
      <h1 className="text-4xl font-bold text-primary mb-8">Sobre a Plataforma</h1>
      
      <p className="text-lg text-slate-300 max-w-2xl mx-auto">
        Esta plataforma foi desenvolvida como um produto premium para gerenciar bolões do Campeonato Brasileiro Série A de 2026.
      </p>

      <div className="mt-12 bg-card border border-slate-700 rounded-xl p-8 inline-block text-left">
        <h3 className="text-xl font-semibold text-white mb-4">Tecnologias Utilizadas</h3>
        <ul className="list-disc list-inside text-slate-400 space-y-2">
          <li>Next.js (App Router)</li>
          <li>React Server Components</li>
          <li>PostgreSQL via Docker</li>
          <li>Prisma ORM</li>
          <li>Tailwind CSS</li>
          <li>NextAuth.js</li>
        </ul>
      </div>

      <p className="text-slate-500 mt-12">
        Desenvolvido para oferecer a melhor experiência em usabilidade e performance.
      </p>
    </div>
  );
}
