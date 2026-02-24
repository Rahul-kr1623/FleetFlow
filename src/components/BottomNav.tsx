import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Truck, FileText, Camera, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/trips", label: "Trips", icon: Truck },
  { to: "/bilties", label: "Bilties", icon: FileText },
  { to: "/expenses", label: "Log", icon: Camera },
  { to: "/profile", label: "Profile", icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-around py-1.5">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <button
              key={tab.to}
              onClick={() => navigate(tab.to)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
            >
              {active && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute -top-1.5 h-0.5 w-6 rounded-full gradient-driver"
                />
              )}
              <tab.icon className={`h-5 w-5 ${active ? "text-fleet-driver" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${active ? "text-fleet-driver" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
