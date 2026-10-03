import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  Filter,
  Search,
  X,
} from "lucide-react";
import { AppShell } from "./_shared/AppShell";

type PunchRow = {
  id: number;
  initials: string;
  name: string;
  department: string;
  shift: string;
  punches: string[];
  balance: string;
  anomaly: "Sem divergência" | "Batida ausente" | "Hora extra não autorizada";
  review?: {
    reason: string;
    original: string;
    requested: string;
    attachment: string;
  };
};

const sampleRows: PunchRow[] = [
  {
    id: 1, initials: "LM", name: "Lucas Martins", department: "Operações", shift: "Manhã · 06:00–14:20",
    punches: ["05:57", "10:02", "10:58", "14:18"], balance: "+00:06", anomaly: "Sem divergência",
  },
  {
    id: 2, initials: "AF", name: "Ana Ferreira", department: "Logística", shift: "Manhã · 07:00–15:20",
    punches: ["07:04", "11:31", "12:27", "—"], balance: "−03:53", anomaly: "Batida ausente",
    review: { reason: "Esqueci de registrar a saída. O coletor do portão estava indisponível.", original: "Saída · —", requested: "Saída · 15:17", attachment: "declaracao_turno_ana.pdf" },
  },
  {
    id: 3, initials: "RC", name: "Rafael Costa", department: "Operações", shift: "Tarde · 14:00–22:20",
    punches: ["13:56", "18:10", "19:04", "22:24"], balance: "+00:08", anomaly: "Sem divergência",
  },
  {
    id: 4, initials: "BC", name: "Beatriz Carvalho", department: "Expedição", shift: "Manhã · 06:00–14:20",
    punches: ["05:52", "10:06", "10:58", "16:42"], balance: "+02:22", anomaly: "Hora extra não autorizada",
    review: { reason: "Apoio emergencial na conferência do carregamento 4821.", original: "Saída · 14:20", requested: "Saída · 16:42", attachment: "ordem_carregamento_4821.jpg" },
  },
  {
    id: 5, initials: "JS", name: "João Silva", department: "Logística", shift: "Noite · 22:00–06:20",
    punches: ["21:54", "02:03", "02:58", "06:24"], balance: "+00:10", anomaly: "Sem divergência",
  },
  {
    id: 6, initials: "MP", name: "Marina Pereira", department: "Administrativo", shift: "Comercial · 08:00–17:00",
    punches: ["08:02", "12:01", "13:00", "17:03"], balance: "+00:01", anomaly: "Sem divergência",
  },
  {
    id: 7, initials: "DO", name: "Diego Oliveira", department: "Expedição", shift: "Tarde · 14:00–22:20",
    punches: ["14:11", "18:04", "18:59", "22:21"], balance: "+00:05", anomaly: "Sem divergência",
  },
  {
    id: 8, initials: "CM", name: "Camila Mendes", department: "Operações", shift: "Manhã · 06:00–14:20",
    punches: ["—", "10:01", "10:56", "14:19"], balance: "−01:57", anomaly: "Batida ausente",
    review: { reason: "A primeira batida foi feita no relógio alternativo durante a troca de equipamento.", original: "Entrada · —", requested: "Entrada · 06:03", attachment: "registro_relogio_alternativo.pdf" },
  },
];

const anomalyStyles: Record<PunchRow["anomaly"], string> = {
  "Sem divergência": "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
  "Batida ausente": "border-amber-400/25 bg-amber-400/[0.09] text-amber-200",
  "Hora extra não autorizada": "border-red-400/25 bg-red-400/[0.08] text-red-300",
};

function formatDateForDisplay(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : "Escolher data";
}

