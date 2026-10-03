import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Glasses,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { MobileShell } from "./_shared/MobileShell";

export function Capture() {
  const [isReady, setIsReady] = useState(false);

  return (
    <MobileShell>
      <main className="min-h-full bg-[#0D233A] px-5 pb-7 pt-3 text-[#F1F5F9]">
        <header className="flex items-center justify-between">
          <a
            href="/__mockup/preview/ponto-inteligente/Home"
            aria-label="Voltar para o início"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#334155] bg-[#1A2E40] text-slate-300 transition-colors hover:bg-[#253D53] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
          >
            <ArrowLeft size={18} />
          </a>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#91A4B7]">
              Registro de ponto
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-200">Etapa 2 de 2</p>
          </div>
        </header>

        <section aria-labelledby="capture-title" className="nexo-enter pt-5">
          <div className="mb-4 flex items-center gap-2" aria-label="Etapas do registro">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-[#10B981]/12 px-2.5 text-[10px] font-semibold text-[#6EE7B7]">
              <Check size={12} strokeWidth={2.8} />
              Localização
            </span>
            <span className="h-px w-5 bg-[#10B981]/60" />
            <span className="flex h-6 items-center gap-1.5 rounded-full border border-[#3182CE]/50 bg-[#3182CE]/15 px-2.5 text-[10px] font-semibold text-[#BFDBFE]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
              Validação facial
            </span>
          </div>

          <h1 id="capture-title" className="text-[25px] font-bold leading-[1.14] tracking-[-0.035em] text-white">
            Confirme sua
            <br />
            identidade
          </h1>
          <p className="mt-2 max-w-[310px] text-[13px] leading-[1.55] text-[#AFC1D2]">
            Posicione o rosto no guia para validar seu registro com segurança.
          </p>
        </section>

        <section
          aria-label={isReady ? "Enquadramento facial pronto" : "Enquadramento facial precisa de ajuste"}
          className={`relative mt-5 flex h-[274px] items-center justify-center overflow-hidden rounded-[26px] border bg-[#10263A] transition-colors duration-300 ${
            isReady ? "border-[#10B981]/70" : "border-[#EF4444]/60"
          }`}
        >
          <div className="nexo-grid absolute inset-0 opacity-45" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#071827]/30 to-transparent" aria-hidden="true" />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-[#334155] bg-[#0D233A]/90 px-2.5 py-1.5 text-[9px] font-semibold text-[#AFC1D2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
            Prévia ilustrativa
          </div>

          <div
            className={`relative flex h-[218px] w-[156px] items-center justify-center rounded-[50%] border-2 transition-colors duration-300 ${
              isReady
                ? "border-[#10B981] shadow-[0_0_0_7px_rgba(16,185,129,0.10)]"
                : "border-[#EF4444] shadow-[0_0_0_7px_rgba(239,68,68,0.08)]"
            }`}
          >
            <div className="absolute inset-[7px] rounded-[50%] border border-dashed border-white/15" aria-hidden="true" />
            <div className="absolute left-1/2 top-[17%] h-2 w-2 -translate-x-1/2 rounded-full bg-white/45" aria-hidden="true" />
            <div className="flex flex-col items-center">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#567086] bg-[#233C52] text-[#9FB3C5]">
                <UserRound size={42} strokeWidth={1.15} />
              </div>
              <div className="mt-[-5px] h-[72px] w-[104px] rounded-t-[48px] border border-[#567086] bg-gradient-to-b from-[#29465D] to-[#20384E]" />
            </div>
            <span
              className={`absolute bottom-[-13px] flex h-7 min-w-[116px] items-center justify-center gap-1.5 rounded-full border px-3 text-[10px] font-bold ${
                isReady
                  ? "border-[#10B981]/50 bg-[#103D3B] text-[#6EE7B7]"
                  : "border-[#EF4444]/50 bg-[#442A36] text-[#FCA5A5]"
              }`}
            >
              {isReady ? <CheckCircle2 size={13} /> : <Circle size={11} />}
              {isReady ? "Enquadramento ok" : "Ajuste sua posição"}
            </span>
          </div>

          <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-[#91A4B7]">
            Câmera não ativada nesta prévia
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-2.5" aria-label="Verificações">
          <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1D3A50] text-[#60A5FA]">
                <ShieldCheck size={17} />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-slate-100">Prova de vida</p>
                <p className="mt-0.5 text-[9px] text-[#91A4B7]">Rosto visível</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[#FCD34D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              Aguardando validação
            </div>
          </div>

          <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#123C3B] text-[#6EE7B7]">
                <MapPin size={17} />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-slate-100">Localização</p>
                <p className="mt-0.5 text-[9px] text-[#91A4B7]">Unidade Centro</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[#6EE7B7]">
              <CheckCircle2 size={12} />
              GPS validado
            </div>
          </div>
        </section>

        <aside className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#334155]/90 bg-[#172D42] px-3 py-2.5">
          <Glasses size={16} className="mt-0.5 shrink-0 text-[#91A4B7]" aria-hidden="true" />
          <p className="text-[10px] leading-[1.45] text-[#AFC1D2]">
            Tire os óculos escuros e a máscara. Mantenha o rosto iluminado e olhe para a tela.
          </p>
        </aside>

        <div className="mt-4">
          {!isReady ? (
            <button
              type="button"
              onClick={() => setIsReady(true)}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2B6CB0] px-4 text-sm font-semibold text-white shadow-[0_5px_18px_rgba(10,43,78,0.35)] transition-colors hover:bg-[#3182CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D233A]"
              aria-describedby="prototype-note"
            >
              Simular enquadramento
            </button>
          ) : (
            <a
              href="/__mockup/preview/ponto-inteligente/Receipt"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] px-4 text-sm font-bold text-[#062B27] transition-colors hover:bg-[#34D399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EE7B7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D233A]"
            >
              <CheckCircle2 size={17} />
              Confirmar registro
            </a>
          )}
          <p id="prototype-note" className="mt-2 text-center text-[10px] text-[#91A4B7]">
            {isReady
              ? "Pronto para seguir. Esta ação é apenas uma simulação."
              : "A validação será simulada nesta prévia."}
          </p>
        </div>
      </main>
    </MobileShell>
  );
}