import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  Info,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "./_shared/AppShell";

type ExportFormat = "AEJ" | "AFD";
type ExportStatus = "Pronto" | "Em processamento" | "Concluído" | "Com avisos";

type ExportRecord = {
  id: string;
  format: ExportFormat;
  period: string;
  createdAt: string;
  author: string;
  status: ExportStatus;
  fileSize: string;
};

const initialHistory: ExportRecord[] = [
  {
    id: "exp-1",
    format: "AEJ",
    period: "01 mai — 31 mai 2025",
    createdAt: "31 mai 2025 · 09:42",
    author: "Mariana Prado",
    status: "Concluído",
    fileSize: "284 KB",
  },
  {
    id: "exp-2",
    format: "AFD",
    period: "01 mai — 31 mai 2025",
    createdAt: "31 mai 2025 · 09:41",
    author: "Mariana Prado",
    status: "Concluído",
    fileSize: "96 KB",
  },
  {
    id: "exp-3",
    format: "AEJ",
    period: "01 abr — 30 abr 2025",
    createdAt: "02 mai 2025 · 14:18",
    author: "Mariana Prado",
    status: "Com avisos",
    fileSize: "271 KB",
  },
  {
    id: "exp-4",
    format: "AFD",
    period: "01 abr — 30 abr 2025",
    createdAt: "02 mai 2025 · 14:17",
    author: "Mariana Prado",
    status: "Concluído",
    fileSize: "91 KB",
  },
];

const formatDate = (value: string) => {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
};

const formatDateForInput = (value: string) => {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : "Escolher data";
};

const statusStyles: Record<ExportStatus, string> = {
  Pronto: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "Em processamento": "border-blue-400/25 bg-blue-400/10 text-blue-200",
  Concluído: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "Com avisos": "border-amber-400/25 bg-amber-400/10 text-amber-200",
};

