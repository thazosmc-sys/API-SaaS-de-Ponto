import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Fingerprint,
  LocateFixed,
  MapPin,
  MoreHorizontal,
  Navigation,
  Radio,
  RefreshCw,
  ShieldCheck,
  Signal,
  Users,
  Wifi,
} from "lucide-react";
import { AppShell } from "./_shared/AppShell";

type ActivityKind = "biometria" | "gps";

type AttendanceEvent = {
  name: string;
  role: string;
  time: string;
  place: string;
  initials: string;
  tone: string;
  kind: ActivityKind;
  validation: string;
};

const attendanceEvents: AttendanceEvent[] = [
  {
    name: "Camila Nascimento",
    role: "Analista de logística",
    time: "08:42",
    place: "CD Guarulhos",
    initials: "CN",
    tone: "from-sky-500 to-blue-700",
    kind: "biometria",
    validation: "Face validada",
  },
  {
    name: "Rafael Oliveira",
    role: "Técnico de campo",
    time: "08:39",
    place: "Rota Norte · Osasco",
    initials: "RO",
    tone: "from-amber-500 to-orange-700",
    kind: "gps",
    validation: "GPS validado",
  },
  {
    name: "Joana Martins",
    role: "Supervisora de frota",
    time: "08:35",
    place: "CD Guarulhos",
    initials: "JM",
    tone: "from-violet-500 to-indigo-700",
    kind: "biometria",
    validation: "Face validada",
  },
  {
    name: "Diego Ferreira",
    role: "Técnico de campo",
    time: "08:31",
    place: "Rota Leste · Tatuapé",
    initials: "DF",
    tone: "from-emerald-500 to-teal-700",
    kind: "gps",
    validation: "GPS validado",
  },
  {
    name: "Paula Ribeiro",
    role: "Assistente de operações",
    time: "08:28",
    place: "Escritório · São Paulo",
    initials: "PR",
    tone: "from-rose-500 to-pink-700",
    kind: "biometria",
    validation: "Face validada",
  },
];

const metrics = [
  { label: "Presentes", value: "184", detail: "de 212 colaboradores", icon: Users, color: "#10B981", trend: "+8", trendType: "up" },
  { label: "Ausentes", value: "12", detail: "6 sem justificativa", icon: Users, color: "#EF4444", trend: "−3", trendType: "down" },
  { label: "Atrasados", value: "7", detail: "2 acima de 15 min", icon: Clock3, color: "#F59E0B", trend: "+2", trendType: "up" },
  { label: "Em intervalo", value: "23", detail: "retorno médio 09:18", icon: Activity, color: "#60A5FA", trend: "agora", trendType: "neutral" },
  { label: "Ajustes pendentes", value: "5", detail: "mais antigo há 2h", icon: ShieldCheck, color: "#C084FC", trend: "revisar", trendType: "neutral" },
];

