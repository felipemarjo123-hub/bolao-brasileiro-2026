import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManagerPixSetup from "@/components/ManagerPixSetup";
import ManagerInviteGen from "@/components/ManagerInviteGen";
import TogglePaymentBtn from "@/components/TogglePaymentBtn";
import RoundSelector from "@/components/RoundSelector";

export default async function GerenteDashboard({
  searchParams,
}: {
  searchParams: { rodada?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const rodada = searchParams.rodada ? parseInt(searchParams.rodada) : 19;

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      createdInvites: true,
      invitedUsers: {
        include: {
          roundParticipations: { where: { round: rodada } }
        }
      }
    }
  });

  if (!me || (me.role !== 'GERENTE' && me.role !== 'DONO')) {
    redirect("/"); // Apenas gerentes ou o dono acessam isso
  }

  // Conta arrecadação desta rede
  const paidCount = me.invitedUsers.filter(u => u.roundParticipations[0]?.isPaid).length;
  const arrecadado = paidCount * 20;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">Painel do <span className="text-primary glow-neon">Gerente</span></h1>
          <p className="text-slate-400 mt-2">Bem-vindo, {me.name}. Faça a gestão da sua rede de apostadores.</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl text-center shadow-lg">
           <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Seu Caixa (Rodada {rodada})</p>
           <p className="text-3xl font-black text-emerald-400">R$ {arrecadado.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ManagerPixSetup initialPixKey={me.pixKey} />
        <ManagerInviteGen />
      </div>

      <div className="bg-card border border-slate-700 rounded-xl overflow-hidden shadow-2xl mt-8">
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Apostadores da sua Rede</h2>
          <RoundSelector currentRound={rodada} />
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700">
              <th className="p-4 font-bold text-slate-300">Jogador</th>
              <th className="p-4 font-bold text-slate-300 text-center">Cadastro via Link</th>
              <th className="p-4 font-bold text-slate-300 text-right">Aprovar Pagamento Pix</th>
            </tr>
          </thead>
          <tbody>
            {me.invitedUsers.map((user) => {
              const isPaid = user.roundParticipations[0]?.isPaid || false;
              
              return (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-white font-medium">{user.name} <span className="text-slate-500 text-xs ml-2">({user.email})</span></td>
                  <td className="p-4 text-slate-400 text-center text-sm">Validado</td>
                  <td className="p-4 text-right">
                    <TogglePaymentBtn userId={user.id} round={rodada} initialStatus={isPaid} />
                  </td>
                </tr>
              );
            })}
            
            {me.invitedUsers.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  Sua rede está vazia. Gere um código de convite acima e envie para seus contatos!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
