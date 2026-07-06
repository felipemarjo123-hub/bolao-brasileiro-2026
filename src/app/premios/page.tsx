import { prisma } from "@/lib/prisma";
import RoundSelector from "@/components/RoundSelector";

export default async function PremiosPage({
  searchParams,
}: {
  searchParams: { rodada?: string };
}) {
  const rodada = searchParams.rodada ? parseInt(searchParams.rodada) : 19;

  // Buscar Jackpots
  const jackpot6 = await prisma.jackpot.findUnique({ where: { type: '6_EXACTOS' } });
  const jackpot10 = await prisma.jackpot.findUnique({ where: { type: '10_ACERTOS' } });

  // Buscar número de pagantes da rodada
  const paidCount = await prisma.roundParticipation.count({
    where: { round: rodada, isPaid: true }
  });

  const TOTAL_ARRECADADO = paidCount * 20.0;

  // Divisão Matemática (Porcentagens enviadas pelo chefe)
  const premio1 = TOTAL_ARRECADADO * 0.45; // 45%
  const premio2 = TOTAL_ARRECADADO * 0.13; // 13%
  const premio3 = TOTAL_ARRECADADO * 0.07; // 7%
  
  const jackpot6Addition = TOTAL_ARRECADADO * 0.05; // 5%

  const feeGerentes = TOTAL_ARRECADADO * 0.05; // 5%
  const feeColab = TOTAL_ARRECADADO * 0.10; // 10%
  const feeSuper = TOTAL_ARRECADADO * 0.05; // 5%
  const feeDono = TOTAL_ARRECADADO * 0.10; // 10%

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      
      {/* SEÇÃO MILIONÁRIA: ACUMULADOS */}
      <section className="space-y-6">
        <h1 className="text-3xl font-black text-white text-center uppercase tracking-widest">
          Prêmios <span className="text-primary glow-neon">Acumulados</span>
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Jackpot 6 Exatos */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-primary p-8 rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.2)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <h2 className="text-xl font-bold text-slate-300 uppercase mb-2">Acumulado (6 Placares Exatos)</h2>
            <p className="text-5xl font-black text-primary glow-neon my-4">
              {formatCurrency(jackpot6?.amount || 0)}
            </p>
            <p className="text-sm text-slate-400">
              +{formatCurrency(jackpot6Addition)} previstos para somar ao final desta rodada.
            </p>
          </div>

          {/* Jackpot 10 Acertos */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-400 p-8 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.2)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <h2 className="text-xl font-bold text-slate-300 uppercase mb-2">Super Acumulado (10 Vencedores)</h2>
            <p className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] my-4">
              {formatCurrency(jackpot10?.amount || 0)}
            </p>
            <p className="text-sm text-slate-400">
              Gabarite quem ganha/empata em todos os 10 jogos da rodada para levar!
            </p>
          </div>
        </div>
      </section>

      {/* POT DA RODADA */}
      <section className="bg-card border border-slate-700 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Premiação da Rodada</h2>
            <p className="text-slate-400">Valor do Bolão: <strong className="text-white">R$ 20,00</strong> por jogador</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-700">
            <div className="text-center px-4 border-r border-slate-700">
              <p className="text-xs text-slate-400 uppercase">Pagantes</p>
              <p className="text-xl font-bold text-white">{paidCount}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-xs text-slate-400 uppercase">Apurado</p>
              <p className="text-xl font-bold text-emerald-400">{formatCurrency(TOTAL_ARRECADADO)}</p>
            </div>
          </div>
          <RoundSelector currentRound={rodada} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pódio Financeiro */}
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-xl text-center">
              <p className="text-3xl mb-1">🥇</p>
              <h3 className="font-bold text-amber-500 mb-2">1º Lugar (45%)</h3>
              <p className="text-2xl font-black text-white">{formatCurrency(premio1)}</p>
            </div>
            <div className="bg-slate-300/10 border border-slate-400/50 p-4 rounded-xl text-center">
              <p className="text-3xl mb-1">🥈</p>
              <h3 className="font-bold text-slate-400 mb-2">2º Lugar (13%)</h3>
              <p className="text-2xl font-black text-white">{formatCurrency(premio2)}</p>
            </div>
            <div className="bg-amber-700/10 border border-amber-700/50 p-4 rounded-xl text-center">
              <p className="text-3xl mb-1">🥉</p>
              <h3 className="font-bold text-amber-600 mb-2">3º Lugar (7%)</h3>
              <p className="text-2xl font-black text-white">{formatCurrency(premio3)}</p>
            </div>
          </div>

          {/* Distribuição Administrativa */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="font-bold text-white text-center border-b border-slate-800 pb-2">Repasses</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Acumulado (5%)</span>
              <span className="text-white font-bold">{formatCurrency(jackpot6Addition)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gerentes (5%)</span>
              <span className="text-white font-bold">{formatCurrency(feeGerentes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Colaboradores (10%)</span>
              <span className="text-white font-bold">{formatCurrency(feeColab)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Supervisor (5%)</span>
              <span className="text-white font-bold">{formatCurrency(feeSuper)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-800 pt-2">
              <span className="text-primary font-bold">Plataforma/Dono (10%)</span>
              <span className="text-primary font-black">{formatCurrency(feeDono)}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
