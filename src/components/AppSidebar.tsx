import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Truck,
  FileText,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  Package,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

const adminLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fleet", label: "Fleet", icon: Truck },
  { to: "/bilties", label: "Bilties", icon: FileText },
  { to: "/documents", label: "Documents", icon: Shield },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userName, role } = useAuth();

  const links = adminLinks;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex h-screen w-64 flex-col border-r border-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-admin">
          <Truck className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">FleetFlow</h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Logistics Pro</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <link.icon className="h-4.5 w-4.5" />
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center justify-between px-3">
          <ThemeToggle />
          <button
            onClick={() => navigate("/settings")}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-admin text-xs font-bold text-primary-foreground">
            {userName?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{userName || "Admin"}</p>
            <p className="text-[10px] capitalize text-muted-foreground">{role}</p>
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-fleet-danger transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
