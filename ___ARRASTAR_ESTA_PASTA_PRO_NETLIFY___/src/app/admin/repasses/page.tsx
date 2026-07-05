import { prisma } from "@/lib/prisma";
import RoundSelector from "@/components/RoundSelector";
import ToggleStaffPayoutBtn from "@/components/ToggleStaffPayoutBtn";

export default async function RepassesPage({
  searchParams,
}: {
  searchParams: { rodada?: string };
}) {
  const rodada = searchParams.rodada ? parseInt(searchParams.rodada) : 19;

  // 1. Calcular Arrecadado Total
  const paidCount = await prisma.roundParticipation.count({
    where: { round: rodada, isPaid: true }
  });
  const TOTAL_ARRECADADO = paidCount * 20.0;

  // Fatias
  const fatiaGerentes = TOTAL_ARRECADADO * 0.05;
  const fatiaColaboradores = TOTAL_ARRECADADO * 0.10;
  const fatiaSupervisores = TOTAL_ARRECADADO * 0.05;
  const fatiaDono = TOTAL_ARRECADADO * 0.10;

  // 2. Buscar Membros da Equipe
  const staff = await prisma.user.findMany({
    where: { role: { in: ['GERENTE', 'COLABORADOR', 'SUPERVISOR', 'DONO'] } },
    include: {
      staffPayouts: {
        where: { round: rodada }
      }
    }
  });

  // 3. Contagem de pessoas por cargo
  const counts = {
    GERENTE: staff.filter(u => u.role === 'GERENTE').length || 1, // || 1 evita divisão por zero se o chefe não nomeou ninguém mas quer ver
    COLABORADOR: staff.filter(u => u.role === 'COLABORADOR').length || 1,
    SUPERVISOR: staff.filter(u => u.role === 'SUPERVISOR').length || 1,
    DONO: staff.filter(u => u.role === 'DONO').length || 1,
  };

  const getPayoutForRole = (role: string) => {
    switch (role) {
      case 'GERENTE': return fatiaGerentes / counts.GERENTE;
      case 'COLABORADOR': return fatiaColaboradores / counts.COLABORADOR;
      case 'SUPERVISOR': return fatiaSupervisores / counts.SUPERVISOR;
      case 'DONO': return fatiaDono / counts.DONO;
      default: return 0;
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">Folha de <span className="text-primary glow-neon">Repasses</span></h1>
          <p className="text-slate-400 mt-2">Dê o OK no pagamento (fictício) de cada membro da equipe nesta rodada.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <label className="text-slate-400 text-sm">Selecione a Rodada:</label>
          <RoundSelector currentRound={rodada} />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center">
          <p className="text-slate-400 text-sm">Bolo Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(TOTAL_ARRECADADO)}</p>
        </div>
      </div>

      <div className="bg-card border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="p-4 font-bold text-slate-300">Equipe (Nome)</th>
              <th className="p-4 font-bold text-slate-300 text-center">Cargo</th>
              <th className="p-4 font-bold text-slate-300 text-center">Valor a Receber</th>
              <th className="p-4 font-bold text-slate-300 text-right">Controle de Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((user) => {
              const amount = getPayoutForRole(user.role);
              const payout = user.staffPayouts[0];
              const isPaid = payout?.isPaid || false;

              return (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-white font-medium">{user.name}</td>
                  <td className="p-4 text-slate-400 text-center">
                    <span className="bg-slate-900 px-3 py-1 rounded text-xs border border-slate-700">{user.role}</span>
                  </td>
                  <td className="p-4 text-center font-bold text-primary">{formatCurrency(amount)}</td>
                  <td className="p-4 flex justify-end">
                    <ToggleStaffPayoutBtn userId={user.id} round={rodada} initialStatus={isPaid} amount={amount} />
                  </td>
                </tr>
              );
            })}
            
            {staff.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Ninguém foi nomeado para a equipe ainda. Vá em "RH - Gestão de Cargos" primeiro!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
