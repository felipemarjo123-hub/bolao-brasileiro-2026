import Link from "next/link";
import { prisma } from "@/lib/prisma";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default async function Home() {
  // Buscar Top 3 palpiteiros
  const topUsers = await prisma.standingsBolao.findMany({
    include: { user: { select: { name: true } } },
    orderBy: [
      { totalPoints: 'desc' },
      { exactScoreHits: 'desc' }
    ],
    take: 3
  });

  return (
    <div className="flex flex-col animate-in fade-in duration-700 w-full space-y-16">
      
      {/* HERO BANNER */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 bg-slate-900 border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
        
        {/* Usando uma imagem genérica de estádio de alta qualidade */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }} 
        />
        
        <div className="relative z-20 flex flex-col justify-center h-[50vh] min-h-[400px] px-8 md:px-16 w-full max-w-4xl">
          <span className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
            O Retorno Pós-Copa
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-lg">
            Brasileirão <span className="text-primary glow-neon">2026</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed">
            A bola volta a rolar! Dê seus palpites nos jogos decisivos, suba no ranking em tempo real e prove que você é o maior especialista em futebol.
          </p>
          <div className="flex flex-col gap-4 mt-2 w-full md:w-auto">
            <a 
              href="https://wa.me/5581981944356" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-[#43d854] to-[#25d366] text-white text-lg px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_10px_20px_rgba(37,211,102,0.4)] border border-[#25d366]/50 uppercase tracking-wide text-center flex justify-center items-center gap-3"
            >
              <WhatsAppIcon />
              Falar no WhatsApp
            </a>
            <Link 
              href="/jogos?rodada=19"
              className="bg-primary text-primary-foreground text-lg px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_10px_20px_rgba(204,255,0,0.3)] uppercase tracking-wide text-center"
            >
              Faça seu palpite
            </Link>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS / DESTAQUES */}
      <section className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Hall da Fama</h2>
            <p className="text-slate-400">Os maiores pontuadores do bolão até o momento.</p>
          </div>
          <Link href="/classificacao" className="text-primary hover:underline font-semibold mt-4 md:mt-0">
            Ver Ranking Completo &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topUsers.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-card rounded-xl border border-slate-800 text-slate-500">
              Ninguém pontuou ainda. Seja o primeiro!
            </div>
          ) : (
            topUsers.map((ranking, index) => (
              <div key={ranking.id} className="relative bg-card border border-slate-700 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-primary/50 transition-all duration-300">
                {/* Medalha */}
                <div className="absolute -top-5 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow-lg" 
                  style={{
                    backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#cd7f32',
                    color: index === 0 ? '#78350f' : index === 1 ? '#1e293b' : '#451a03'
                  }}>
                  {index + 1}
                </div>
                
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-3xl mb-4 font-black text-slate-500 border-2 border-slate-800 group-hover:border-primary transition-colors">
                  {ranking.user.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{ranking.user.name}</h3>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-4xl font-black text-primary">{ranking.totalPoints}</span>
                  <span className="text-slate-400 font-medium mb-1">pts</span>
                </div>
                <div className="text-sm text-slate-400 mt-4 flex gap-4">
                  <span>🎯 {ranking.exactScoreHits} exatos</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-16 text-left">
        <FeatureCard 
          icon="⚡"
          title="Tempo Real"
          description="Classificação do campeonato e do bolão atualizadas instantaneamente."
        />
        <FeatureCard 
          icon="🛡️"
          title="Clubes Oficiais"
          description="Acompanhe os 20 gigantes da Série A do retorno Pós-Copa 2026."
        />
        <FeatureCard 
          icon="🎯"
          title="Regras Claras"
          description="Crave o placar e ganhe 10 pontos. Acerte o vencedor e leve 5."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="bg-card border border-slate-800 p-6 rounded-xl hover:border-primary/50 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}
