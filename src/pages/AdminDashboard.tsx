import { useState } from "react";
import { motion } from "framer-motion";
import {
  Truck, DollarSign, FileText, AlertTriangle, TrendingUp,
  MapPin, Bell, MessageSquare, LogOut, Wrench, Droplets, CircleDot,
  LayoutDashboard, Shield, Receipt, Gauge, Download, Eye,
  CheckCircle, XCircle, Search, QrCode, Users, Contact, Brain,
  Star, Phone, Mail, BadgeCheck, Plus, Fuel, Route, ShieldAlert,
  FolderOpen, Lock,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import GlassStatCard from "@/components/GlassStatCard";
import HealthGauge from "@/components/HealthGauge";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ── Tab types ──
type AdminTab = "dashboard" | "fleet" | "bilties" | "expenses" | "documents" | "drivers" | "contacts" | "predictions";

const sidebarLinks: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "fleet", label: "Vehicles / Fleet", icon: Truck },
  { id: "drivers", label: "Drivers", icon: Users },
  { id: "bilties", label: "Lorry Receipts", icon: FileText },
  { id: "expenses", label: "Driver Expenses", icon: Receipt },
  { id: "contacts", label: "Contacts", icon: Contact },
  { id: "predictions", label: "AI Predictions", icon: Brain },
  { id: "documents", label: "Universal Vault", icon: Shield },
];

// ── Mock data per section ──

const revenueData = [
  { month: "Sep", revenue: 12, expenses: 8 },
  { month: "Oct", revenue: 15, expenses: 9 },
  { month: "Nov", revenue: 13, expenses: 10 },
  { month: "Dec", revenue: 18, expenses: 11 },
  { month: "Jan", revenue: 20, expenses: 12 },
  { month: "Feb", revenue: 18.5, expenses: 10.5 },
];

const expenseBreakdown = [
  { name: "Fuel", value: 45 },
  { name: "Tolls", value: 18 },
  { name: "Maintenance", value: 22 },
  { name: "Salaries", value: 35 },
  { name: "Insurance", value: 12 },
];

const aiPredictions = [
  { vehicle: "MH12AB1234", component: "Engine Oil", health: 72, prediction: "Change in ~1,200 km", icon: Droplets, urgency: "warning" as const },
  { vehicle: "MH14CD5678", component: "Front Tyres", health: 38, prediction: "Replace within 800 km", icon: CircleDot, urgency: "danger" as const },
  { vehicle: "MH09EF9012", component: "Brake Pads", health: 91, prediction: "Good for 5,000+ km", icon: Wrench, urgency: "safe" as const },
  { vehicle: "MH20GH3456", component: "Rear Tyres", health: 45, prediction: "Replace within 2,000 km", icon: CircleDot, urgency: "warning" as const },
];

const mockAlerts = [
  { id: "1", message: "Oil change due for MH12AB1234 in 500km", time: "2h ago", type: "maintenance" },
  { id: "2", message: "Insurance expiring for MH14CD5678", time: "5h ago", type: "document" },
  { id: "3", message: "Bilty #4521 delivered to Mumbai", time: "8h ago", type: "delivery" },
];

const fleetVehicles = [
  { number: "HR-55-AF-1234", driver: "Ramesh Kumar", odometer: 45000, fuel: "4.2 km/l", status: "active", route: "Delhi → Mumbai" },
  { number: "MH-12-AB-5678", driver: "Suresh Yadav", odometer: 78200, fuel: "3.8 km/l", status: "active", route: "Pune → Chennai" },
  { number: "RJ-14-CD-9012", driver: "Vikram Singh", odometer: 32100, fuel: "4.5 km/l", status: "idle", route: "—" },
  { number: "GJ-05-EF-3456", driver: "Anil Patel", odometer: 61500, fuel: "3.6 km/l", status: "maintenance", route: "—" },
  { number: "MP-09-GH-7890", driver: "Deepak Sharma", odometer: 89400, fuel: "4.0 km/l", status: "active", route: "Indore → Nagpur" },
  { number: "UP-32-IJ-2345", driver: "Manoj Tiwari", odometer: 54700, fuel: "3.9 km/l", status: "active", route: "Lucknow → Kolkata" },
];

