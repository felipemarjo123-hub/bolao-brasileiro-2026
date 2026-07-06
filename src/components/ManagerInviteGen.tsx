"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerInviteGen() {
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState("");
  const router = useRouter();

  const generateCode = async (maxUses: number) => {
    setLoading(true);
    setCreatedCode("");
    try {
      const res = await fetch("/api/admin/gerente/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxUses }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedCode(data.invite.code);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-white">Gerar Links de Franquia</h2>
      <p className="text-slate-400 text-sm">Gere códigos únicos para vincular apostadores ou novos colaboradores diretamente à sua rede.</p>
      
      <div className="flex gap-4">
        <button 
          onClick={() => generateCode(1000)}
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-md transition-colors"
        >
          Gerar Código para Apostadores (Massa)
        </button>
        <button 
          onClick={() => generateCode(1)}
          disabled={loading}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-3 rounded-md transition-colors border border-slate-500"
        >
          Gerar Código para 1 Colaborador (Único)
        </button>
      </div>

      {createdCode && (
        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500 rounded-lg text-center animate-in fade-in zoom-in">
          <p className="text-sm text-slate-300 mb-1">Código gerado com sucesso! Envie isto:</p>
          <p className="text-3xl font-black text-emerald-400 tracking-widest uppercase">{createdCode}</p>
        </div>
      )}
    </div>
  );
}
