import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Bolão Brasileirão 2026",
  description: "A melhor plataforma de palpites para o Campeonato Brasileiro",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const leader = await prisma.standingsBolao.findFirst({
    include: { user: true },
    orderBy: { totalPoints: 'desc' }
  });

  const totalPaid = await prisma.roundParticipation.count({
    where: { isPaid: true }
  });
  
  // Dividindo os valores conforme a regra (exemplo: 1/3 para a Sena da rodada e 2/3 para o prêmio final)
  const poolTotal = totalPaid * 20;
  const premioSena = Math.floor(poolTotal * 0.33);
  const premioFinal = poolTotal - premioSena;

  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          {/* Barra dos Acumulados - sempre visível */}
          <div className="w-full flex flex-col sm:flex-row border-b border-slate-700/50">
            {/* Prêmio Final */}
            <div className="flex-1 bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 border-r border-slate-700/30 py-1.5 px-4 flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 font-bold">🏆 Prêmio Final</span>
              <span className="text-sm sm:text-lg font-black text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                R$ {premioFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Sena da Rodada */}
            <div className="flex-1 bg-gradient-to-r from-yellow-700/40 to-yellow-600/30 py-1.5 px-4 flex items-center justify-center gap-2 sm:gap-3 shadow-[inset_0_0_15px_rgba(234,179,8,0.1)]">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-yellow-500 font-bold">🎯 Sena (6 acertos)</span>
              <span className="text-sm sm:text-lg font-black text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
                R$ {premioSena.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Marquee do líder */}
          {leader && (
            <div className="w-full bg-primary text-black py-1 overflow-hidden font-black tracking-widest text-[11px] sm:text-sm flex items-center border-b-2 border-yellow-300 shadow-[0_0_15px_rgba(204,255,0,0.6)] z-50 relative">
              <div className="animate-marquee min-w-full">
                🔥 O LÍDER DO SUPER BOLÃO BRASILEIRO É {leader.user.name?.toUpperCase()} COM {leader.totalPoints} PONTOS! 🔥
              </div>
            </div>
          )}

          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
            <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2 shrink-0">
                <img src="https://logodownload.org/wp-content/uploads/2017/04/campeonato-brasileiro-logo-1.png" alt="Bolão Brasileirão" className="h-8 sm:h-10 w-auto drop-shadow-md bg-white rounded-md p-0.5 sm:p-1" />
              </Link>

              {/* Nav - scrollável no mobile */}
              <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide ml-3">
                <Link href="/premios" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors text-xs sm:text-sm whitespace-nowrap">Prêmios 💰</Link>
                <Link href="/jogos" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm whitespace-nowrap">Jogos</Link>
                <Link href="/classificacao" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm whitespace-nowrap">Ranking</Link>
                <Link href="/regulamento" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm whitespace-nowrap hidden sm:inline">Regras</Link>
                <div className="group relative hidden md:block">
                  <button className="text-slate-500 hover:text-slate-300 transition-colors text-xs uppercase tracking-wider font-bold whitespace-nowrap">Admin ▼</button>
                  <div className="absolute hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 mt-2 p-2 rounded-lg shadow-xl right-0 z-50 min-w-40 gap-2">
                    <Link href="/admin/gerente" className="text-emerald-400 font-bold hover:text-emerald-300 hover:bg-slate-700 px-3 py-2 rounded text-sm">💰 Meu Caixa (Pix)</Link>
                    <Link href="/admin/pagamentos" className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded text-sm">Validar Pagamentos</Link>
                    <Link href="/admin/equipe" className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded text-sm">RH - Cargos</Link>
                    <Link href="/admin/repasses" className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded text-sm">Folha de Repasses</Link>
                  </div>
                </div>
                <Link href="/login" className="bg-primary hover:bg-primary-dark text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-bold transition-colors text-xs sm:text-sm whitespace-nowrap shrink-0">
                  Entrar
                </Link>
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 border-t border-slate-800 py-4 sm:py-6 text-center text-slate-400 text-xs sm:text-sm px-4">
            <p>© 2026 Bolão Brasileirão. Todos os direitos reservados.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
