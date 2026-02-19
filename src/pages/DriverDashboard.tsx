import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Square, Fuel, CreditCard,
  FileText, Truck, ChevronRight, LogOut, Phone, AlertTriangle, Star, CheckCircle, Navigation, MapPin, Search, ShieldCheck, Lock
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import DocumentVault from "@/components/DocumentVault";
import { toast } from "sonner"; // Assuming sonner is installed as per App.tsx

const mockExpenses = [
  { id: "1", type: "Fuel", amount: 4500, time: "Today, 10:30 AM", icon: Fuel },
  { id: "2", type: "Toll", amount: 350, time: "Today, 08:15 AM", icon: CreditCard },
  { id: "3", type: "Maintenance", amount: 1200, time: "Yesterday, 04:00 PM", icon: Truck },
];

const mockDocuments = [
  { id: "1", name: "Vehicle RC", type: "RC" as const, expiryDate: "2026-12-31", vehicleNumber: "MH-12-AB-1234" },
  { id: "2", name: "Insurance Policy", type: "Insurance" as const, expiryDate: "2025-06-30", vehicleNumber: "MH-12-AB-1234" },
  { id: "3", name: "National Permit", type: "Permit" as const, expiryDate: "2025-09-15", vehicleNumber: "MH-12-AB-1234" },
  { id: "4", name: "Driver License", type: "License" as const, expiryDate: "2028-01-20" },
];