export function Timesheet() {
  const [department, setDepartment] = useState("Todos os departamentos");
  const [shift, setShift] = useState("Todos os turnos");
  const [date, setDate] = useState("2025-06-18");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reviewRow, setReviewRow] = useState<PunchRow | null>(null);
  const [feedback, setFeedback] = useState<{ type: "approved" | "returned"; text: string } | null>(null);
  const [decisions, setDecisions] = useState<Record<number, string>>({});
  const [reason, setReason] = useState("");

  const filteredRows = useMemo(() => sampleRows.filter((row) => {
    const departmentMatch = department === "Todos os departamentos" || row.department === department;
    const shiftMatch = shift === "Todos os turnos" || row.shift.startsWith(shift);
    const searchMatch = `${row.name} ${row.department}`.toLowerCase().includes(search.toLowerCase());
    return departmentMatch && shiftMatch && searchMatch && (!decisions[row.id] || decisions[row.id] === "Pendente");
  }), [department, shift, search, decisions]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const openReview = (row: PunchRow) => {
    setReason("");
    setReviewRow(row);
  };
  const decide = (action: "approved" | "returned") => {
    if (!reviewRow) return;
    const name = reviewRow.name.split(" ")[0];
    setDecisions((current) => ({ ...current, [reviewRow.id]: action === "approved" ? "Aprovado" : "Devolvido" }));
    setFeedback({
      type: action,
      text: action === "approved" ? `Ajuste de ${name} aprovado.` : `Solicitação de ${name} devolvida para correção.`,
    });
    setReviewRow(null);
    window.setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <AppShell active="timesheet">
      <div className="nexo-enter mx-auto max-w-[1440px]">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-medium text-slate-400">
              <span>Operação</span><span className="text-slate-600">/</span><span className="text-blue-300">Espelho de ponto</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-[25px] font-semibold tracking-[-0.035em] text-slate-50">Espelho de ponto</h1>
              <span className="rounded-md border border-[#334155] bg-[#132A40] px-2 py-1 text-[10px] font-medium text-slate-400">DADOS DE DEMONSTRAÇÃO</span>
            </div>
            <p className="mt-1 text-[12px] text-slate-400">Jornadas do dia e solicitações que precisam da sua atenção.</p>
          </div>
          <button type="button" onClick={() => setFeedback({ type: "approved", text: "Relatório de demonstração preparado para exportação." })} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#334155] bg-[#132A40] px-3 text-[11px] font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-[#18334D]">
            <Download size={14} /> Exportar relatório
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Pessoas no dia" value="148" detail="em 4 turnos" icon={<Clock3 size={16} />} tone="blue" />
          <SummaryCard label="Divergências abertas" value="05" detail="2 aguardam revisão" icon={<AlertTriangle size={16} />} tone="amber" />
          <SummaryCard label="Jornada conforme" value="96,6%" detail="143 registros sem alerta" icon={<CheckCircle2 size={16} />} tone="green" />
        </div>

        <section aria-label="Espelho diário" className="overflow-hidden rounded-xl border border-[#334155] bg-[#1E293B] shadow-[0_18px_55px_rgba(3,12,24,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] px-4 py-3">
            <div>
              <h2 className="text-[13px] font-semibold text-slate-100">Jornadas registradas</h2>
              <p className="mt-0.5 text-[10px] text-slate-500">Conferência diária · horários locais</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Conforme
              <span className="ml-2 h-2 w-2 rounded-full bg-[#F59E0B]" /> Revisão necessária
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-[#334155]/80 bg-[#172638]/70 px-4 py-2.5">
            <label className="relative flex h-8 min-w-[160px] flex-1 items-center gap-2 rounded-md border border-[#334155] bg-[#10263A] px-2.5 sm:max-w-[210px]">
              <Search size={13} className="shrink-0 text-slate-500" />
              <input aria-label="Buscar funcionário" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Buscar funcionário..." className="w-full bg-transparent text-[10px] text-slate-200 outline-none placeholder:text-slate-500" />
            </label>
            <label className="relative flex h-8 w-[142px] cursor-pointer items-center gap-1.5 rounded-md border border-[#334155] bg-[#10263A] px-2.5 text-[10px] text-slate-300 hover:border-slate-500">
              <CalendarDays size={13} className="text-slate-500" />
              <span className="sr-only">Data</span>
              <span aria-hidden="true">{formatDateForDisplay(date)}</span>
              <input aria-label="Data do espelho" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-md opacity-0 [color-scheme:dark] focus-visible:shadow-[0_0_0_2px_#60A5FA]" />
            </label>
            <SelectFilter label="Departamento" value={department} onChange={(value) => { setDepartment(value); setPage(1); }} options={["Todos os departamentos", "Operações", "Logística", "Expedição", "Administrativo"]} />
            <SelectFilter label="Turno" value={shift} onChange={(value) => { setShift(value); setPage(1); }} options={["Todos os turnos", "Manhã", "Tarde", "Noite", "Comercial"]} />
            <button type="button" onClick={() => { setDepartment("Todos os departamentos"); setShift("Todos os turnos"); setSearch(""); setPage(1); }} className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[10px] font-medium text-slate-400 transition hover:bg-[#22374B] hover:text-slate-200">
              <Filter size={12} /> Limpar filtros
            </button>
          </div>

          <div className="overflow-x-auto nexo-scrollbar">
            <table className="w-full min-w-[970px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#334155] bg-[#172638]/60 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-4 py-2.5">Funcionário <ArrowDown size={11} className="ml-1 inline text-slate-600" /></th>
                  <th className="px-3 py-2.5">Departamento</th>
                  <th className="px-3 py-2.5">Turno</th>
                  <th className="px-3 py-2.5">Marcações</th>
                  <th className="px-3 py-2.5">Saldo</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id} className="group border-b border-[#334155]/65 transition-colors hover:bg-[#22374B]/55 last:border-0">
                    <td className="px-4 py-[10px]">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#42617A]/50 bg-[#24435E] text-[9px] font-bold text-blue-200">{row.initials}</span>
                        <span className="text-[11px] font-semibold text-slate-200">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-[10px] text-[10px] text-slate-400">{row.department}</td>
                    <td className="px-3 py-[10px] text-[10px] text-slate-400">{row.shift}</td>
                    <td className="px-3 py-[10px]">
                      <div className="flex items-center gap-1 font-mono text-[10px] tabular-nums text-slate-300">
                        {row.punches.map((punch, index) => <span key={`${row.id}-${index}`} className={punch === "—" ? "text-amber-300" : ""}>{punch}{index < row.punches.length - 1 && <span className="px-1 text-slate-600">·</span>}</span>)}
                      </div>
                    </td>
                    <td className={`px-3 py-[10px] font-mono text-[10px] font-medium tabular-nums ${row.balance.startsWith("−") ? "text-amber-200" : "text-slate-300"}`}>{row.balance}</td>
                    <td className="px-3 py-[10px]">
                      <span className={`inline-flex max-w-[190px] items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-medium leading-none ${anomalyStyles[row.anomaly]}`}>
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.anomaly === "Sem divergência" ? "bg-emerald-400" : row.anomaly === "Batida ausente" ? "bg-amber-400" : "bg-red-400"}`} />
                        {row.anomaly}
                      </span>
                    </td>
                    <td className="px-4 py-[10px] text-right">
                      {decisions[row.id] ? <span className="text-[10px] font-medium text-emerald-300">{decisions[row.id]}</span> : row.review ? (
                        <button type="button" onClick={() => openReview(row)} className="rounded-md border border-[#3182CE]/50 bg-[#2B6CB0]/15 px-2.5 py-1.5 text-[10px] font-semibold text-blue-200 transition hover:bg-[#2B6CB0]/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60">Revisar</button>
                      ) : <span className="text-[10px] text-slate-600">—</span>}
                    </td>
                  </tr>
                ))}
                {visibleRows.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center"><div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] bg-[#132A40]"><Search size={15} className="text-slate-500" /></div><p className="text-[11px] font-medium text-slate-300">Nenhum registro encontrado</p><p className="mt-1 text-[10px] text-slate-500">Altere os filtros para ver outras jornadas.</p></td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#334155] bg-[#172638]/45 px-4 py-2.5">
            <span className="text-[10px] text-slate-500">Exibindo <span className="font-medium text-slate-300">{filteredRows.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRows.length)}</span> de <span className="font-medium text-slate-300">{filteredRows.length}</span> jornadas</span>
            <div className="flex items-center gap-1.5">
              <span className="mr-2 text-[10px] text-slate-500">Página {page} de {totalPages}</span>
              <button type="button" aria-label="Página anterior" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="flex h-7 w-7 items-center justify-center rounded-md border border-[#334155] text-slate-400 hover:bg-[#22374B] disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={13} /></button>
              <button type="button" aria-label="Próxima página" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="flex h-7 w-7 items-center justify-center rounded-md border border-[#334155] text-slate-400 hover:bg-[#22374B] disabled:cursor-not-allowed disabled:opacity-40"><ArrowRight size={13} /></button>
            </div>
          </div>
        </section>
        <p className="mt-3 text-[9px] text-slate-600">Os registros exibidos são exemplos de demonstração e não representam dados de produção.</p>
      </div>

      {feedback && (
        <div role="status" aria-live="polite" className="fixed right-5 top-5 z-[70] flex max-w-[360px] items-center gap-2.5 rounded-xl border border-emerald-400/25 bg-[#102B35] px-4 py-3 text-[12px] text-emerald-100 shadow-2xl shadow-black/40">
          <CheckCircle2 size={17} className="shrink-0 text-emerald-400" /> {feedback.text}
          <button type="button" aria-label="Fechar aviso" onClick={() => setFeedback(null)} className="ml-2 text-emerald-200/60 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {reviewRow && (
        <ReviewDialog row={reviewRow} reason={reason} setReason={setReason} onClose={() => setReviewRow(null)} onDecide={decide} />
      )}
    </AppShell>
  );
}

function SummaryCard({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: ReactNode; tone: "blue" | "amber" | "green" }) {
  const tones = {
    blue: "text-blue-300 bg-blue-400/10 border-blue-300/15",
    amber: "text-amber-300 bg-amber-400/10 border-amber-300/15",
    green: "text-emerald-300 bg-emerald-400/10 border-emerald-300/15",
  };
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-3">
      <div>
        <p className="text-[10px] font-medium text-slate-400">{label}</p>
        <div className="mt-1 flex items-baseline gap-2"><span className="text-[22px] font-semibold leading-none tracking-tight text-slate-100">{value}</span><span className="text-[9px] text-slate-500">{detail}</span></div>
      </div>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${tones[tone]}`}>{icon}</span>
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative flex h-8 items-center rounded-md border border-[#334155] bg-[#10263A] text-[10px] text-slate-300">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-full appearance-none bg-transparent py-0 pl-2.5 pr-7 outline-none">
        {options.map((option) => <option key={option} value={option} className="bg-[#10263A]">{option}</option>)}
      </select>
      <ChevronDown size={12} aria-hidden="true" className="pointer-events-none absolute right-2 text-slate-500" />
    </label>
  );
}

function ReviewDialog({ row, reason, setReason, onClose, onDecide }: { row: PunchRow; reason: string; setReason: (value: string) => void; onClose: () => void; onDecide: (action: "approved" | "returned") => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#020914]/75 p-4 backdrop-blur-[3px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="review-title" className="nexo-enter my-auto w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#3A5065] bg-[#172A3D] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between border-b border-[#334155] px-5 py-4">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300"><AlertTriangle size={17} /></span>
            <div><h2 id="review-title" className="text-[15px] font-semibold text-slate-100">Revisar ajuste de ponto</h2><p className="mt-1 text-[11px] text-slate-400">Confira as informações antes de decidir.</p></div>
          </div>
          <button type="button" aria-label="Fechar diálogo" onClick={onClose} className="rounded-md p-1 text-slate-500 transition hover:bg-[#263B4F] hover:text-slate-200"><X size={17} /></button>
        </div>
        <div className="space-y-4 px-5 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#334155] bg-[#10263A] p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#24435E] text-[10px] font-bold text-blue-200">{row.initials}</span>
            <div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-100">{row.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{row.department} <span className="px-1 text-slate-600">·</span> {row.shift}</p></div>
            <span className={`rounded-md border px-2 py-1 text-[9px] font-medium ${anomalyStyles[row.anomaly]}`}>{row.anomaly}</span>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Comparação de horários</p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <TimeCompare label="Original" value={row.review?.original ?? "—"} subtle />
              <ArrowDownUp size={14} className="text-slate-500" />
              <TimeCompare label="Solicitado" value={row.review?.requested ?? "—"} />
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Justificativa do colaborador</p>
            <p className="rounded-lg border border-[#334155] bg-[#10263A] px-3 py-2.5 text-[11px] leading-relaxed text-slate-300">{row.review?.reason}</p>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Anexo enviado</p>
            <button type="button" onClick={() => window.alert(`Pré-visualização de demonstração: ${row.review?.attachment}`)} className="flex w-full items-center gap-2.5 rounded-lg border border-[#334155] bg-[#10263A] px-3 py-2 text-left transition hover:border-slate-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-red-300/15 bg-red-400/10 text-red-300"><FileText size={15} /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-medium text-slate-200">{row.review?.attachment}</span><span className="mt-0.5 block text-[9px] text-slate-500">Anexo de demonstração · 248 KB</span></span>
              <span className="text-[9px] font-semibold text-blue-300">Visualizar</span>
            </button>
          </div>
          <div>
            <label htmlFor="review-reason" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Observação para devolução <span className="font-normal normal-case tracking-normal text-slate-600">· opcional</span></label>
            <textarea id="review-reason" value={reason} onChange={(event) => setReason(event.target.value)} rows={2} placeholder="Informe o que precisa ser corrigido..." className="w-full resize-none rounded-lg border border-[#334155] bg-[#10263A] px-3 py-2 text-[11px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#3182CE] focus:ring-2 focus:ring-[#3182CE]/20" />
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-[#334155] bg-[#132538] px-5 py-3">
          <button type="button" onClick={() => onDecide("returned")} className="inline-flex items-center gap-1.5 rounded-lg border border-[#475569] px-3 py-2 text-[10px] font-semibold text-slate-300 transition hover:border-red-400/50 hover:bg-red-400/[0.07] hover:text-red-200"><ArrowLeft size={13} /> Devolver para correção</button>
          <button type="button" onClick={() => onDecide("approved")} className="inline-flex items-center gap-1.5 rounded-lg bg-[#12835F] px-3.5 py-2 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#15966D] focus:outline-none focus:ring-2 focus:ring-emerald-300/60"><Check size={14} /> Aprovar ajuste</button>
        </div>
      </section>
    </div>
  );
}

function TimeCompare({ label, value, subtle = false }: { label: string; value: string; subtle?: boolean }) {
  return <div className={`rounded-lg border px-3 py-2.5 ${subtle ? "border-[#334155] bg-[#132538]" : "border-blue-400/25 bg-[#1C3851]"}`}><p className="text-[9px] font-medium text-slate-500">{label}</p><p className={`mt-1 font-mono text-[13px] font-semibold tabular-nums ${subtle ? "text-slate-300" : "text-blue-200"}`}>{value}</p></div>;
}