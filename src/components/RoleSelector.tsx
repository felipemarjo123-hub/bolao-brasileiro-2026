"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelector({ 
  userId, 
  initialRole 
}: { 
  userId: string; 
  initialRole: string 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select 
      disabled={loading}
      value={initialRole}
      onChange={handleRoleChange}
      className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none"
    >
      <option value="USER">👤 Jogador (Comum)</option>
      <option value="GERENTE">💼 Gerente</option>
      <option value="COLABORADOR">🛠️ Colaborador</option>
      <option value="SUPERVISOR">👁️ Supervisor</option>
      <option value="DONO">👑 Dono</option>
    </select>
  );
}
