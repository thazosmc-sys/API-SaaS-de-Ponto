import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Radio,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { MobileShell, MobileBrand } from "./_shared/MobileShell";

const captureHref = "/__mockup/preview/ponto-inteligente/Capture";

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function Home() {
  const [now, setNow] = useState(() => new Date());
  const [confirming, setConfirming] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <MobileShell showNavigation active="inicio">
      <main className="px-5 pb-5 pt-3 text-slate-100">
        <header className="mb-3 flex items-center justify-between">
          <MobileBrand />
          <div className="flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            Jornada ativa
          </div>
        </header>

        <section aria-label="Horário oficial" className="nexo-enter mb-3 rounded-[24px] border border-[#334155] bg-[#1A2E40] px-5 pb-4 pt-4 shadow-[0_16px_40px_rgba(2,12,24,0.18)]">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold capitalize tracking-wide text-slate-400">{formatDate(now)}</div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-300">
              <Radio size={12} />
              sincronizado
            </div>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <time className="font-['Inter'] text-[48px] font-semibold leading-none tracking-[-0.055em] tabular-nums text-white" aria-label={`Horário ${formatClock(now)}`}>
              {formatClock(now).slice(0, 5)}
            </time>
            <span className="pb-1 font-mono text-[15px] tabular-nums text-slate-400">{formatClock(now).slice(6, 8)}s</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
            <Clock3 size={12} className="text-[#60A5FA]" />
            Horário oficial de Brasília · atualização em tempo real
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#334155] pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#244661] text-[10px] font-bold tracking-wide text-[#BFDBFE]">RA</span>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold text-slate-100">Rafael Almeida</div>
                <div className="text-[10px] text-slate-400">Operações · Unidade Centro</div>
              </div>
            </div>
            <ShieldCheck size={17} className="shrink-0 text-[#60A5FA]" aria-label="Conta protegida" />
          </div>
        </section>

        <section className="nexo-enter mb-3 rounded-[20px] border border-[#334155] bg-[#1E293B] p-4" style={{ animationDelay: "70ms" }}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Seu turno de hoje</p>
              <p className="mt-1 text-[14px] font-semibold text-white">08:00 <span className="font-normal text-slate-500">—</span> 17:48</p>
            </div>
            <div className="rounded-lg border border-[#334155] bg-[#13283C] px-2.5 py-1.5 text-[10px] font-medium text-slate-300">Intervalo 1h</div>
          </div>
          <div className="flex items-center justify-between border-t border-[#334155] pt-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
                <Check size={14} strokeWidth={2.5} />
              </span>
              {registered ? "Marcação confirmada agora" : "Entrada registrada às 08:12"}
            </div>
            <span className="text-[10px] font-semibold text-[#60A5FA]">{registered ? "Concluída" : "Próxima: intervalo"}</span>
          </div>
        </section>

        <section className="nexo-enter mb-3" style={{ animationDelay: "130ms" }}>
          {!confirming ? (
            <a
              href={captureHref}
              onClick={(event) => {
                event.preventDefault();
                setConfirming(true);
              }}
              className="group flex min-h-[58px] w-full items-center justify-between rounded-2xl bg-[#3182CE] px-5 text-left shadow-[0_10px_24px_rgba(43,108,176,0.28)] transition duration-150 hover:bg-[#3B8DDA] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D233A]"
              aria-label="Bater ponto e iniciar confirmação"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Clock3 size={19} />
                </span>
                <span>
                  <span className="block text-[14px] font-bold tracking-wide text-white">BATER PONTO</span>
                  <span className="mt-0.5 block text-[10px] text-blue-100">Registrar próxima marcação</span>
                </span>
              </span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <div className="rounded-2xl border border-[#3182CE]/50 bg-[#153451] p-4 shadow-[0_10px_24px_rgba(2,12,24,0.2)]" role="status" aria-live="polite">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3182CE]/20 text-blue-200"><Clock3 size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-white">Tudo pronto para registrar</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-300">Confirme sua localização e revise a marcação na próxima etapa.</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setConfirming(false)} className="min-h-10 rounded-xl border border-[#475569] text-[11px] font-semibold text-slate-300 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">Agora não</button>
                <a href={captureHref} onClick={() => setRegistered(true)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#3182CE] text-[11px] font-bold text-white transition hover:bg-[#3B8DDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Continuar <ChevronRight size={14} /></a>
              </div>
            </div>
          )}
        </section>

        <div className="nexo-enter mb-3 flex items-center justify-between rounded-xl border border-[#334155]/80 bg-[#13283C] px-3 py-2.5" style={{ animationDelay: "180ms" }}>
          <div className="flex items-center gap-2 text-[10px] text-slate-300">
            <MapPin size={14} className="text-[#60A5FA]" />
            Localização pronta para validar
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-300">
            <Wifi size={13} />
            Conectado
          </div>
        </div>

        <section className="nexo-enter mb-2 rounded-[20px] border border-[#334155] bg-[#1E293B] p-4" style={{ animationDelay: "230ms" }} aria-label="Progresso diário de horas">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Horas de hoje</p>
              <p className="mt-1 text-[21px] font-semibold leading-6 text-white tabular-nums">3h 42<span className="ml-1 text-[12px] font-medium text-slate-400">/ 8h 48</span></p>
            </div>
            <span className="rounded-lg bg-[#10B981]/10 px-2 py-1 text-[10px] font-bold text-emerald-300">42%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0D233A]" role="progressbar" aria-label="Jornada diária cumprida" aria-valuemin={0} aria-valuemax={100} aria-valuenow={42}>
            <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#2B6CB0] to-[#10B981]" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            <span>Entrada · 08:12</span>
            <span>Meta diária · 8h 48</span>
          </div>
        </section>

        <section className="nexo-enter flex items-center justify-between rounded-[18px] border border-[#334155] bg-[#1A2E40] px-4 py-3" style={{ animationDelay: "280ms" }}>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]"><CheckCircle2 size={18} /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Saldo da semana</p>
              <p className="mt-0.5 text-[14px] font-semibold text-white">+00h42 <span className="text-[10px] font-medium text-emerald-300">positivo</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-500">semana atual</p>
            <p className="text-[10px] font-medium text-slate-300">38h 12 / 44h</p>
          </div>
        </section>
        <p className="mt-3 text-center text-[9px] text-slate-500">Dados de demonstração · seus registros são protegidos</p>
      </main>
    </MobileShell>
  );
}