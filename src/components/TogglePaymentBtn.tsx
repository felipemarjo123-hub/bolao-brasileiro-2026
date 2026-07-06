"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TogglePaymentBtn({ 
  userId, 
  round, 
  initialStatus 
}: { 
  userId: string; 
  round: number; 
  initialStatus: boolean 
}) {
  const [isPaid, setIsPaid] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, round, isPaid: !isPaid }),
      });

      if (res.ok) {
        setIsPaid(!isPaid);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
    >
      {loading ? "..." : isPaid ? "✅ Pago (R$ 20)" : "❌ Pendente"}
    </button>
  );
}
