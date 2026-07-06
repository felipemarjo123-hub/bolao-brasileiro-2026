"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPixKeyEditor({ userId, initialPixKey }: { userId: string, initialPixKey: string | null }) {
  const [pixKey, setPixKey] = useState(initialPixKey || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/equipe/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pixKey }),
      });

      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder="Chave Pix"
          className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2 outline-none"
        />
        <button 
          onClick={handleSave}
          disabled={loading || pixKey === initialPixKey}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${saved ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50'}`}
        >
          {saved ? "OK!" : "Salvar"}
        </button>
      </div>
    </div>
  );
}