const DriverDashboard = () => {
  const { userName, logout, role } = useAuth();

  // Trip State Logic
  const [tripStatus, setTripStatus] = useState<"scheduled" | "ready" | "active">("scheduled");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"method" | "otp" | "geo">("method");
  const [otpInput, setOtpInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Simulate Trip becoming ready after 3 seconds for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tripStatus === "scheduled") {
        setTripStatus("ready");
        toast.info("Trip #8921 is now READY to start!", { duration: 5000 });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [tripStatus]);

  // Driver Performance Stats
  const earnings = 2450;
  const tripsDone = 4;
  const rating = 4.8;

  const quickActions = [
    { label: "Log Fuel", icon: Fuel, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800", action: () => toast("Fuel Logged") },
    { label: "Log Toll", icon: CreditCard, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", border: "border-orange-200 dark:border-orange-800", action: () => toast("Toll Logged") },
    { label: "Breakdown", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", border: "border-red-200 dark:border-red-800", action: () => toast.error("SOS Alert Sent!") },
    { label: "Call Owner", icon: Phone, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", border: "border-green-200 dark:border-green-800", action: () => window.location.href = "tel:1234567890" },
  ];

  const handleStartTripClick = () => {
    if (tripStatus === "active") {
      // End Trip logic
      if (confirm("Are you sure you want to end the trip?")) {
        setTripStatus("ready"); // Reset to ready for demo
        toast.success("Trip Ended Successfully");
      }
    } else if (tripStatus === "ready") {
      setShowVerifyModal(true);
      setVerificationStep("method");
      setOtpInput("");
    }
  };

  const handleVerifyOTP = () => {
    if (otpInput === "1234") {
      setTripStatus("active");
      setShowVerifyModal(false);
      toast.success("Loading Verified! Trip Started.");
    } else {
      toast.error("Invalid OTP. Try 1234");
    }
  };

  const handleGeoCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setTripStatus("active");
      setShowVerifyModal(false);
      toast.success("Location Verified! Trip Started.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
            <img
              src={`https://ui-avatars.com/api/?name=${userName || "Driver"}&background=0284c7&color=fff`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">FleetFlow Driver</p>
            <h2 className="text-lg font-bold text-foreground leading-tight">{userName || "Driver"}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">

        {/* Live Trip Progress */}
        <motion.div
          layout
          className={`rounded-2xl border bg-card p-5 shadow-sm transition-colors ${tripStatus === "active" ? "border-green-500/30" : "border-border"
            }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${tripStatus === "active" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${tripStatus === "active" ? "bg-green-500" : "bg-yellow-500"}`}></span>
              </span>
              <h3 className="font-bold text-foreground">Current Journey</h3>
            </div>
            {tripStatus === "scheduled" && <span className="text-xs font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">SCHEDULED</span>}
            {tripStatus === "ready" && <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded animate-pulse">READY TO START</span>}
            {tripStatus === "active" && <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">TRIP #8921</span>}
          </div>

          {tripStatus === "active" ? (
            <div className="relative pl-2 py-1 animate-in fade-in duration-500">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-green-500 via-green-500/50 to-muted"></div>

              {/* Source */}
              <div className="relative mb-6 flex gap-4">
                <div className="flex-none">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center z-10 relative bg-card">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Source • 08:30 AM</p>
                  <p className="text-base font-bold text-foreground">Pune, MH</p>
                </div>
              </div>

              {/* Truck Position (Animated) */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative mb-6 flex gap-4"
              >
                <div className="flex-none relative">
                  <div className="absolute -inset-1 rounded-full bg-blue-500/20 animate-pulse"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 relative shadow-lg shadow-blue-500/30">
                    <Truck className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1 bg-accent/50 rounded-lg p-2.5 -mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-blue-600">In Transit</span>
                    <span className="text-xs font-bold text-foreground">64 km left</span>
                  </div>
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[65%] rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Near Lonavala Express Highway
                  </p>
                </div>
              </motion.div>

              {/* Destination */}
              <div className="relative flex gap-4 opacity-75">
                <div className="flex-none">
                  <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 bg-muted flex items-center justify-center z-10 relative">
                    <div className="h-2 w-2 rounded-sm bg-muted-foreground"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Destination • 12:45 PM (ETA)</p>
                  <p className="text-base font-bold text-foreground">Mumbai Port, MH</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-accent/30 rounded-xl border border-dashed border-border px-8">
              <Navigation className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-30" />
              <p className="text-base font-semibold text-foreground">
                {tripStatus === "ready" ? "Load Verified. Ready to Start." : "Waiting for Loading Verification..."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {tripStatus === "ready" ? "Verify loading details and start trip." : "Supplier has not yet marked the load as ready."}
              </p>
            </div>
          )}

          <button
            disabled={tripStatus === "scheduled"}
            onClick={handleStartTripClick}
            className={`w-full mt-5 font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${tripStatus === "active"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : tripStatus === "ready"
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
              }`}
          >
            {tripStatus === "active" ? (
              <>
                <Square className="h-4 w-4 fill-current" /> End Trip
              </>
            ) : (
              <>
                {tripStatus === "scheduled" ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                {tripStatus === "scheduled" ? "On Hold" : "Start Trip"}
              </>
            )}
          </button>
        </motion.div>

        {/* Modal: Verify Loading */}
        <AnimatePresence>
          {showVerifyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-2xl border border-border"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-foreground">Verify Loading</h3>
                  <button onClick={() => setShowVerifyModal(false)} className="p-2 rounded-full hover:bg-accent"><LogOut className="h-4 w-4 rotate-180" /></button>
                </div>

                {verificationStep === "method" && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">Please verify that the truck is loaded and documents are collected.</p>
                    <button onClick={() => setVerificationStep("otp")} className="w-full py-4 rounded-xl border-2 border-blue-600/20 bg-blue-600/5 hover:bg-blue-600/10 flex items-center justify-center gap-3 font-semibold text-blue-600 transition-colors">
                      <ShieldCheck className="h-5 w-5" />
                      Enter 4-Digit OTP
                    </button>
                    <button onClick={() => { setVerificationStep("geo"); handleGeoCheck(); }} className="w-full py-4 rounded-xl border-2 border-border hover:bg-accent flex items-center justify-center gap-3 font-semibold text-foreground transition-colors">
                      <MapPin className="h-5 w-5" />
                      Verify Location (Geofence)
                    </button>
                  </div>
                )}

                {verificationStep === "otp" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Enter the OTP provided by the Supplier.</p>
                    <div className="flex justify-center">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-48 text-center text-3xl font-mono font-bold tracking-[0.5em] py-3 rounded-xl border-2 border-border focus:border-blue-600 bg-background outline-none transition-colors"
                        placeholder="••••"
                      />
                    </div>
                    <button onClick={handleVerifyOTP} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                      Verify Code
                    </button>
                  </div>
                )}

                {verificationStep === "geo" && (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    {isVerifying ? (
                      <>
                        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-semibold text-foreground">Checking Geofence...</p>
                        <p className="text-xs text-muted-foreground">Please stand near the loading bay.</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <p className="font-bold text-green-600">Verified!</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Driver Performance Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-xs text-muted-foreground font-medium mb-1">Today's Earnings</span>
            <span className="text-lg font-black text-foreground">₹{earnings}</span>
          </div>
          <div className="bg-card border border-border p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-xs text-muted-foreground font-medium mb-1">Trips Done</span>
            <span className="text-lg font-black text-foreground">{tripsDone}</span>
          </div>
          <div className="bg-card border border-border p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-xs text-muted-foreground font-medium mb-1">My Rating</span>
            <span className="text-lg font-black text-foreground flex items-center gap-1">
              {rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
            </span>
          </div>
        </div>

        {/* Quick Action Grid - FIXED */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border shadow-sm transition-all active:scale-95 ${action.bg} ${action.border}`}
              >
                <div className={`h-12 w-12 rounded-full bg-white dark:bg-black/20 flex items-center justify-center shadow-sm ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="font-bold text-sm text-foreground">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Document Vault Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Vehicle Documents</h3>
            <button className="text-xs font-bold text-blue-600 flex items-center">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          {/* Incorporating the DocumentVault component here */}
          <DocumentVault documents={mockDocuments} />
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default DriverDashboard;
