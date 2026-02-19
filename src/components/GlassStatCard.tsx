import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GlassStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: "admin" | "driver" | "supplier" | "default";
}

const variantClasses = {
  admin: "border-fleet-admin/20 hover:border-fleet-admin/40",
  driver: "border-fleet-driver/20 hover:border-fleet-driver/40",
  supplier: "border-fleet-supplier/20 hover:border-fleet-supplier/40",
  default: "border-border hover:border-primary/30",
};

const iconBgClasses = {
  admin: "gradient-admin",
  driver: "gradient-driver",
  supplier: "gradient-supplier",
  default: "gradient-primary",
};

const GlassStatCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: GlassStatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-card rounded-xl p-5 ${variantClasses[variant]} transition-colors duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend.positive ? "text-fleet-success" : "text-fleet-danger"}`}>
              <span>{trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBgClasses[variant]}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

export default GlassStatCard;