export function Compliance() {
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-05-31");
  const [selectedFormats, setSelectedFormats] = useState<ExportFormat[]>(["AEJ", "AFD"]);
  const [history, setHistory] = useState(initialHistory);
  const [activeFilter, setActiveFilter] = useState<"Todos" | ExportFormat>("Todos");
  const [generating, setGenerating] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [showValidation, setShowValidation] = useState(true);
  const generationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (generationTimer.current) clearTimeout(generationTimer.current);
  }, []);

  const invalidPeriod = Boolean(startDate && endDate && startDate > endDate);
  const canGenerate = selectedFormats.length > 0 && !invalidPeriod && !generating;

  const toggleFormat = (format: ExportFormat) => {
    setSelectedFormats((current) =>
      current.includes(format) ? current.filter((item) => item !== format) : [...current, format],
    );
  };

  const generateExports = () => {
    if (!canGenerate) return;
    const now = new Date();
    const timeLabel = `${now.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")} · ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    const periodLabel = `${formatDate(startDate)} — ${formatDate(endDate)} ${new Date(`${endDate}T12:00:00`).getFullYear()}`;
    const pending = selectedFormats.map((format) => ({
      id: `${format}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      format,
      period: periodLabel,
      createdAt: timeLabel,
      author: "Mariana Prado",
      status: "Em processamento" as const,
      fileSize: "—",
    }));

    setGenerating(true);
    setAnnouncement(`Preparando ${pending.map((item) => item.format).join(" e ")} para o período selecionado.`);
    setHistory((current) => [...pending, ...current]);

    generationTimer.current = setTimeout(() => {
      setHistory((current) =>
        current.map((record) =>
          pending.some((item) => item.id === record.id)
            ? { ...record, status: "Pronto", fileSize: record.format === "AEJ" ? "286 KB" : "98 KB" }
            : record,
        ),
      );
      setGenerating(false);
      setAnnouncement(`${pending.map((item) => item.format).join(" e ")} prontos para download.`);
    }, 1800);
  };

  const filteredHistory = history.filter((record) => activeFilter === "Todos" || record.format === activeFilter);

  return (
    <AppShell active="compliance">
      <div className="mx-auto max-w-[1440px] space-y-5 pb-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="nexo-enter">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#91A4B7]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#334155] bg-[#1A2E40] text-[#60A5FA]">
                <ShieldCheck size={14} />
              </span>
              Conformidade fiscal
            </div>
            <h1 className="text-[26px] font-semibold tracking-[-0.035em] text-[#F1F5F9] sm:text-[30px]">Compliance e arquivos</h1>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#91A4B7]">
              Gere arquivos fiscais de ponto e acompanhe cada exportação em um só lugar.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-lg border border-[#334155] bg-[#132A40] px-3 py-2 text-[11px] text-[#C4D0DC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            Dados de demonstração
            <Info size={13} className="ml-1 text-[#71869A]" />
          </div>
        </div>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]" aria-label="Gerar arquivos fiscais">
          <div className="nexo-enter overflow-hidden rounded-2xl border border-[#334155] bg-[#1E293B] [animation-delay:60ms]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#3182CE]/25 bg-[#3182CE]/10 text-[#60A5FA]">
                  <FileCheck2 size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Nova exportação</h2>
                  <p className="mt-0.5 text-[11px] text-[#91A4B7]">Selecione o período e os arquivos necessários</p>
                </div>
              </div>
              <span className="rounded-md border border-[#334155] bg-[#132A40] px-2 py-1 font-mono text-[10px] font-medium tracking-wide text-[#AAB9C8]">PORTARIA 671/2021</span>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <fieldset>
                <legend className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#AAB9C8]">
                  <CalendarDays size={14} className="text-[#60A5FA]" />
                  Período do arquivo
                </legend>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium text-[#91A4B7]">Data inicial</span>
                    <span className="relative flex h-10 items-center rounded-lg border border-[#334155] bg-[#132A40] px-3 text-[12px] text-slate-100 transition hover:border-slate-500">
                      <span aria-hidden="true">{formatDateForInput(startDate)}</span>
                      <CalendarDays size={14} aria-hidden="true" className="ml-auto text-[#7B91A6]" />
                      <input
                        aria-label="Data inicial do período"
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-lg opacity-0 [color-scheme:dark] focus-visible:shadow-[0_0_0_2px_#60A5FA]"
                      />
                    </span>
                  </label>
                  <ArrowRight aria-hidden="true" size={15} className="mb-3 hidden text-[#647B90] sm:block" />
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium text-[#91A4B7]">Data final</span>
                    <span className="relative flex h-10 items-center rounded-lg border border-[#334155] bg-[#132A40] px-3 text-[12px] text-slate-100 transition hover:border-slate-500">
                      <span aria-hidden="true">{formatDateForInput(endDate)}</span>
                      <CalendarDays size={14} aria-hidden="true" className="ml-auto text-[#7B91A6]" />
                      <input
                        aria-label="Data final do período"
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-lg opacity-0 [color-scheme:dark] focus-visible:shadow-[0_0_0_2px_#60A5FA]"
                      />
                    </span>
                  </label>
                </div>
                {invalidPeriod && (
                  <p role="alert" className="mt-2 flex items-center gap-1.5 text-[11px] text-[#FCA5A5]">
                    <AlertTriangle size={13} /> A data inicial deve ser anterior à data final.
                  </p>
                )}
              </fieldset>

              <fieldset>
                <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#AAB9C8]">Formato fiscal</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    { code: "AEJ" as const, title: "Arquivo Eletrônico de Jornada", description: "Registros tratados e informações da jornada." },
                    { code: "AFD" as const, title: "Arquivo Fonte de Dados", description: "Marcações originais do registrador de ponto." },
                  ]).map((item) => {
                    const selected = selectedFormats.includes(item.code);
                    return (
                      <button
                        key={item.code}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleFormat(item.code)}
                        className={`group flex min-h-[82px] items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                          selected
                            ? "border-[#3182CE]/70 bg-[#163B5B]/65"
                            : "border-[#334155] bg-[#132A40]/70 hover:border-[#52677C] hover:bg-[#162F45]"
                        }`}
                      >
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          selected ? "border-[#3182CE]/35 bg-[#3182CE]/15 text-[#7DB8F2]" : "border-[#334155] bg-[#1E293B] text-[#71869A]"
                        }`}>
                          <FileText size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-semibold text-slate-100">{item.code}</span>
                            <span className={`flex h-[17px] w-[17px] items-center justify-center rounded border ${
                              selected ? "border-[#3182CE] bg-[#3182CE] text-white" : "border-[#52677C] text-transparent"
                            }`} aria-hidden="true">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          </span>
                          <span className="mt-1 block text-[10px] leading-snug text-[#91A4B7]">{item.title}</span>
                          <span className="mt-1 block text-[10px] leading-snug text-[#71869A]">{item.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedFormats.length === 0 && <p className="mt-2 text-[11px] text-[#FBBF24]">Selecione ao menos um formato para continuar.</p>}
              </fieldset>

              <div className="flex flex-col gap-3 border-t border-[#334155] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2 text-[10px] leading-relaxed text-[#91A4B7]">
                  <Info size={13} className="mt-0.5 shrink-0 text-[#60A5FA]" />
                  <span>Os arquivos abrangem as marcações do período selecionado.<br className="hidden sm:block" /> Confira os avisos antes de concluir a exportação.</span>
                </div>
                <button
                  type="button"
                  onClick={generateExports}
                  disabled={!canGenerate}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2B6CB0] px-4 text-[12px] font-semibold text-white shadow-sm shadow-[#0A1B2C]/30 transition hover:bg-[#3182CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B] disabled:cursor-not-allowed disabled:bg-[#334155] disabled:text-[#8394A5]"
                >
                  {generating ? <><LoaderCircle size={15} className="animate-spin" /> Gerando arquivos…</> : <><FileCheck2 size={15} /> Gerar {selectedFormats.length === 2 ? "AEJ + AFD" : selectedFormats[0] || "arquivos"}</>}
                </button>
              </div>
              <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
            </div>
          </div>

          <aside className="nexo-enter flex flex-col rounded-2xl border border-[#334155] bg-[#1A2E40] p-5 [animation-delay:110ms]" aria-label="Validação do período">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#AAB9C8]">
                  <ShieldCheck size={15} className="text-[#10B981]" /> Validação do período
                </div>
                <p className="mt-2 text-[12px] text-[#91A4B7]">Antes de gerar, atenção a estes pontos:</p>
              </div>
              <button
                type="button"
                onClick={() => setShowValidation((shown) => !shown)}
                aria-expanded={showValidation}
                aria-label={showValidation ? "Recolher avisos de validação" : "Expandir avisos de validação"}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#334155] text-[#91A4B7] transition hover:bg-[#243A4F] hover:text-white"
              >
                <ChevronDown size={14} className={`transition-transform ${showValidation ? "" : "-rotate-90"}`} />
              </button>
            </div>

            {showValidation && (
              <div className="mt-4 space-y-2.5">
                <div className="flex gap-2.5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#F5D28A]">2 marcações sem localização</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#AAB9C8]">Os registros serão incluídos; valide a origem antes do envio.</p>
                  </div>
                </div>
                <div className="flex gap-2.5 rounded-xl border border-[#334155] bg-[#132A40]/80 p-3">
                  <Clock3 size={15} className="mt-0.5 shrink-0 text-[#7DB8F2]" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#D7E2EC]">1 jornada com ajuste manual</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#91A4B7]">A justificativa ficará registrada no AEJ.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-2 text-[10px] text-[#9FE5C8]">
                  <CheckCircle2 size={14} />
                  Estrutura e período dentro do padrão fiscal
                </div>
              </div>
            )}

            <div className="mt-auto border-t border-[#334155] pt-4">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#91A4B7]">Última verificação</span>
                <span className="font-mono text-[#C4D0DC]">agora mesmo</span>
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-[#71869A]">Avisos são informativos e não impedem a geração. Dados desta tela são fictícios.</p>
            </div>
          </aside>
        </section>

        <section className="nexo-enter overflow-hidden rounded-2xl border border-[#334155] bg-[#1E293B] [animation-delay:160ms]" aria-labelledby="history-title">
          <div className="flex flex-col gap-3 border-b border-[#334155] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] bg-[#132A40] text-[#91A4B7]">
                <RefreshCw size={16} />
              </div>
              <div>
                <h2 id="history-title" className="text-sm font-semibold text-slate-100">Histórico de exportações</h2>
                <p className="mt-0.5 text-[10px] text-[#91A4B7]">Arquivos gerados neste ambiente de demonstração</p>
              </div>
            </div>
            <div className="flex w-fit items-center gap-1 rounded-lg border border-[#334155] bg-[#132A40] p-1" role="group" aria-label="Filtrar histórico por formato">
              {(["Todos", "AEJ", "AFD"] as const).map((filter) => (
                <button
                  type="button"
                  key={filter}
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-md px-3 py-1.5 text-[10px] font-semibold transition ${
                    activeFilter === filter ? "bg-[#244661] text-[#BFDBFE]" : "text-[#91A4B7] hover:text-slate-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#334155]/80 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#71869A]">
                  <th scope="col" className="px-6 py-3">Arquivo</th>
                  <th scope="col" className="px-4 py-3">Período</th>
                  <th scope="col" className="px-4 py-3">Gerado em</th>
                  <th scope="col" className="px-4 py-3">Responsável</th>
                  <th scope="col" className="px-4 py-3">Situação</th>
                  <th scope="col" className="px-5 py-3 text-right">Arquivo</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record) => {
                  const isProcessing = record.status === "Em processamento";
                  const isReady = record.status === "Pronto";
                  return (
                    <tr key={record.id} className="border-b border-[#334155]/60 last:border-0 transition-colors hover:bg-[#24384B]/45">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-[9px] font-bold ${
                            record.format === "AEJ" ? "border-[#3182CE]/20 bg-[#3182CE]/10 text-[#88BFF2]" : "border-[#64748B]/25 bg-[#475569]/15 text-[#C4D0DC]"
                          }`}>
                            {record.format}
                          </span>
                          <span className="text-[11px] font-semibold text-[#E2E8F0]">{record.format === "AEJ" ? "Arquivo de jornada" : "Fonte de dados"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[10px] text-[#C4D0DC]">{record.period}</td>
                      <td className="px-4 py-3.5 text-[10px] text-[#91A4B7]">{record.createdAt}</td>
                      <td className="px-4 py-3.5 text-[10px] text-[#C4D0DC]">{record.author}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-semibold ${statusStyles[record.status]}`}>
                          {isProcessing ? <LoaderCircle size={11} className="animate-spin" /> : isReady || record.status === "Concluído" ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                          {isReady ? "Pronto para baixar" : record.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isProcessing ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-[#8CBFF0]">
                            <LoaderCircle size={12} className="animate-spin" /> Preparando
                          </span>
                        ) : isReady ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#86DDBB]">
                            <Check size={12} /> {record.fileSize}
                          </span>
                        ) : (
                          <button
                            type="button"
                            title={`Baixar prévia demonstrativa do ${record.format}`}
                            onClick={() => setAnnouncement(`A prévia demonstrativa do ${record.format} não contém dados fiscais reais.`)}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium text-[#9EB4C8] transition hover:bg-[#132A40] hover:text-[#BFDBFE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
                          >
                            <ArrowDownToLine size={12} /> {record.fileSize}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <FileText size={20} className="mb-2 text-[#71869A]" />
                        <p className="text-[11px] font-semibold text-[#C4D0DC]">Nenhuma exportação neste formato</p>
                        <p className="mt-1 text-[10px] text-[#71869A]">Escolha AEJ ou AFD acima para gerar um arquivo.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#334155]/80 px-5 py-3 sm:px-6">
            <p className="text-[9px] text-[#71869A]">{filteredHistory.length} arquivos de exemplo</p>
            <span className="flex items-center gap-1.5 text-[9px] text-[#71869A]"><Info size={11} /> Nenhum registro real é exibido</span>
          </div>
        </section>

        <div className="flex items-start gap-2 rounded-lg border border-[#334155]/80 bg-[#10263A] px-3.5 py-3 text-[10px] leading-relaxed text-[#91A4B7]">
          <Info size={13} className="mt-0.5 shrink-0 text-[#7DB8F2]" />
          <p><span className="font-semibold text-[#C4D0DC]">Sobre os formatos:</span> o AEJ consolida informações de jornada para fins de fiscalização; o AFD preserva as marcações originais. Esta demonstração simula o fluxo de geração e não produz documentos oficiais.</p>
        </div>
      </div>
    </AppShell>
  );
}