const biltyCards = [
  { id: "BL-9901", consignee: "Steel India Ltd", from: "Jamshedpur", to: "Mumbai", date: "15 Feb 2026", weight: "24 MT", status: "In Transit" },
  { id: "BL-9902", consignee: "ACC Cement Corp", from: "Kota", to: "Delhi", date: "14 Feb 2026", weight: "18 MT", status: "Delivered" },
  { id: "BL-9903", consignee: "Tata Motors", from: "Pune", to: "Chennai", date: "16 Feb 2026", weight: "12 MT", status: "Loading" },
  { id: "BL-9904", consignee: "JSW Steel", from: "Bellary", to: "Vizag", date: "13 Feb 2026", weight: "22 MT", status: "In Transit" },
  { id: "BL-9905", consignee: "Ultratech", from: "Raipur", to: "Hyderabad", date: "12 Feb 2026", weight: "20 MT", status: "Delivered" },
  { id: "BL-9906", consignee: "Hindalco", from: "Renukoot", to: "Silvassa", date: "17 Feb 2026", weight: "16 MT", status: "Loading" },
];

const driverExpenses = [
  { id: "EXP-001", driver: "Ramesh Kumar", vehicle: "HR-55-AF-1234", category: "Fuel", amount: 8500, date: "17 Feb", proof: true, status: "pending" },
  { id: "EXP-002", driver: "Suresh Yadav", vehicle: "MH-12-AB-5678", category: "Toll", amount: 2200, date: "16 Feb", proof: true, status: "pending" },
  { id: "EXP-003", driver: "Vikram Singh", vehicle: "RJ-14-CD-9012", category: "Food", amount: 650, date: "16 Feb", proof: false, status: "pending" },
  { id: "EXP-004", driver: "Anil Patel", vehicle: "GJ-05-EF-3456", category: "Fuel", amount: 7200, date: "15 Feb", proof: true, status: "approved" },
  { id: "EXP-005", driver: "Deepak Sharma", vehicle: "MP-09-GH-7890", category: "Toll", amount: 1800, date: "15 Feb", proof: true, status: "rejected" },
  { id: "EXP-006", driver: "Manoj Tiwari", vehicle: "UP-32-IJ-2345", category: "Food", amount: 450, date: "14 Feb", proof: true, status: "approved" },
];

// ── Drivers mock data ──
const mockDrivers = [
  { id: "D1", name: "Ramesh Kumar", rating: 4.5, status: "on-trip" as const, totalTrips: 234, licenseExpiry: "2027-06-15", vehicle: "HR-55-AF-1234", phone: "+91 98765 43210" },
  { id: "D2", name: "Suresh Yadav", rating: 4.2, status: "available" as const, totalTrips: 189, licenseExpiry: "2026-11-20", vehicle: "MH-12-AB-5678", phone: "+91 87654 32109" },
  { id: "D3", name: "Vikram Singh", rating: 4.8, status: "available" as const, totalTrips: 312, licenseExpiry: "2028-03-10", vehicle: "RJ-14-CD-9012", phone: "+91 76543 21098" },
  { id: "D4", name: "Anil Patel", rating: 3.9, status: "on-trip" as const, totalTrips: 156, licenseExpiry: "2026-04-05", vehicle: "GJ-05-EF-3456", phone: "+91 65432 10987" },
  { id: "D5", name: "Deepak Sharma", rating: 4.6, status: "on-trip" as const, totalTrips: 278, licenseExpiry: "2027-09-22", vehicle: "MP-09-GH-7890", phone: "+91 54321 09876" },
  { id: "D6", name: "Manoj Tiwari", rating: 4.1, status: "available" as const, totalTrips: 145, licenseExpiry: "2026-08-18", vehicle: "UP-32-IJ-2345", phone: "+91 43210 98765" },
];

