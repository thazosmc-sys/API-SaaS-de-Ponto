import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2, Copy, FileCheck2, MapPin, ShieldCheck, Smartphone } from "lucide-react";
import { MobileShell } from "./_shared/MobileShell";

const receiptHash = "8f3a1c7e9b2d4f6a0c5e8b1d3a7f9c2e6b4d0a8f1c5e3b7d9a2f6c0e4b8d1a5c";
const recordedAt = new Date();
const recordedDateLabel = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
}).format(recordedAt);
const recordedTimeLabel = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "America/Sao_Paulo",
}).format(recordedAt);
const shareText = `Comprovante ilustrativo de registro de ponto — Nexo Ponto. Entrada registrada em ${recordedDateLabel} às ${recordedTimeLabel}.`;

export function Receipt() {
  const [copied, setCopied] = useState(false);

  async function copyHash() {
    try {
      await navigator.clipboard.writeText(receiptHash);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <MobileShell>
      <main className="nexo-enter px-5 pb-3 pt-2">
        <a
          href="/__mockup/preview/ponto-inteligente/Home"
          className="mb-2 inline-flex min-h-9 items-center gap-2 rounded-lg pr-2 text-[13px] font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
          aria-label="Voltar para o início"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Comprovante</span>
        </a>

        <section className="relative overflow-hidden rounded-[22px] border border-[#334155] bg-[#1E293B] px-5 pb-4 pt-5 shadow-[0_18px_42px_rgba(2,12,25,0.28)]">
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-emerald-300/10" />
          <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full border border-emerald-300/10" />

          <div className="relative flex flex-col items-center text-center">
            <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#10B981]/35 bg-[#10B981]/10 text-[#34D399]">
              <CheckCircle2 size={27} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#6EE7B7]">Registro confirmado</p>
            <h1 className="mt-1 text-[21px] font-bold tracking-[-0.035em] text-slate-50">Ponto registrado</h1>
            <p className="mt-1 text-[12px] leading-5 text-slate-400">Seu comprovante está pronto para guardar.</p>

            <div className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-[#10B981]/25 bg-[#102D36] px-4 py-2.5 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#34D399]">
                <Smartphone size={19} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#86CBB0]">Tipo de marcação</p>
                <p className="mt-0.5 text-[15px] font-bold text-slate-100">Entrada</p>
              </div>
              <span className="rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2.5 py-1 text-[10px] font-bold text-[#6EE7B7]">Confirmada</span>
            </div>
          </div>

          <div className="my-3 border-t border-dashed border-[#475569]" />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#132A40] text-[#93C5FD]">
                <span className="text-[11px] font-bold">00</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Data e horário local</p>
                <p className="mt-1 text-[13px] font-semibold text-slate-100">{recordedDateLabel}</p>
                <p className="mt-0.5 font-mono text-[12px] tabular-nums text-slate-300">{recordedTimeLabel} <span className="font-sans text-slate-500">BRT · UTC−03:00</span></p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#132A40] text-[#93C5FD]">
                <MapPin size={16} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Localização</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6EE7B7]">
                    <Check size={12} aria-hidden="true" /> GPS validado
                  </span>
                </div>
                <p className="mt-1 text-[12px] font-medium leading-[1.45] text-slate-200">Unidade Centro · São Paulo, SP</p>
                <p className="mt-0.5 text-[10px] text-slate-500">Precisão aproximada de 12 m</p>
              </div>
            </div>
          </div>

          <div className="my-3 border-t border-[#334155]" />

          <div className="rounded-xl border border-[#334155] bg-[#14283B] p-3.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCheck2 size={15} className="text-[#60A5FA]" aria-hidden="true" />
                <h2 className="text-[11px] font-bold text-slate-200">Protocolo SHA-256</h2>
              </div>
              <span className="text-[9px] font-medium text-slate-500">64 caracteres</span>
            </div>
            <code className="block break-all font-mono text-[10px] leading-[1.65] tracking-[0.025em] text-[#B8CCE0]">{receiptHash}</code>
            <button
              type="button"
              onClick={copyHash}
              className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#3B5872] bg-[#1B354D] px-3 text-[11px] font-semibold text-slate-200 transition hover:border-[#60A5FA] hover:bg-[#244661] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] active:scale-[0.99]"
              aria-live="polite"
            >
              {copied ? <Check size={14} className="text-[#34D399]" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Hash copiado" : "Copiar hash do protocolo"}
            </button>
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#334155]/80 bg-[#172A3D] px-3 py-2.5">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#60A5FA]" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-semibold text-slate-200">Assinatura digital indicativa</p>
              <p className="mt-0.5 text-[10px] leading-[1.5] text-slate-400">Este exemplo visual não representa um registro assinado ou validado em produção.</p>
            </div>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2.5">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2B6CB0] px-3 text-[12px] font-bold text-white transition hover:bg-[#3182CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D233A]"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-white/70 text-[10px] font-bold" aria-hidden="true">W</span>
            Compartilhar no WhatsApp
          </a>
          <a
            href="/__mockup/preview/ponto-inteligente/Home"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#334155] bg-[#1A2E40] px-3 text-[11px] font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
          >
            Início
          </a>
        </div>
        <p className="mt-3 text-center text-[9px] leading-4 text-slate-500">Comprovante demonstrativo · Dados fictícios para visualização</p>
      </main>
    </MobileShell>
  );
}