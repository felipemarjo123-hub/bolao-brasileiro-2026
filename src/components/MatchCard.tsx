"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string | null;
}

interface Match {
  id: string;
  matchDate: Date;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: Team;
  awayTeam: Team;
  round: number;
}

interface MatchCardProps {
  match: Match;
  userBet?: { homeBetScore: number, awayBetScore: number } | null;
}

export default function MatchCard({ match, userBet }: MatchCardProps) {
  const isMatchStarted = new Date() > new Date(match.matchDate);
  const [homeScore, setHomeScore] = useState<number | string>(userBet?.homeBetScore ?? "");
  const [awayScore, setAwayScore] = useState<number | string>(userBet?.awayBetScore ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveBet = async () => {
    if (homeScore === "" || awayScore === "") return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/palpites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
        }),
      });

      if (res.ok) {
        setMessage("Salvo!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await res.json();
        setMessage(data.message || "Erro");
      }
    } catch (e) {
      setMessage("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-slate-700 rounded-xl p-3 sm:p-4 flex flex-col items-center">
      {/* Data e Status */}
      <div className="text-[11px] sm:text-sm text-slate-400 mb-3 text-center">
        <span className="text-slate-500">R{match.round}</span>
        <span className="mx-1.5">•</span>
        {format(new Date(match.matchDate), "dd/MM 'às' HH:mm", { locale: ptBR })}
        {match.status === 'LIVE' && <span className="ml-2 text-red-500 font-bold animate-pulse">AO VIVO</span>}
        {match.status === 'FINISHED' && <span className="ml-2 text-primary font-bold">FIM</span>}
      </div>

      {/* Times e Placar */}
      <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-full flex items-center justify-center mb-1.5">
            {match.homeTeam.logoUrl ? (
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.shortName} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            ) : (
              <span className="font-bold text-slate-400 text-xs">{match.homeTeam.shortName}</span>
            )}
          </div>
          <span className="font-semibold text-center text-[11px] sm:text-sm leading-tight truncate w-full">{match.homeTeam.name}</span>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {match.status !== 'PENDING' ? (
            <div className="text-xl sm:text-3xl font-black bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md">
              {match.homeScore} <span className="text-slate-600">x</span> {match.awayScore}
            </div>
          ) : (
            <>
              <input 
                type="number" 
                min="0" 
                max="20"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                disabled={isMatchStarted}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-slate-900 border border-slate-700 rounded-md focus:border-primary focus:outline-none disabled:opacity-50"
              />
              <span className="text-slate-600 font-bold text-sm">X</span>
              <input 
                type="number" 
                min="0" 
                max="20"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                disabled={isMatchStarted}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-slate-900 border border-slate-700 rounded-md focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-full flex items-center justify-center mb-1.5">
            {match.awayTeam.logoUrl ? (
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.shortName} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            ) : (
              <span className="font-bold text-slate-400 text-xs">{match.awayTeam.shortName}</span>
            )}
          </div>
          <span className="font-semibold text-center text-[11px] sm:text-sm leading-tight truncate w-full">{match.awayTeam.name}</span>
        </div>
      </div>

      {/* Botão Salvar */}
      {match.status === 'PENDING' && !isMatchStarted && (
        <div className="mt-4 flex flex-col items-center w-full">
          <button 
            onClick={handleSaveBet}
            disabled={loading || homeScore === "" || awayScore === ""}
            className="w-full bg-slate-800 hover:bg-primary hover:text-black text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Salvando..." : "Salvar Palpite"}
          </button>
          {message && <span className="text-sm mt-2 text-primary">{message}</span>}
        </div>
      )}

      {/* Palpite já feito */}
      {isMatchStarted && userBet && (
        <div className="mt-3 w-full text-center text-xs sm:text-sm bg-slate-900 py-1.5 sm:py-2 rounded border border-slate-800">
          Seu palpite: <span className="font-bold">{userBet.homeBetScore} x {userBet.awayBetScore}</span>
        </div>
      )}
    </div>
  );
}
