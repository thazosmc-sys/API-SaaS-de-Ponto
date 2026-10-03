import type { ReactNode } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  Search,
  Settings2,
  Users,
} from "lucide-react";
import "../_group.css";

const navItems = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard, href: "/__mockup/preview/ponto-inteligente/Dashboard" },
  { id: "timesheet", label: "Espelho de ponto", icon: Clock3, href: "/__mockup/preview/ponto-inteligente/Timesheet" },
  { id: "people", label: "Funcionários", icon: Users, href: "/__mockup/preview/ponto-inteligente/Timesheet" },
  { id: "compliance", label: "Compliance", icon: FileCheck2, href: "/__mockup/preview/ponto-inteligente/Compliance" },
];

type AppShellProps = {
  active: string;
  children: ReactNode;
};

export function AppShell({ active, children }: AppShellProps) {
  return (
    <div lang="pt-BR" className="min-h-screen w-full bg-[#0D233A] font-['Inter'] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-[226px] shrink-0 flex-col border-r border-[#334155] bg-[#0A1B2C] px-4 py-5">
          <a href="/__mockup/preview/ponto-inteligente/Dashboard" className="mb-9 flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3182CE] text-white shadow-lg shadow-blue-950/50">
              <Clock3 size={21} strokeWidth={2.4} />
            </span>
            <span>
              <span className="block text-[15px] font-bold tracking-tight text-white">nexo<span className="text-[#60A5FA]">.</span></span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">controle de ponto</span>
            </span>
          </a>

          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Operação</div>
          <nav aria-label="Navegação principal" className="space-y-1">
            {navItems.map(({ id, label, icon: Icon, href }) => {
              const selected = active === id || (active === "people" && id === "timesheet");
              return (
                <a
                  key={id}
                  href={href}
                  aria-current={selected ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    selected
                      ? "bg-[#163B5B] text-[#93C5FD] ring-1 ring-inset ring-[#2B6CB0]/40"
                      : "text-slate-400 hover:bg-[#13283C] hover:text-slate-100"
                  }`}
                >
                  <Icon size={17} className={selected ? "text-[#60A5FA]" : "text-slate-500 group-hover:text-slate-300"} />
                  {label}
                  {id === "timesheet" && (
                    <span className="ml-auto rounded-full bg-[#F59E0B]/15 px-2 py-0.5 text-[10px] font-bold text-[#FBBF24]">5</span>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="mt-8 mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Administração</div>
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-400 transition-colors hover:bg-[#13283C] hover:text-slate-100">
            <Settings2 size={17} className="text-slate-500" />
            Configurações
          </a>

          <div className="mt-auto rounded-2xl border border-[#334155] bg-[#10263A] p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-300"><Activity size={14} className="text-[#10B981]" /> Sistema ativo</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">Última sincronização<br /><span className="font-medium text-slate-400">há 24 segundos</span></p>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-[#334155] px-1 pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27435B] text-[11px] font-bold text-[#BFDBFE]">MP</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-semibold text-slate-200">Mariana Prado</div>
              <div className="text-[10px] text-slate-500">Administradora</div>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex h-[68px] items-center justify-between border-b border-[#334155]/80 bg-[#0D233A]/90 px-7">
            <button className="flex items-center gap-2 rounded-lg border border-[#334155] bg-[#132A40] px-3 py-2 text-left text-[11px] text-slate-300 transition hover:border-slate-500" aria-label="Selecionar organização">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#244661] text-[9px] font-black text-[#BFDBFE]">NL</span>
              <span className="font-semibold">Norte Logística</span>
              <ChevronDown size={13} className="text-slate-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-[#334155] bg-[#10263A] px-3 md:flex">
                <Search size={14} className="text-slate-500" />
                <span className="text-[11px] text-slate-500">Buscar funcionário...</span>
                <kbd className="ml-auto rounded border border-[#334155] px-1.5 py-0.5 text-[9px] text-slate-500">⌘ K</kbd>
              </div>
              <button aria-label="Notificações" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#334155] bg-[#10263A] text-slate-400 transition hover:text-white">
                <Bell size={16} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#60A5FA]/30 bg-[#183653] text-[10px] font-bold text-[#BFDBFE]">MP</div>
            </div>
          </header>
          <main className="min-w-0 px-7 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}