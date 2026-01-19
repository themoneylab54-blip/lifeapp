import { useLocation } from "wouter";
import { Target, Calendar, Timer, BarChart3, BookOpen, type LucideIcon } from "lucide-react";

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", icon: Target, label: "Focus" },
  { path: "/agenda", icon: Calendar, label: "Agenda" },
  { path: "/chrono", icon: Timer, label: "Chrono" },
  { path: "/vision", icon: BarChart3, label: "Vision" },
  { path: "/journal", icon: BookOpen, label: "Journal" },
];

export default function NavDock() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] bg-card/80 backdrop-blur-2xl rounded-3xl px-4 py-3 border border-border shadow-2xl z-50">
      <div className="flex justify-around items-center gap-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
