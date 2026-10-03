import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  CircleHelp,
  Fingerprint,
  KeyRound,
  Languages,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { MobileBrand, MobileShell } from "./_shared/MobileShell";

type Language = "PT" | "EN" | "ES";
type AccessMode = "individual" | "kiosk";

const copy = {
  PT: {
    eyebrow: "PONTO • ACESSO DO COLABORADOR",
    title: "Seu tempo,\nno seu ritmo.",
    subtitle: "Entre para registrar sua jornada com tranquilidade.",
    individual: "Acesso individual",
    kiosk: "Quiosque / totem",
    individualHint: "Seu acesso pessoal, neste dispositivo.",
    kioskHint: "Dispositivo compartilhado da empresa.",
    fieldIndividual: "CPF ou matrícula",
    fieldKiosk: "Matrícula do colaborador",
    fieldPlaceholder: "Digite seu CPF ou matrícula",
    kioskPlaceholder: "Ex.: 004821",
    helperIndividual: "Use os dados informados pela sua empresa.",
    helperKiosk: "Ao sair, seus dados serão removidos desta sessão.",
    continue: "Continuar",
    kioskContinue: "Continuar no totem",
    protected: "Conexão protegida",
    private: "Acesso individual e privado",
    kioskPrivacy: "Não salve seus dados neste dispositivo",
    help: "Precisa de ajuda para acessar?",
    demo: "Entrar na demonstração",
    validation: "Informe ao menos 3 caracteres para continuar.",
    successTitle: "Identificação recebida",
    successText: "Esta é uma demonstração: nenhum dado foi enviado.",
    home: "Ir para o início",
    demoTag: "AMBIENTE DE DEMONSTRAÇÃO",
    personal: "PESSOAL",
    shared: "COMPARTILHADO",
  },
  EN: {
    eyebrow: "TIME CLOCK • EMPLOYEE ACCESS",
    title: "Your time,\non your terms.",
    subtitle: "Sign in to record your workday with confidence.",
    individual: "Personal access",
    kiosk: "Kiosk / terminal",
    individualHint: "Your personal access on this device.",
    kioskHint: "A company-shared device.",
    fieldIndividual: "CPF or employee ID",
    fieldKiosk: "Employee ID",
    fieldPlaceholder: "Enter your CPF or employee ID",
    kioskPlaceholder: "e.g. 004821",
    helperIndividual: "Use the details provided by your company.",
    helperKiosk: "Your details will be cleared when you leave.",
    continue: "Continue",
    kioskContinue: "Continue on kiosk",
    protected: "Protected connection",
    private: "Personal and private access",
    kioskPrivacy: "Do not save your details on this device",
    help: "Need help signing in?",
    demo: "Enter the demo",
    validation: "Enter at least 3 characters to continue.",
    successTitle: "Identification received",
    successText: "This is a demo: no information was submitted.",
    home: "Go to home",
    demoTag: "DEMO ENVIRONMENT",
    personal: "PERSONAL",
    shared: "SHARED",
  },
  ES: {
    eyebrow: "CONTROL HORARIO • ACCESO DEL COLABORADOR",
    title: "Tu tiempo,\na tu manera.",
    subtitle: "Accede para registrar tu jornada con tranquilidad.",
    individual: "Acceso individual",
    kiosk: "Quiosco / tótem",
    individualHint: "Tu acceso personal en este dispositivo.",
    kioskHint: "Dispositivo compartido de la empresa.",
    fieldIndividual: "CPF o matrícula",
    fieldKiosk: "Matrícula del colaborador",
    fieldPlaceholder: "Ingresa tu CPF o matrícula",
    kioskPlaceholder: "Ej.: 004821",
    helperIndividual: "Usa los datos proporcionados por tu empresa.",
    helperKiosk: "Al salir, tus datos se borrarán de esta sesión.",
    continue: "Continuar",
    kioskContinue: "Continuar en el tótem",
    protected: "Conexión protegida",
    private: "Acceso individual y privado",
    kioskPrivacy: "No guardes tus datos en este dispositivo",
    help: "¿Necesitas ayuda para acceder?",
    demo: "Entrar a la demostración",
    validation: "Ingresa al menos 3 caracteres para continuar.",
    successTitle: "Identificación recibida",
    successText: "Esta es una demostración: no se envió ningún dato.",
    home: "Ir al inicio",
    demoTag: "ENTORNO DE DEMOSTRACIÓN",
    personal: "PERSONAL",
    shared: "COMPARTIDO",
  },
} as const;

const languages: Language[] = ["PT", "EN", "ES"];

