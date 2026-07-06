"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function RoundSelector({ currentRound }: { currentRound: number }) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rodada = e.target.value;
    router.push(`/jogos?rodada=${rodada}`);
  };

  return (
    <select 
      className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1 text-white focus:outline-none focus:border-primary"
      defaultValue={currentRound}
      onChange={handleChange}
    >
      {[...Array(38)].map((_, i) => (
        <option key={i+1} value={i+1}>{i+1}ª Rodada</option>
      ))}
    </select>
  );
}