// ── Contacts mock data ──
const mockContacts = {
  drivers: [
    { id: "C1", name: "Ramesh Kumar", role: "Driver", verified: true, phone: "+91 98765 43210", email: "ramesh.k@fleet.in" },
    { id: "C2", name: "Suresh Yadav", role: "Driver", verified: true, phone: "+91 87654 32109", email: "suresh.y@fleet.in" },
    { id: "C3", name: "Vikram Singh", role: "Driver", verified: true, phone: "+91 76543 21098", email: "vikram.s@fleet.in" },
    { id: "C4", name: "Anil Patel", role: "Driver", verified: false, phone: "+91 65432 10987", email: "anil.p@fleet.in" },
  ],
  suppliers: [
    { id: "C5", name: "Steel India Ltd", role: "Client", verified: true, phone: "+91 22 4567 8901", email: "ops@steelindia.com" },
    { id: "C6", name: "ACC Cement Corp", role: "Client", verified: true, phone: "+91 11 5678 9012", email: "logistics@acccement.com" },
    { id: "C7", name: "Rajesh Transporters", role: "Supplier", verified: true, phone: "+91 141 678 9012", email: "info@rajeshtrans.in" },
    { id: "C8", name: "National Fuel Agency", role: "Supplier", verified: false, phone: "+91 79 7890 1234", email: "contact@natfuel.co.in" },
    { id: "C9", name: "Tata Motors Spares", role: "Supplier", verified: true, phone: "+91 20 8901 2345", email: "parts@tatamotors.com" },
  ],
};

// ── AI Predictions mock data ──
const maintenanceForecasts = [
  { vehicle: "TN-01-AB-1234", alert: "Oil change due in 800 km", component: "Engine Oil", confidence: 92, urgency: "danger" as const },
  { vehicle: "HR-55-AF-1234", alert: "Clutch plate wear detected", component: "Clutch Assembly", confidence: 78, urgency: "warning" as const },
  { vehicle: "MH-12-AB-5678", alert: "Battery voltage dropping", component: "Battery", confidence: 85, urgency: "warning" as const },
  { vehicle: "RJ-14-CD-9012", alert: "Air filter replacement needed", component: "Air Filter", confidence: 95, urgency: "danger" as const },
  { vehicle: "GJ-05-EF-3456", alert: "Tyre tread below 3mm", component: "Rear Tyres", confidence: 88, urgency: "danger" as const },
  { vehicle: "MP-09-GH-7890", alert: "Coolant level low — refill", component: "Cooling System", confidence: 71, urgency: "safe" as const },
];

const expenseInsights = [
  { id: "INS-1", type: "theft" as const, title: "Fuel Pilferage Suspected", description: "Vehicle GJ-05-EF-3456 consumed 42% more fuel than expected on Ahmedabad–Surat route (avg 3.1 km/l vs expected 4.5 km/l). Pattern repeated 3 times this month.", severity: "high", savings: "₹12,400" },
  { id: "INS-2", type: "route" as const, title: "Route Optimization — Delhi↔Mumbai", description: "Historical data shows NH-48 via Udaipur reduces toll by ₹1,800 and saves 45 km vs current NH-44 route. 6 trucks use this corridor weekly.", severity: "medium", savings: "₹43,200/mo" },
  { id: "INS-3", type: "theft" as const, title: "Toll Overcharge Detected", description: "Driver EXP-002 claimed ₹2,200 toll for Pune–Chennai but FastTag records show ₹1,650. Discrepancy of ₹550 flagged.", severity: "high", savings: "₹550" },
  { id: "INS-4", type: "route" as const, title: "Fuel Station Recommendation", description: "Switching to HP fleet card at Jaipur bypass saves ₹1.20/litre. With avg 400L fill-up, that's ₹480 per trip for 4 vehicles.", severity: "low", savings: "₹7,680/mo" },
];