export function Access() {
  const [language, setLanguage] = useState<Language>("PT");
  const [mode, setMode] = useState<AccessMode>("individual");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = copy[language];
  const kiosk = mode === "kiosk";

  function chooseMode(nextMode: AccessMode) {
    setMode(nextMode);
    setError("");
    setSubmitted(false);
  }

  function submitAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (identifier.trim().length < 3) {
      setError(t.validation);
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <MobileShell>
      <main className="relative flex min-h-[784px] flex-col overflow-hidden px-6 pb-7 pt-5">
        <div aria-hidden="true" className="pointer-events-none absolute right-[-90px] top-[132px] h-[228px] w-[228px] rounded-full border border-[#3182CE]/10">
          <div className="absolute inset-5 rounded-full border border-dashed border-[#3182CE]/15" />
          <div className="absolute inset-[42px] rounded-full border border-[#3182CE]/10" />
          <span className="absolute left-[31px] top-[67px] h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          <span className="absolute bottom-[42px] right-[33px] h-1 w-1 rounded-full bg-[#3182CE]" />
        </div>

        <header className="relative z-10 flex items-center justify-between">
          <MobileBrand />
          <div className="relative flex items-center gap-1 rounded-xl border border-[#334155] bg-[#132A40] p-1">
            <Languages aria-hidden="true" size={13} className="ml-1 text-[#91A4B7]" />
            {languages.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setLanguage(item);
                  setError("");
                }}
                aria-label={`Idioma: ${item}`}
                aria-pressed={language === item}
                className={`min-h-7 min-w-8 rounded-lg px-1.5 text-[10px] font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] ${
                  language === item
                    ? "bg-[#2B6CB0] text-white"
                    : "text-slate-400 hover:bg-[#1E3A55] hover:text-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <section className="relative z-10 mt-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-5 bg-[#10B981]" />
            <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#9BB0C4]">
              {t.eyebrow}
            </p>
          </div>
          <h1 className="whitespace-pre-line text-[34px] font-semibold leading-[1.03] tracking-[-0.045em] text-[#F1F5F9]">
            {t.title}
          </h1>
          <p className="mt-3 max-w-[286px] text-[13px] leading-[1.55] text-[#A9BACB]">
            {t.subtitle}
          </p>
        </section>

        <section className="relative z-10 mt-6 rounded-[20px] border border-[#334155] bg-[#1A2E40] p-4 shadow-[0_18px_38px_rgba(2,12,24,0.22)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9BB0C4]">
              {language === "PT" ? "Como você vai acessar?" : language === "EN" ? "Choose how to sign in" : "¿Cómo vas a acceder?"}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#91A4B7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              {kiosk ? t.shared : t.personal}
            </span>
          </div>

          <div role="radiogroup" aria-label={language === "PT" ? "Tipo de acesso" : language === "EN" ? "Access type" : "Tipo de acceso"} className="grid grid-cols-2 gap-2">
            <button
              type="button"
              role="radio"
              aria-checked={!kiosk}
              onClick={() => chooseMode("individual")}
              className={`flex min-h-[62px] items-center gap-2.5 rounded-xl border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] ${
                !kiosk
                  ? "border-[#3182CE] bg-[#183C5C] text-white"
                  : "border-[#334155] bg-[#12283D] text-[#A9BACB] hover:border-[#506780]"
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${!kiosk ? "bg-[#2B6CB0] text-white" : "bg-[#1D354B] text-[#91A4B7]"}`}>
                <UserRound size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold leading-tight">{t.individual}</span>
                <span className="mt-1 block truncate text-[9px] text-[#91A4B7]">{t.individualHint}</span>
              </span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={kiosk}
              onClick={() => chooseMode("kiosk")}
              className={`flex min-h-[62px] items-center gap-2.5 rounded-xl border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] ${
                kiosk
                  ? "border-[#3182CE] bg-[#183C5C] text-white"
                  : "border-[#334155] bg-[#12283D] text-[#A9BACB] hover:border-[#506780]"
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${kiosk ? "bg-[#2B6CB0] text-white" : "bg-[#1D354B] text-[#91A4B7]"}`}>
                <Building2 size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold leading-tight">{t.kiosk}</span>
                <span className="mt-1 block truncate text-[9px] text-[#91A4B7]">{t.kioskHint}</span>
              </span>
            </button>
          </div>

          <form className="mt-5" onSubmit={submitAccess} noValidate>
            <label htmlFor="employee-id" className="mb-2 block text-[11px] font-semibold text-[#E2E8F0]">
              {kiosk ? t.fieldKiosk : t.fieldIndividual}
            </label>
            <div className={`flex h-[50px] items-center gap-3 rounded-xl border bg-[#0F2336] px-3.5 transition-colors focus-within:border-[#60A5FA] focus-within:ring-2 focus-within:ring-[#3182CE]/25 ${error ? "border-[#EF4444]" : "border-[#40546A]"}`}>
              {kiosk ? <KeyRound aria-hidden="true" size={17} className="shrink-0 text-[#8FA6BC]" /> : <Fingerprint aria-hidden="true" size={18} className="shrink-0 text-[#8FA6BC]" />}
              <input
                id="employee-id"
                name="identifier"
                type="text"
                autoComplete="username"
                inputMode={kiosk ? "numeric" : "text"}
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  setError("");
                  setSubmitted(false);
                }}
                placeholder={kiosk ? t.kioskPlaceholder : t.fieldPlaceholder}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "identifier-error" : "identifier-hint"}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#F1F5F9] outline-none placeholder:text-[#758BA0]"
              />
              {kiosk && <span aria-hidden="true" className="rounded border border-[#40546A] px-1.5 py-0.5 font-mono text-[9px] text-[#91A4B7]">ID</span>}
            </div>
            <p id={error ? "identifier-error" : "identifier-hint"} className={`mt-2 flex min-h-[15px] items-center gap-1.5 text-[10px] leading-[1.4] ${error ? "text-[#FCA5A5]" : "text-[#91A4B7]"}`}>
              {error ? <CircleHelp aria-hidden="true" size={12} /> : <LockKeyhole aria-hidden="true" size={11} />}
              {error || (kiosk ? t.helperKiosk : t.helperIndividual)}
            </p>

            <button
              type="submit"
              className="mt-4 flex h-[49px] w-full items-center justify-center gap-2 rounded-xl bg-[#2B6CB0] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(20,74,125,0.28)] transition-colors hover:bg-[#3182CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2E40] active:bg-[#245C98]"
            >
              {kiosk ? t.kioskContinue : t.continue}
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          </form>

          {submitted && (
            <div role="status" className="mt-3 rounded-xl border border-[#10B981]/35 bg-[#10B981]/10 px-3 py-2.5">
              <p className="flex items-center gap-2 text-[11px] font-semibold text-[#A7F3D0]">
                <BadgeCheck aria-hidden="true" size={15} />
                {t.successTitle}
              </p>
              <p className="mt-1 text-[10px] text-[#B8C9D8]">{t.successText}</p>
              <a href="/__mockup/preview/ponto-inteligente/Home" className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-[11px] font-bold text-[#93C5FD] underline decoration-[#93C5FD]/50 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]">
                {t.home}
                <ArrowRight aria-hidden="true" size={13} />
              </a>
            </div>
          )}
        </section>

        <div className={`relative z-10 mt-4 flex items-start gap-2.5 rounded-xl border px-3 py-2.5 ${kiosk ? "border-[#F59E0B]/30 bg-[#F59E0B]/[0.07]" : "border-[#334155]/80 bg-[#132A40]/75"}`}>
          {kiosk
            ? <ShieldCheck aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-[#FBBF24]" />
            : <LockKeyhole aria-hidden="true" size={14} className="mt-0.5 shrink-0 text-[#60A5FA]" />}
          <p className="text-[10px] leading-[1.45] text-[#A9BACB]">
            <span className="font-semibold text-[#D6E1EB]">{kiosk ? t.kioskPrivacy : t.protected}</span>
            {!kiosk && <span> · {t.private}</span>}
          </p>
          {kiosk && <ChevronDown aria-hidden="true" size={14} className="ml-auto mt-0.5 shrink-0 rotate-[-90deg] text-[#FBBF24]" />}
        </div>

        <footer className="relative z-10 mt-auto pt-5">
          <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#758BA0]">
            <span className="h-px flex-1 bg-[#334155]" />
            <span className="flex items-center gap-1.5"><ShieldCheck aria-hidden="true" size={12} />{t.demoTag}</span>
            <span className="h-px flex-1 bg-[#334155]" />
          </div>
          <div className="flex items-center justify-between">
            <a href="mailto:suporte@nexoponto.com.br" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg text-[10px] font-medium text-[#A9BACB] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]">
              <CircleHelp aria-hidden="true" size={14} />
              {t.help}
            </a>
            <a href="/__mockup/preview/ponto-inteligente/Home" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-[10px] font-bold text-[#93C5FD] transition-colors hover:bg-[#1B3852] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]">
              {t.demo}
              <ArrowRight aria-hidden="true" size={13} />
            </a>
          </div>
        </footer>
      </main>
    </MobileShell>
  );
}