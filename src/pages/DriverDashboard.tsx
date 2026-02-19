import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play, Square, Camera, Fuel, MapPin, UtensilsCrossed, CreditCard,
  FileText, Truck, ChevronRight, LogOut, Clock, Route, IndianRupee,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const mockExpenses = [
  { id: "1", type: "Fuel", amount: 4500, time: "Today, 10:30 AM", icon: Fuel },
  { id: "2", type: "Toll", amount: 350, time: "Today, 08:15 AM", icon: CreditCard },
  { id: "3", type: "Food", amount: 200, time: "Yesterday, 07:00 PM", icon: UtensilsCrossed },
  { id: "4", type: "Fuel", amount: 3800, time: "Yesterday, 06:00 AM", icon: Fuel },
  { id: "5", type: "Toll", amount: 500, time: "15 Feb, 09:00 AM", icon: CreditCard },
];

const DriverDashboard = () => {
  const { userName, logout } = useAuth();
  const [tripActive, setTripActive] = useState(false);

  const totalMonthlyEarnings = 48500;
  const totalTrips = 18;
  const totalKm = 3240;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <h2 className="text-lg font-bold text-foreground">{userName || "Driver"}</h2>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-driver text-sm font-bold text-primary-foreground">
            {userName?.[0]?.toUpperCase() || "D"}
          </div>
          <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-fleet-danger hover:bg-accent transition-colors" title="Sign Out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Trip Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Route className="h-4 w-4 text-fleet-driver" />
              Current Trip
            </h3>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              tripActive ? "bg-fleet-success/15 text-fleet-success border border-fleet-success/30" : "bg-muted text-muted-foreground"
            }`}>
              {tripActive ? "● Active" : "Idle"}
            </span>
          </div>

          {tripActive ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-fleet-success" />
                  <div className="h-8 w-0.5 bg-border" />
                  <div className="h-3 w-3 rounded-full border-2 border-fleet-driver" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-sm font-semibold text-foreground">Pune, Maharashtra</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="text-sm font-semibold text-foreground">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-muted p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground">Distance</p>
                  <p className="text-sm font-bold text-foreground">148 km</p>
                </div>
                <div className="rounded-lg bg-muted p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground">ETA</p>
                  <p className="text-sm font-bold text-foreground">3h 20m</p>
                </div>
                <div className="rounded-lg bg-muted p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground">Bilty</p>
                  <p className="text-sm font-bold text-foreground">#4521</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Truck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active trip. Tap below to start.</p>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setTripActive(!tripActive)}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg ${
              tripActive ? "bg-fleet-danger" : "gradient-driver"
            }`}
          >
            {tripActive ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {tripActive ? "End Trip" : "Start Trip"}
          </motion.button>
        </motion.div>

        {/* Monthly Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-fleet-driver" />
            Monthly Earnings
          </h3>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-3xl font-black text-foreground">₹{totalMonthlyEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">February 2026</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-fleet-success/15 text-fleet-success border border-fleet-success/30 px-2 py-0.5 text-xs font-medium">
                +12% ↑
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3 text-center">
              <Truck className="h-4 w-4 text-fleet-driver mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{totalTrips}</p>
              <p className="text-[10px] text-muted-foreground">Trips Done</p>
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <MapPin className="h-4 w-4 text-fleet-driver mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{totalKm.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Km Covered</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Expenses (Bhatta) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-fleet-driver" />
              Recent Expenses (Bhatta)
            </h3>
            <button className="text-xs font-medium text-fleet-driver flex items-center gap-0.5">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {mockExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-accent/50 transition-colors">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  exp.type === "Fuel" ? "bg-fleet-danger/10" : exp.type === "Toll" ? "bg-fleet-warning/10" : "bg-fleet-success/10"
                }`}>
                  <exp.icon className={`h-4 w-4 ${
                    exp.type === "Fuel" ? "text-fleet-danger" : exp.type === "Toll" ? "text-fleet-warning" : "text-fleet-success"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{exp.type}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {exp.time}
                  </p>
                </div>
                <p className="text-sm font-bold text-foreground">₹{exp.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* License tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-fleet-driver" />
            My License
          </h3>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-semibold text-foreground">DL No: MH03-20180012345</p>
              <p className="text-xs text-muted-foreground mt-0.5">Expires: 15 Aug 2027</p>
            </div>
            <span className="rounded-full bg-fleet-success/15 text-fleet-success border border-fleet-success/30 px-3 py-1 text-xs font-medium">✓ Valid</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-driver shadow-lg lg:bottom-6"
      >
        <Camera className="h-6 w-6 text-primary-foreground" />
      </motion.button>

      <BottomNav />
    </div>
  );
};

export default DriverDashboard;