// ── Universal Vault mock data (grouped by vehicle) ──
const vaultDocuments: Record<string, { id: string; name: string; type: "RC" | "Insurance" | "Permit" | "License" | "Fitness"; expiryDate: string }[]> = {
  "HR-55-AF-1234": [
    { id: "V1", name: "Registration Certificate", type: "RC", expiryDate: "2026-02-20" },
    { id: "V2", name: "Motor Insurance", type: "Insurance", expiryDate: "2026-09-15" },
    { id: "V3", name: "National Permit", type: "Permit", expiryDate: "2026-01-05" },
    { id: "V4", name: "Fitness Certificate", type: "Fitness", expiryDate: "2027-04-10" },
  ],
  "MH-12-AB-5678": [
    { id: "V5", name: "Registration Certificate", type: "RC", expiryDate: "2027-11-30" },
    { id: "V6", name: "Motor Insurance", type: "Insurance", expiryDate: "2026-02-10" },
    { id: "V7", name: "National Permit", type: "Permit", expiryDate: "2026-12-20" },
  ],
  "RJ-14-CD-9012": [
    { id: "V8", name: "Registration Certificate", type: "RC", expiryDate: "2028-06-15" },
    { id: "V9", name: "Motor Insurance", type: "Insurance", expiryDate: "2026-08-20" },
    { id: "V10", name: "National Permit", type: "Permit", expiryDate: "2026-06-15" },
    { id: "V11", name: "Fitness Certificate", type: "Fitness", expiryDate: "2026-03-01" },
  ],
  "GJ-05-EF-3456": [
    { id: "V12", name: "Registration Certificate", type: "RC", expiryDate: "2025-12-01" },
    { id: "V13", name: "Motor Insurance", type: "Insurance", expiryDate: "2026-05-18" },
  ],
  "MP-09-GH-7890": [
    { id: "V14", name: "Registration Certificate", type: "RC", expiryDate: "2027-01-25" },
    { id: "V15", name: "Motor Insurance", type: "Insurance", expiryDate: "2026-02-28" },
    { id: "V16", name: "National Permit", type: "Permit", expiryDate: "2026-10-12" },
  ],
  "UP-32-IJ-2345": [
    { id: "V17", name: "Registration Certificate", type: "RC", expiryDate: "2027-03-10" },
    { id: "V18", name: "Motor Insurance", type: "Insurance", expiryDate: "2026-07-05" },
    { id: "V19", name: "Fitness Certificate", type: "Fitness", expiryDate: "2026-11-30" },
  ],
};

