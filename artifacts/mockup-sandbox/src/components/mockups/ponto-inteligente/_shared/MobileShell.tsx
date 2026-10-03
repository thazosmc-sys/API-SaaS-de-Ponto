import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Activity, Clock3, House, ListChecks, UserRound } from "lucide-react";
import "../_group.css";

type MobileShellProps = {
  children: ReactNode;
  showNavigation?: boolean;
  active?: "inicio" | "historico" | "perfil";
};

const mobileNav = [
  { id: "inicio", label: "Início", icon: House, href: "/__mockup/preview/ponto-inteligente/Home" },
  { id: "historico", label: "Registros", icon: ListChecks, href: "/__mockup/preview/ponto-inteligente/Receipt" },
  { id: "perfil", label: "Perfil", icon: UserRound, href: "/__mockup/preview/ponto-inteligente/Access" },
] as const;

function getBrasiliaTime() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function MobileShell({ children, showNavigation = false, active = "inicio" }: MobileShellProps) {
  const [statusTime, setStatusTime] = useState(getBrasiliaTime);

  useEffect(() => {
    const timer = window.setInterval(() => setStatusTime(getBrasiliaTime()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div lang="pt-BR" className="mx-auto flex h-[844px] max-h-[844px] w-full max-w-[390px] flex-col overflow-hidden bg-[#0D233A] font-['Inter'] text-slate-100">
      <div className="flex h-8 shrink-0 items-center justify-between px-6 text-[11px] font-semibold text-white">
        <span>{statusTime}</span>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="flex items-end gap-[2px]"><i className="h-1.5 w-[2px] rounded-sm bg-current" /><i className="h-2 w-[2px] rounded-sm bg-current" /><i className="h-2.5 w-[2px] rounded-sm bg-current" /></span>
          <Activity size={12} />
          <span className="ml-1 h-2.5 w-5 rounded-[3px] border border-slate-400 p-[1px]"><span className="block h-full w-3/4 rounded-[1px] bg-[#10B981]" /></span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto nexo-scrollbar">{children}</div>
      {showNavigation && (
        <nav aria-label="Navegação do colaborador" className="grid shrink-0 grid-cols-3 border-t border-[#334155] bg-[#0A1B2C] px-2 py-2">
          {mobileNav.map(({ id, label, icon: Icon, href }) => (
            <a key={id} href={href} aria-current={active === id ? "page" : undefined} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[9px] font-medium transition-colors ${active === id ? "text-[#60A5FA]" : "text-slate-500 hover:text-slate-300"}`}>
              <Icon size={17} />
              {label}
            </a>
          ))}
        </nav>
      )}
      <div className="flex h-5 shrink-0 items-center justify-center bg-[#0A1B2C]">
        <span className="h-1 w-24 rounded-full bg-slate-600/80" />
      </div>
    </div>
  );
}

export function MobileBrand({ label = "Nexo Ponto" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3182CE] text-white shadow-lg shadow-blue-950/50"><Clock3 size={18} /></span>
      <span className="text-sm font-bold tracking-tight text-white">{label}<span className="text-[#60A5FA]">.</span></span>
    </div>
  );
}