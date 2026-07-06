import { prisma } from "@/lib/prisma";
import RoleSelector from "@/components/RoleSelector";
import AdminPixKeyEditor from "@/components/AdminPixKeyEditor";

export default async function EquipePage() {
  const users = await prisma.user.findMany({
    orderBy: [
      { role: 'asc' },
      { name: 'asc' }
    ]
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">RH - Gestão de <span className="text-primary glow-neon">Cargos</span></h1>
          <p className="text-slate-400 mt-2">Nomeie Gerentes, Supervisores e Colaboradores para a divisão de lucros.</p>
        </div>
      </div>

      <div className="bg-card border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="p-4 font-bold text-slate-300">Usuário</th>
              <th className="p-4 font-bold text-slate-300 text-center">Email</th>
              <th className="p-4 font-bold text-slate-300 w-1/4">Chave Pix</th>
              <th className="p-4 font-bold text-slate-300 text-right w-1/4">Cargo Atual</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="p-4 text-white font-medium">{user.name}</td>
                <td className="p-4 text-slate-400 text-center">{user.email}</td>
                <td className="p-4">
                  <AdminPixKeyEditor userId={user.id} initialPixKey={user.pixKey} />
                </td>
                <td className="p-4 text-right">
                  <RoleSelector userId={user.id} initialRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
