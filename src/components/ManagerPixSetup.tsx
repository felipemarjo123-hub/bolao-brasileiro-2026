"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerPixSetup({ initialPixKey }: { initialPixKey: string | null }) {
  const [pixKey, setPixKey] = useState(initialPixKey || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const savePix = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gerente/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixKey }),
      });
      if (res.ok) setMsg("Chave Pix salva com sucesso!");
    } catch (e) {
      setMsg("Erro ao salvar.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-white">Sua Chave Pix (Recebimentos)</h2>
      <p className="text-slate-400 text-sm">Esta chave será exibida para os apostadores da sua rede na hora de pagarem o bolão.</p>
      <div className="flex gap-4">
        <input 
          type="text" 
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder="CPF, E-mail, Celular ou Chave Aleatória"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:border-primary outline-none"
        />
        <button 
          onClick={savePix}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-black font-bold px-6 py-2 rounded-md transition-colors"
        >
          {loading ? "..." : "Salvar"}
        </button>
      </div>
      {msg && <p className="text-primary text-sm font-bold">{msg}</p>}
    </div>
  );
}
