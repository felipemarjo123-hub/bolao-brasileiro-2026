import React from 'react';

export default function RegulamentoPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in duration-700">
      
      {/* Cabeçalho */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          Regras do <span className="text-primary glow-neon">Bolão</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Nosso sistema de pontuação foi feito para ser simples, divertido e recompensar quem entende de futebol! Veja como funciona:
        </p>
      </div>

      {/* Regras de Convite */}
      <section className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🎫</span> Vagas Limitadas
        </h2>
        <p className="text-slate-300 leading-relaxed text-lg">
          Este bolão é **fechado e exclusivo**. O sistema comporta no máximo **1000 jogadores**. 
          Para participar, você precisa de um <strong>Código de Convite</strong> fornecido pelos administradores. 
          Sem o código, é impossível criar a conta. Corra e garanta o seu palpite antes que as vagas acabem!
        </p>
      </section>

      {/* Sistema de Pontuação */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white border-b border-slate-800 pb-4">
          Como funciona a pontuação?
        </h2>

        <div className="grid gap-6">
          
          {/* Regra 1: Placar Exato */}
          <div className="bg-card border-l-4 border-l-primary p-6 rounded-r-xl border border-y-slate-800 border-r-slate-800 hover:border-r-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">🎯 10 Pontos: Na Mosca!</h3>
                <p className="text-slate-400 text-lg mb-4">Você recebe a pontuação máxima se acertar o <strong>placar exato</strong> da partida.</p>
                <div className="bg-slate-900/50 p-4 rounded-lg inline-block text-slate-300">
                  <span className="text-primary font-bold">Exemplo:</span> Você apostou <strong>2x1</strong> para o Flamengo. O jogo terminou <strong>2x1</strong> para o Flamengo.
                </div>
              </div>
              <div className="bg-primary/10 text-primary font-black text-4xl p-4 rounded-xl hidden sm:block">
                +10
              </div>
            </div>
          </div>

          {/* Regra 2: Empate */}
          <div className="bg-card border-l-4 border-l-blue-400 p-6 rounded-r-xl border border-y-slate-800 border-r-slate-800 hover:border-r-blue-400/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">🤝 5 Pontos: Acertou que era Empate</h3>
                <p className="text-slate-400 text-lg mb-4">Se você apostou que o jogo terminaria empatado, e realmente empatou, mas você errou o número de gols.</p>
                <div className="bg-slate-900/50 p-4 rounded-lg inline-block text-slate-300">
                  <span className="text-blue-400 font-bold">Exemplo:</span> Você apostou <strong>1x1</strong>. O jogo terminou <strong>2x2</strong>.
                </div>
              </div>
              <div className="bg-blue-400/10 text-blue-400 font-black text-4xl p-4 rounded-xl hidden sm:block">
                +5
              </div>
            </div>
          </div>

          {/* Regra 3: Vitória */}
          <div className="bg-card border-l-4 border-l-emerald-400 p-6 rounded-r-xl border border-y-slate-800 border-r-slate-800 hover:border-r-emerald-400/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">🏆 4 Pontos: Acertou o Vencedor</h3>
                <p className="text-slate-400 text-lg mb-4">Se você acertar qual time vai ganhar (vitória), mas errar o placar exato.</p>
                <div className="bg-slate-900/50 p-4 rounded-lg inline-block text-slate-300">
                  <span className="text-emerald-400 font-bold">Exemplo:</span> Você apostou <strong>2x0</strong> para o São Paulo. O São Paulo ganhou por <strong>1x0</strong>.
                </div>
              </div>
              <div className="bg-emerald-400/10 text-emerald-400 font-black text-4xl p-4 rounded-xl hidden sm:block">
                +4
              </div>
            </div>
          </div>

          {/* Regra 4: Gol Consolador */}
          <div className="bg-card border-l-4 border-l-slate-400 p-6 rounded-r-xl border border-y-slate-800 border-r-slate-800 hover:border-r-slate-400/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">⚽ 1 Ponto: Acertou os Gols de 1 Time</h3>
                <p className="text-slate-400 text-lg mb-4">Você errou quem ia ganhar ou empatar, mas acertou os gols exatos de pelo menos um dos times.</p>
                <div className="bg-slate-900/50 p-4 rounded-lg inline-block text-slate-300">
                  <span className="text-slate-400 font-bold">Exemplo:</span> Você apostou <strong>1x0</strong> (Vitória do Time A). O jogo terminou <strong>1x3</strong> (Vitória do Time B). Você ganhou 1 ponto por acertar que o Time A faria 1 gol.
                </div>
              </div>
              <div className="bg-slate-400/10 text-slate-400 font-black text-4xl p-4 rounded-xl hidden sm:block">
                +1
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Observação Importante */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl text-yellow-200/80 text-center text-sm md:text-base">
        <strong>⚠️ Nota:</strong> As pontuações não se acumulam no mesmo jogo. O sistema sempre vai te dar a pontuação mais alta que o seu palpite atingir!
      </div>
    </div>
  );
}
