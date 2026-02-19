import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Shield, Package, ArrowRight, Eye, EyeOff } from "lucide-react";

const roles: { value: UserRole; label: string; icon: typeof Truck; desc: string; gradient: string }[] = [
  { value: "admin", label: "Fleet Owner", icon: Shield, desc: "Full fleet management & analytics", gradient: "gradient-admin" },
  { value: "driver", label: "Driver", icon: Truck, desc: "Trip management & expense logging", gradient: "gradient-driver" },
  { value: "supplier", label: "Supplier", icon: Package, desc: "Stock tracking & digital bilties", gradient: "gradient-supplier" },
];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    login(selectedRole, name || email.split("@")[0]);
    navigate("/dashboard");
  };

  const roleBorderColor = selectedRole === "admin" ? "border-fleet-admin/40 ring-fleet-admin/20" : selectedRole === "driver" ? "border-fleet-driver/40 ring-fleet-driver/20" : selectedRole === "supplier" ? "border-fleet-supplier/40 ring-fleet-supplier/20" : "border-border";

  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute border border-primary-foreground/20 rounded-full" style={{
              width: `${200 + i * 150}px`, height: `${200 + i * 150}px`,
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            }} />
          ))}
        </div>
        <div className="relative z-10 max-w-md text-center text-primary-foreground px-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Truck className="mx-auto mb-6 h-16 w-16" strokeWidth={1.2} />
            <h2 className="text-4xl font-bold mb-4">FleetFlow</h2>
            <p className="text-lg opacity-80">Smart logistics management for the modern fleet. Track, manage, and optimize your entire operation.</p>
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">FleetFlow</h1>
          </div>

          <h2 className="text-2xl font-bold text-foreground">{isLogin ? "Welcome back" : "Create account"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{isLogin ? "Sign in to your fleet account" : "Set up your fleet account"}</p>

          {/* Role selection */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <motion.button
                key={r.value}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedRole(r.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                  selectedRole === r.value
                    ? `${r.value === "admin" ? "border-fleet-admin bg-fleet-admin/5" : r.value === "driver" ? "border-fleet-driver bg-fleet-driver/5" : "border-fleet-supplier bg-fleet-supplier/5"}`
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${selectedRole === r.value ? r.gradient : "bg-muted"}`}>
                  <r.icon className={`h-4 w-4 ${selectedRole === r.value ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <span className={`text-xs font-medium ${selectedRole === r.value ? "text-foreground" : "text-muted-foreground"}`}>{r.label}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedRole && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs text-muted-foreground text-center"
              >
                {roles.find((r) => r.value === selectedRole)?.desc}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border-2 bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:ring-2 ${roleBorderColor}`}
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1.5 w-full rounded-xl border-2 bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:ring-2 ${roleBorderColor}`}
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border-2 bg-card px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-all focus:ring-2 ${roleBorderColor}`}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={!selectedRole}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all disabled:opacity-40 ${
                selectedRole === "admin" ? "gradient-admin" : selectedRole === "driver" ? "gradient-driver" : selectedRole === "supplier" ? "gradient-supplier" : "gradient-primary"
              }`}
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