function MetricCard({ metric, onClick, selected }: { metric: (typeof metrics)[number]; onClick: () => void; selected: boolean }) {
  const Icon = metric.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group min-w-0 rounded-xl border bg-[#1E293B] p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] ${
        selected ? "border-[#3182CE] ring-1 ring-[#3182CE]/40" : "border-[#334155]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-semibold text-slate-400">{metric.label}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-[#14283D]" style={{ color: metric.color }}>
          <Icon size={14} strokeWidth={2} />
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="font-['Inter'] text-[25px] font-semibold leading-none tracking-tight text-slate-50">{metric.value}</span>
        <span className={`mb-0.5 inline-flex items-center gap-1 text-[9px] font-semibold ${
          metric.trendType === "up" ? "text-[#FCA5A5]" : metric.trendType === "down" ? "text-[#6EE7B7]" : "text-slate-400"
        }`}>
          {metric.trendType === "up" && <ArrowUpRight size={11} />}
          {metric.trendType === "down" && <ArrowDownRight size={11} />}
          {metric.trend}
        </span>
      </div>
      <div className="mt-2 truncate text-[10px] text-slate-500">{metric.detail}</div>
    </button>
  );
}

function ValidationBadge({ kind, validation }: { kind: ActivityKind; validation: string }) {
  const isBiometric = kind === "biometria";
  const Icon = isBiometric ? Fingerprint : LocateFixed;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-semibold ${
      isBiometric
        ? "border-[#3182CE]/30 bg-[#163654] text-[#93C5FD]"
        : "border-[#10B981]/25 bg-[#12392F] text-[#6EE7B7]"
    }`}>
      <Icon size={11} strokeWidth={2.2} />
      {validation}
    </span>
  );
}

function OperationalMap({ mode }: { mode: "todos" | "campo" | "remoto" }) {
  const showField = mode !== "remoto";
  const showRemote = mode !== "campo";
  return (
    <div className="relative h-[260px] overflow-hidden rounded-xl border border-[#334155] bg-[#0F263B] sm:h-[296px]" aria-label="Mapa esquemático de marcações e cercas virtuais">
      <div className="absolute inset-0 nexo-grid opacity-60" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-20 65 C105 87 177 21 282 55 S466 114 753 45" fill="none" stroke="#29445A" strokeWidth="15" />
        <path d="M-20 65 C105 87 177 21 282 55 S466 114 753 45" fill="none" stroke="#36536A" strokeWidth="1.5" strokeDasharray="4 7" />
        <path d="M68 340 C126 254 172 227 210 150 S280 44 325 -22" fill="none" stroke="#29445A" strokeWidth="12" />
        <path d="M68 340 C126 254 172 227 210 150 S280 44 325 -22" fill="none" stroke="#36536A" strokeWidth="1.5" strokeDasharray="4 7" />
        <path d="M428 333 C415 240 460 193 467 135 S516 43 603 -20" fill="none" stroke="#29445A" strokeWidth="10" />
        <path d="M428 333 C415 240 460 193 467 135 S516 43 603 -20" fill="none" stroke="#36536A" strokeWidth="1.5" strokeDasharray="4 7" />
        <path d="M-10 232 C92 198 178 209 278 227 S487 252 740 202" fill="none" stroke="#29445A" strokeWidth="9" />
        <path d="M-10 232 C92 198 178 209 278 227 S487 252 740 202" fill="none" stroke="#36536A" strokeWidth="1.5" strokeDasharray="4 7" />
        <path d="M302 68 C362 47 411 77 432 117 C453 157 427 205 384 215 C340 225 294 196 287 151 C281 115 286 83 302 68Z" fill="rgb(49 130 206 / 7%)" stroke="#3182CE" strokeWidth="1.5" strokeDasharray="6 5" />
        <path d="M504 198 C547 174 596 184 617 215 C636 244 619 272 582 280 C543 288 503 269 492 239 C484 220 489 207 504 198Z" fill="rgb(16 185 129 / 6%)" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 5" />
        <rect x="118" y="108" width="84" height="42" rx="5" fill="#19334A" stroke="#29465C" />
        <rect x="511" y="77" width="92" height="44" rx="5" fill="#19334A" stroke="#29465C" />
        <rect x="320" y="248" width="93" height="39" rx="5" fill="#19334A" stroke="#29465C" />
        <path d="M132 121h31M132 130h47M132 139h37M525 91h38M525 100h61M525 109h29M334 260h34M334 269h54" stroke="#36536A" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="absolute left-[43%] top-[39%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#60A5FA] bg-[#183C5B] text-[#BFDBFE] shadow-lg shadow-blue-950/50">
          <MapPin size={17} fill="#3182CE" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#0F263B] bg-[#10B981] text-[8px] font-bold text-[#06271E]">8</span>
        </span>
        <span className="mt-1 rounded bg-[#0A1B2C]/90 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300">CD Guarulhos</span>
      </div>
      <div className="absolute left-[77%] top-[67%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#34D399] bg-[#12392F] text-[#6EE7B7] shadow-lg shadow-emerald-950/40">
          <Navigation size={14} fill="#10B981" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#0F263B] bg-[#10B981] text-[8px] font-bold text-[#06271E]">4</span>
        </span>
        <span className="mt-1 rounded bg-[#0A1B2C]/90 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300">Rota Leste</span>
      </div>
      {showField && (
        <>
          <span className="absolute left-[27%] top-[67%] flex h-6 w-6 items-center justify-center rounded-full border border-[#10B981]/70 bg-[#12392F] text-[#6EE7B7]"><Navigation size={11} /></span>
          <span className="absolute left-[61%] top-[30%] flex h-6 w-6 items-center justify-center rounded-full border border-[#10B981]/70 bg-[#12392F] text-[#6EE7B7]"><Navigation size={11} /></span>
          <span className="absolute left-[69%] top-[48%] flex h-6 w-6 items-center justify-center rounded-full border border-[#10B981]/70 bg-[#12392F] text-[#6EE7B7]"><Navigation size={11} /></span>
        </>
      )}
      {showRemote && (
        <>
          <span className="absolute left-[54%] top-[71%] flex h-6 w-6 items-center justify-center rounded-full border border-[#60A5FA]/70 bg-[#163654] text-[#93C5FD]"><Wifi size={11} /></span>
          <span className="absolute left-[20%] top-[34%] flex h-6 w-6 items-center justify-center rounded-full border border-[#60A5FA]/70 bg-[#163654] text-[#93C5FD]"><Wifi size={11} /></span>
        </>
      )}
      <div className="absolute bottom-3 left-3 rounded-lg border border-[#334155]/80 bg-[#0A1B2C]/90 px-2.5 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[9px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Campo <span className="ml-1 h-2 w-2 rounded-full bg-[#60A5FA]" /> Remoto
        </div>
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-[#334155]/80 bg-[#0A1B2C]/90 px-2.5 py-1.5 text-[9px] font-medium text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> GPS ativo
      </div>
      <div className="absolute bottom-3 right-3 rounded-md border border-[#334155]/70 bg-[#0A1B2C]/80 px-2 py-1 text-[8px] font-medium tracking-wide text-slate-500">ZONA METROPOLITANA · SP</div>
    </div>
  );
}

export function Dashboard() {
  const [mapMode, setMapMode] = useState<"todos" | "campo" | "remoto">("todos");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [period, setPeriod] = useState("Hoje, 14 mai");
  const [periodOpen, setPeriodOpen] = useState(false);
  const visibleEvents = useMemo(() => showAllActivity ? attendanceEvents : attendanceEvents.slice(0, 4), [showAllActivity]);

  return (
    <AppShell active="overview">
      <div className="mx-auto max-w-[1440px] space-y-5">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#60A5FA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Operação em tempo real
            </div>
            <h1 className="text-[24px] font-semibold tracking-tight text-slate-50 sm:text-[27px]">Visão geral</h1>
            <p className="mt-1 text-[12px] text-slate-400">Acompanhe a jornada da equipe em um só lugar.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setPeriodOpen((open) => !open)}
                aria-expanded={periodOpen}
                className="flex h-9 items-center gap-2 rounded-lg border border-[#334155] bg-[#132A40] px-3 text-[11px] font-medium text-slate-300 transition hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
              >
                <CalendarDays size={14} className="text-slate-400" /> {period} <ChevronDown size={13} className="text-slate-500" />
              </button>
              {periodOpen && (
                <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-[#334155] bg-[#132A40] p-1 shadow-xl shadow-black/30">
                  {["Hoje, 14 mai", "Ontem, 13 mai", "Esta semana"].map((option) => (
                    <button key={option} type="button" onClick={() => { setPeriod(option); setPeriodOpen(false); }} className="block w-full rounded-md px-3 py-2 text-left text-[11px] text-slate-300 hover:bg-[#1E3A54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]">
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={() => { setMapMode("todos"); setSelectedMetric(null); }} aria-label="Atualizar visão" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#334155] bg-[#132A40] text-slate-400 transition hover:border-slate-500 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]">
              <RefreshCw size={14} />
            </button>
          </div>
        </section>

        <section aria-label="Indicadores da jornada" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} selected={selectedMetric === metric.label} onClick={() => setSelectedMetric((current) => current === metric.label ? null : metric.label)} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(365px,0.9fr)]">
          <div className="min-w-0 rounded-2xl border border-[#334155] bg-[#1E293B] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[14px] font-semibold text-slate-100">Marcações no mapa</h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-0.5 text-[9px] font-semibold text-[#6EE7B7]"><Radio size={10} /> AO VIVO</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">Localização das equipes e cercas virtuais</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-[#334155] bg-[#132A40] p-1" role="group" aria-label="Filtrar marcações no mapa">
                {(["todos", "campo", "remoto"] as const).map((mode) => (
                  <button key={mode} type="button" onClick={() => setMapMode(mode)} aria-pressed={mapMode === mode} className={`rounded-md px-2.5 py-1.5 text-[9px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] ${mapMode === mode ? "bg-[#2B6CB0] text-white" : "text-slate-400 hover:text-slate-200"}`}>
                    {mode === "todos" ? "Todos" : mode === "campo" ? "Campo" : "Remoto"}
                  </button>
                ))}
              </div>
            </div>
            <OperationalMap mode={mapMode} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4 text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> 18 em campo</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA]" /> 46 remotos</span>
                <span className="hidden items-center gap-1.5 md:inline-flex"><span className="h-1.5 w-1.5 rounded-full border border-[#3182CE]" /> 3 cercas ativas</span>
              </div>
              <button type="button" className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#93C5FD] transition hover:text-white focus-visible:outline-none focus-visible:underline">
                <LocateFixed size={12} /> Abrir mapa completo
              </button>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-[#334155] bg-[#1E293B]">
            <div className="flex items-start justify-between gap-2 border-b border-[#334155] px-4 py-4 sm:px-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[14px] font-semibold text-slate-100">Atividade recente</h2>
                  <span className="rounded-md bg-[#132A40] px-1.5 py-0.5 text-[9px] font-semibold text-slate-400">5 hoje</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">Últimas marcações registradas</p>
              </div>
              <button type="button" aria-label="Mais opções de atividade" className="rounded-md p-1 text-slate-500 transition hover:bg-[#132A40] hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"><MoreHorizontal size={17} /></button>
            </div>
            <div className="divide-y divide-[#334155]/75">
              {visibleEvents.map((event) => (
                <div key={event.name} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${event.tone} text-[10px] font-bold text-white ring-2 ring-[#1E293B]`} aria-hidden="true">
                    {event.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-semibold text-slate-200">{event.name}</span>
                      <time className="shrink-0 font-mono text-[10px] font-semibold text-slate-300">{event.time}</time>
                    </div>
                    <div className="mt-0.5 truncate text-[9px] text-slate-500">{event.role} <span className="px-1 text-slate-700">·</span> {event.place}</div>
                    <div className="mt-1.5"><ValidationBadge kind={event.kind} validation={event.validation} /></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#334155] px-4 py-3 sm:px-5">
              <button type="button" onClick={() => setShowAllActivity((show) => !show)} className="w-full rounded-lg py-1.5 text-center text-[10px] font-semibold text-[#93C5FD] transition hover:bg-[#132A40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]">
                {showAllActivity ? "Mostrar menos" : "Ver todas as atividades"}
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#334155]/80 bg-[#132A40]/65 px-4 py-2.5 text-[9px] text-slate-500">
          <span className="inline-flex items-center gap-1.5"><Signal size={12} className="text-[#10B981]" /> Atualização automática a cada 30 segundos</span>
          <span>Dados de demonstração · sincronizado às 08:44</span>
        </section>
      </div>
    </AppShell>
  );
}