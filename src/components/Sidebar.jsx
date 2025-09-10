import { NavLink } from "react-router-dom";
import { HomeIcon, ClockIcon } from "@heroicons/react/24/outline";

const navItems = [
  { name: "Home", desc: "Ready to cook", to: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "History", desc: "Cooking History", to: "/history", icon: <ClockIcon className="h-5 w-5" /> },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-background-sidebar text-text-primary border-r border-secondary flex flex-col">
      {/* App Title */}
      <div className="px-6 py-5 text-xl font-extrabold text-accent border-b border-secondary tracking-tight">
        Recipier
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {navItems.map(({ name, to, icon, desc }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex flex-col gap-1 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-accent/10 text-accent font-semibold shadow-sm"
                  : "hover:bg-background-card hover:shadow-sm hover:text-accent text-text-primary"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="text-text-secondary group-hover:text-accent">
                {icon}
              </div>
              <span>{name}</span>
            </div>
            <span className="text-xs text-text-muted">{desc}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-text-muted border-t border-secondary">
        © 2025 Recipier
      </div>
    </aside>
  );
}
 