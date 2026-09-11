import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  Wallet,
  PiggyBank,
  BookOpen,
} from "lucide-react";
import logo from "@/assets/bma-logo.png.asset.json";

const links = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/programas", label: "Programas", icon: BookOpen },
  { to: "/alunos", label: "Alunos", icon: GraduationCap },
  { to: "/colaboradores", label: "Colaboradores", icon: Users },
  { to: "/presencas", label: "Presenças", icon: CalendarCheck },
  { to: "/pagamentos", label: "Pagamentos", icon: Wallet },
  { to: "/financas", label: "Finanças", icon: PiggyBank },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="neu gloss flex h-12 items-center rounded-xl px-3">
              <img src={logo.url} alt="Bantu Mentor Academy" className="h-7 w-auto" />
            </span>
          </Link>
          <nav className="neu-inset ml-auto flex flex-wrap items-center gap-1 rounded-2xl p-1.5">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "neu-btn-primary !text-primary-foreground" }}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-center text-xs text-muted-foreground">
        Bantu Mentor Academy — sistema de gestão de formação · valores em Kwanza (Kz)
      </footer>
    </div>
  );
}