const urgencyColor = {
  safe: "border-fleet-success/30 bg-fleet-success/5",
  warning: "border-fleet-warning/30 bg-fleet-warning/5",
  danger: "border-fleet-danger/30 bg-fleet-danger/5",
};
const urgencyText = {
  safe: "text-fleet-success",
  warning: "text-fleet-warning",
  danger: "text-fleet-danger",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

// ═══════════════════════════════════════════════════════
// SECTION COMPONENTS – each is fully isolated
// ═══════════════════════════════════════════════════════

const DashboardSection = () => (
  <div className="space-y-6">
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <motion.div variants={item}><GlassStatCard title="Active Trucks" value={24} icon={Truck} trend={{ value: 8, positive: true }} variant="admin" /></motion.div>
      <motion.div variants={item}><GlassStatCard title="Revenue (MTD)" value="₹18.5L" icon={DollarSign} trend={{ value: 12, positive: true }} variant="admin" /></motion.div>
      <motion.div variants={item}><GlassStatCard title="Active Bilties" value={156} icon={FileText} subtitle="32 pending" variant="admin" /></motion.div>
      <motion.div variants={item}><GlassStatCard title="Alerts" value={7} icon={AlertTriangle} subtitle="3 critical" variant="admin" /></motion.div>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <motion.div variants={item} initial="hidden" animate="show" className="glass-card rounded-xl p-5">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />Revenue vs Expenses (₹ Lakhs)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(215, 16%, 47%)' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(215, 16%, 47%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: 'none', borderRadius: '8px', color: 'white' }} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" fill="url(#colorRevenue)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" stroke="hsl(0, 84%, 60%)" fill="url(#colorExpenses)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={item} initial="hidden" animate="show" className="glass-card rounded-xl p-5">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-fleet-warning" />Operational Expenses (₹ Thousands)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={expenseBreakdown}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(215, 16%, 47%)' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(215, 16%, 47%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(222, 47%, 9%)', border: 'none', borderRadius: '8px', color: 'white' }} />
            <Bar dataKey="value" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    <motion.div variants={item} initial="hidden" animate="show" className="glass-card rounded-xl p-5">
      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <Wrench className="h-4 w-4 text-primary" />AI Maintenance Predictions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {aiPredictions.map((pred) => (
          <div key={pred.vehicle + pred.component} className={`rounded-xl border-2 p-4 ${urgencyColor[pred.urgency]}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card">
                <pred.icon className={`h-4 w-4 ${urgencyText[pred.urgency]}`} />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-foreground">{pred.vehicle}</p>
                <p className="text-[10px] text-muted-foreground">{pred.component}</p>
              </div>
            </div>
            <HealthGauge percentage={pred.health} label="" />
            <p className={`text-xs font-medium mt-2 ${urgencyText[pred.urgency]}`}>{pred.prediction}</p>
          </div>
        ))}
      </div>
    </motion.div>

    <motion.div variants={item} initial="hidden" animate="show" className="glass-card rounded-xl p-5">
      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-fleet-success" />WhatsApp Alert Log
      </h3>
      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              alert.type === "maintenance" ? "bg-fleet-warning/15" : alert.type === "document" ? "bg-fleet-danger/15" : "bg-fleet-success/15"
            }`}>
              {alert.type === "maintenance" ? <AlertTriangle className="h-3.5 w-3.5 text-fleet-warning" /> :
               alert.type === "document" ? <FileText className="h-3.5 w-3.5 text-fleet-danger" /> :
               <MapPin className="h-3.5 w-3.5 text-fleet-success" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const FleetSection = () => {
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-fleet-success/15 text-fleet-success border-fleet-success/30",
      idle: "bg-fleet-warning/15 text-fleet-warning border-fleet-warning/30",
      maintenance: "bg-fleet-danger/15 text-fleet-danger border-fleet-danger/30",
    };
    return map[status] || map.idle;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Fleet Inventory</h3>
          <p className="text-sm text-muted-foreground">{fleetVehicles.length} vehicles registered</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search vehicle..." className="bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground w-40" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Vehicle Number</TableHead>
              <TableHead className="text-muted-foreground">Driver</TableHead>
              <TableHead className="text-muted-foreground">Current Route</TableHead>
              <TableHead className="text-muted-foreground text-right">Odometer</TableHead>
              <TableHead className="text-muted-foreground text-right">Fuel Eff.</TableHead>
              <TableHead className="text-muted-foreground text-center">Status</TableHead>
              <TableHead className="text-muted-foreground text-center">AI Predict</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fleetVehicles.map((v) => (
              <TableRow key={v.number} className="border-border hover:bg-accent/50">
                <TableCell className="font-mono font-bold text-foreground">{v.number}</TableCell>
                <TableCell className="text-foreground">{v.driver}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{v.route}</TableCell>
                <TableCell className="text-right font-mono text-foreground">{v.odometer.toLocaleString()} km</TableCell>
                <TableCell className="text-right text-foreground">{v.fuel}</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(v.status)}`}>
                    {v.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                    <Gauge className="h-3 w-3" /> Run Prediction
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

const BiltiesSection = () => {
  const statusColor: Record<string, string> = {
    "In Transit": "bg-primary/15 text-primary border-primary/30",
    "Delivered": "bg-fleet-success/15 text-fleet-success border-fleet-success/30",
    "Loading": "bg-fleet-warning/15 text-fleet-warning border-fleet-warning/30",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Lorry Receipts (Digital Bilties)</h3>
        <p className="text-sm text-muted-foreground">{biltyCards.length} bilties issued this month</p>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {biltyCards.map((b) => (
          <motion.div key={b.id} variants={item} className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-foreground">{b.id}</span>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[b.status] || ""}`}>
                {b.status}
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">{b.consignee}</p>
              <p className="text-xs text-muted-foreground">{b.from} → {b.to}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{b.date}</span>
                <span className="font-medium text-foreground">{b.weight}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <QrCode className="h-5 w-5" />
                <span className="text-[10px] uppercase tracking-wider">QR Verify</span>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <Download className="h-3 w-3" /> Download PDF
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const ExpensesSection = () => {
  const [expenses, setExpenses] = useState(driverExpenses);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, status: action } : e)));
  };

  const categoryIcon: Record<string, string> = {
    Fuel: "bg-primary/15 text-primary",
    Toll: "bg-fleet-warning/15 text-fleet-warning",
    Food: "bg-fleet-success/15 text-fleet-success",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Driver Expense Approval Hub</h3>
        <p className="text-sm text-muted-foreground">{expenses.filter((e) => e.status === "pending").length} pending approvals</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Driver</TableHead>
              <TableHead className="text-muted-foreground">Vehicle</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground text-right">Amount</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground text-center">Proof</TableHead>
              <TableHead className="text-muted-foreground text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id} className="border-border hover:bg-accent/50">
                <TableCell className="font-mono text-xs text-foreground">{e.id}</TableCell>
                <TableCell className="text-foreground font-medium">{e.driver}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{e.vehicle}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryIcon[e.category]}`}>
                    {e.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-foreground">₹{e.amount.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{e.date}</TableCell>
                <TableCell className="text-center">
                  {e.proof ? (
                    <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <Eye className="h-3 w-3" /> View
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {e.status === "pending" ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => handleAction(e.id, "approved")} className="inline-flex items-center gap-1 rounded-lg bg-fleet-success/15 px-2.5 py-1 text-xs font-medium text-fleet-success hover:bg-fleet-success/25 transition-colors">
                        <CheckCircle className="h-3 w-3" /> Approve
                      </button>
                      <button onClick={() => handleAction(e.id, "rejected")} className="inline-flex items-center gap-1 rounded-lg bg-fleet-danger/15 px-2.5 py-1 text-xs font-medium text-fleet-danger hover:bg-fleet-danger/25 transition-colors">
                        <XCircle className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  ) : (
                    <Badge variant={e.status === "approved" ? "default" : "destructive"} className="text-[10px] capitalize">
                      {e.status}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// NEW: DRIVERS SECTION
// ═══════════════════════════════════════════════════════

const DriversSection = () => {
  const [drivers, setDrivers] = useState(mockDrivers);

  const toggleStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "on-trip" ? "available" as const : "on-trip" as const } : d
      )
    );
  };

  const getDaysToExpiry = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Driver Profiles</h3>
          <p className="text-sm text-muted-foreground">{drivers.length} drivers registered • {drivers.filter((d) => d.status === "available").length} available</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Driver
        </button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => {
          const daysLeft = getDaysToExpiry(driver.licenseExpiry);
          const licenseTag = daysLeft < 0
            ? { label: "Expired", cls: "bg-fleet-danger/15 text-fleet-danger border-fleet-danger/30" }
            : daysLeft <= 90
            ? { label: `${daysLeft}d left`, cls: "bg-fleet-warning/15 text-fleet-warning border-fleet-warning/30" }
            : { label: "Valid", cls: "bg-fleet-success/15 text-fleet-success border-fleet-success/30" };

          return (
            <motion.div key={driver.id} variants={item} className="glass-card rounded-xl p-5 space-y-4">
              {/* Header: avatar + name + status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-admin text-lg font-bold text-primary-foreground">
                    {driver.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{driver.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{driver.vehicle}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(driver.id)}
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    driver.status === "on-trip"
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-fleet-success/15 text-fleet-success border-fleet-success/30"
                  }`}
                >
                  {driver.status === "on-trip" ? "On Trip" : "Available"}
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.floor(driver.rating) ? "text-fleet-warning fill-fleet-warning" : s - 0.5 <= driver.rating ? "text-fleet-warning fill-fleet-warning/50" : "text-muted-foreground/30"}`}
                  />
                ))}
                <span className="text-xs font-bold text-foreground ml-1">{driver.rating}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-accent/50 p-2.5 text-center">
                  <p className="text-lg font-bold text-foreground">{driver.totalTrips}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Trips</p>
                </div>
                <div className="rounded-lg bg-accent/50 p-2.5 text-center">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${licenseTag.cls}`}>
                    {licenseTag.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">License</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
                <Phone className="h-3.5 w-3.5" />
                <span>{driver.phone}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// NEW: CONTACTS SECTION
// ═══════════════════════════════════════════════════════

const ContactsSection = () => {
  const [activeContactTab, setActiveContactTab] = useState<"drivers" | "suppliers">("drivers");
  const contacts = activeContactTab === "drivers" ? mockContacts.drivers : mockContacts.suppliers;

  const roleColor: Record<string, string> = {
    Driver: "bg-primary/15 text-primary",
    Client: "bg-fleet-supplier/15 text-fleet-supplier",
    Supplier: "bg-fleet-warning/15 text-fleet-warning",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Contacts Directory</h3>
          <p className="text-sm text-muted-foreground">Manage your drivers, suppliers & clients</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> New Contact
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg bg-accent/50 p-1 w-fit">
        <button
          onClick={() => setActiveContactTab("drivers")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeContactTab === "drivers" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Drivers Pool
        </button>
        <button
          onClick={() => setActiveContactTab("suppliers")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeContactTab === "suppliers" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Suppliers & Clients
        </button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {contacts.map((c) => (
          <motion.div key={c.id} variants={item} className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-foreground">
                {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  {c.verified && (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColor[c.role] || "bg-accent text-foreground"}`}>
                    {c.role}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> {c.phone}
                  </span>
                  <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> {c.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// NEW: AI PREDICTIONS SECTION
// ═══════════════════════════════════════════════════════

const PredictionsSection = () => (
  <div className="space-y-8">
    {/* Maintenance Forecasts */}
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" /> Maintenance Forecasts
        </h3>
        <p className="text-sm text-muted-foreground">AI-powered component wear predictions</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maintenanceForecasts.map((f) => (
          <motion.div key={f.vehicle + f.component} variants={item} className={`rounded-xl border-2 p-5 space-y-4 ${urgencyColor[f.urgency]}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-bold text-foreground">{f.vehicle}</p>
                <p className="text-xs text-muted-foreground">{f.component}</p>
              </div>
              <AlertTriangle className={`h-5 w-5 ${urgencyText[f.urgency]}`} />
            </div>
            <p className={`text-sm font-medium ${urgencyText[f.urgency]}`}>{f.alert}</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-bold text-foreground">{f.confidence}%</span>
              </div>
              <Progress value={f.confidence} className="h-2" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* Expense Insights */}
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-fleet-danger" /> Expense Insights & Alerts
        </h3>
        <p className="text-sm text-muted-foreground">Fuel pilferage detection & route optimization</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {expenseInsights.map((insight) => (
          <motion.div key={insight.id} variants={item} className="glass-card rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                insight.type === "theft" ? "bg-fleet-danger/15" : "bg-primary/15"
              }`}>
                {insight.type === "theft" ? (
                  <Fuel className="h-5 w-5 text-fleet-danger" />
                ) : (
                  <Route className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-foreground">{insight.title}</p>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    insight.severity === "high"
                      ? "bg-fleet-danger/15 text-fleet-danger border-fleet-danger/30"
                      : insight.severity === "medium"
                      ? "bg-fleet-warning/15 text-fleet-warning border-fleet-warning/30"
                      : "bg-fleet-success/15 text-fleet-success border-fleet-success/30"
                  }`}>
                    {insight.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-fleet-success/10 px-3 py-1 text-xs font-bold text-fleet-success">
                    <DollarSign className="h-3 w-3" /> Potential Savings: {insight.savings}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// UPGRADED: UNIVERSAL VAULT (Documents grouped by vehicle, RBAC)
// ═══════════════════════════════════════════════════════

const UniversalVaultSection = () => {
  const { role } = useAuth();
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);

  // RBAC filtering
  const getAccessibleVehicles = () => {
    if (role === "admin") return Object.keys(vaultDocuments);
    if (role === "driver") return ["HR-55-AF-1234"]; // assigned vehicle only
    if (role === "supplier") return ["MH-12-AB-5678"]; // shipment vehicle only
    return [];
  };

  const accessibleVehicles = getAccessibleVehicles();

  const getExpiryTag = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: "Expired", cls: "bg-fleet-danger/15 text-fleet-danger border-fleet-danger/30" };
    if (days <= 10) return { label: `${days}d left`, cls: "bg-fleet-warning/15 text-fleet-warning border-fleet-warning/30" };
    return { label: "Valid", cls: "bg-fleet-success/15 text-fleet-success border-fleet-success/30" };
  };

  const docTypeIcon: Record<string, typeof FileText> = {
    RC: FileText,
    Insurance: Shield,
    Permit: Receipt,
    License: Receipt,
    Fitness: CheckCircle,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Universal Document Vault
          </h3>
          <p className="text-sm text-muted-foreground">
            {role === "admin"
              ? "Full access — all vehicles & documents"
              : role === "driver"
              ? "Restricted — assigned vehicle only"
              : "Restricted — shipment vehicle only"}
          </p>
        </div>
        {role !== "admin" && (
          <div className="flex items-center gap-1.5 rounded-lg bg-fleet-warning/10 border border-fleet-warning/20 px-3 py-1.5">
            <Lock className="h-3.5 w-3.5 text-fleet-warning" />
            <span className="text-xs font-medium text-fleet-warning">Limited Access</span>
          </div>
        )}
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {accessibleVehicles.map((vehicleNum) => {
          const docs = vaultDocuments[vehicleNum] || [];
          const isExpanded = expandedVehicle === vehicleNum;
          const expiredCount = docs.filter((d) => new Date(d.expiryDate) < new Date()).length;
          const warningCount = docs.filter((d) => {
            const days = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return days >= 0 && days <= 10;
          }).length;

          return (
            <motion.div key={vehicleNum} variants={item}>
              {/* Vehicle group header */}
              <button
                onClick={() => setExpandedVehicle(isExpanded ? null : vehicleNum)}
                className="w-full glass-card rounded-xl p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-admin">
                    <Truck className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-mono text-sm font-bold text-foreground">{vehicleNum}</p>
                    <p className="text-xs text-muted-foreground">{docs.length} documents</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {expiredCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-fleet-danger/15 border border-fleet-danger/30 px-2 py-0.5 text-[10px] font-bold text-fleet-danger">
                      {expiredCount} expired
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-fleet-warning/15 border border-fleet-warning/30 px-2 py-0.5 text-[10px] font-bold text-fleet-warning">
                      {warningCount} expiring
                    </span>
                  )}
                  <svg className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded docs */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 ml-6 space-y-2"
                >
                  {docs.map((doc) => {
                    const tag = getExpiryTag(doc.expiryDate);
                    const DocIcon = docTypeIcon[doc.type] || FileText;
                    return (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <DocIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              Expires: {new Date(doc.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${tag.cls}`}>
                            {tag.label}
                          </span>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════

const AdminDashboard = () => {
  const { userName, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const renderSection = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardSection />;
      case "fleet": return <FleetSection />;
      case "drivers": return <DriversSection />;
      case "bilties": return <BiltiesSection />;
      case "expenses": return <ExpensesSection />;
      case "contacts": return <ContactsSection />;
      case "predictions": return <PredictionsSection />;
      case "documents": return <UniversalVaultSection />;
    }
  };

  const tabSubtitles: Record<AdminTab, string> = {
    dashboard: "Here's your fleet overview for today",
    fleet: "Manage your vehicle inventory & predictions",
    drivers: "View and manage driver profiles",
    bilties: "View and manage lorry receipts",
    expenses: "Review and approve driver expenses",
    contacts: "Directory of drivers, suppliers & clients",
    predictions: "AI-powered maintenance & expense insights",
    documents: "Universal document vault with RBAC access",
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="hidden lg:flex h-screen w-64 flex-col border-r border-border bg-sidebar sticky top-0">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-admin">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">FleetFlow</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const active = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <link.icon className="h-4.5 w-4.5" />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center justify-between px-3">
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-admin text-xs font-bold text-primary-foreground">
              {userName?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{userName || "Admin"}</p>
              <p className="text-[10px] capitalize text-muted-foreground">Fleet Owner</p>
            </div>
            <button onClick={logout} className="text-muted-foreground hover:text-fleet-danger transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-admin">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">FleetFlow</span>
          </div>
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-foreground">Good morning, {userName || "Admin"} 👋</h2>
            <p className="text-sm text-muted-foreground">{tabSubtitles[activeTab]}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-fleet-danger text-[9px] font-bold text-primary-foreground">3</span>
            </button>
            <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-fleet-danger hover:bg-accent transition-colors" title="Sign Out">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="lg:hidden flex overflow-x-auto border-b border-border bg-card/50 px-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === link.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </button>
          ))}
        </div>

        <div className="p-4 lg:p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
