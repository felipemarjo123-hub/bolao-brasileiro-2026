import { prisma } from "@/lib/prisma";
import RoundSelector from "@/components/RoundSelector";
import TogglePaymentBtn from "@/components/TogglePaymentBtn";

export default async function PagamentosPage({
  searchParams,
}: {
  searchParams: { rodada?: string };
}) {
  const rodada = searchParams.rodada ? parseInt(searchParams.rodada) : 19;

  // Busca todos os usuários
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    include: {
      roundParticipations: {
        where: { round: rodada }
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">Gestão de <span className="text-primary glow-neon">Pagamentos</span></h1>
          <p className="text-slate-400 mt-2">Valide quem fez o Pix de R$ 20 para a rodada.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <label className="text-slate-400 text-sm">Selecione a Rodada:</label>
          <RoundSelector currentRound={rodada} />
        </div>
      </div>

      <div className="bg-card border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="p-4 font-bold text-slate-300">Jogador</th>
              <th className="p-4 font-bold text-slate-300 text-center">Email</th>
              <th className="p-4 font-bold text-slate-300 text-right">Status do Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const participation = user.roundParticipations[0];
              const isPaid = participation?.isPaid || false;
              
              return (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-white font-medium">{user.name}</td>
                  <td className="p-4 text-slate-400 text-center">{user.email}</td>
                  <td className="p-4 text-right">
                    <TogglePaymentBtn userId={user.id} round={rodada} initialStatus={isPaid} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
