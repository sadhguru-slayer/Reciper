// components/MobileNav.jsx
import { HomeIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", icon: HomeIcon, to: "/" },
  { label: "Favorites", icon: HeartIcon, to: "/favorites" },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-3xl px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
        <div className="rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center px-3 py-1.5"
                >
                  <div
                    className={`flex items-center justify-center h-9 w-14 rounded-xl transition-all ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-1 text-[11px] tracking-wide ${
                      isActive ? "text-accent font-medium" : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}