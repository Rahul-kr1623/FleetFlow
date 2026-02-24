import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, Truck, Download, Filter, LogOut,
  MapPin, Clock, CheckCircle, ArrowRight, FileText, Box,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import DigitalBilty from "@/components/DigitalBilty";
import { useAuth } from "@/contexts/AuthContext";

const mockStocks = [
  { doNumber: "DO-2026-001", stock: "Iron Ore", trucks: 5, location: "Pune Depot", color: "bg-fleet-admin/10 text-fleet-admin border-fleet-admin/20" },
  { doNumber: "DO-2026-002", stock: "Coal", trucks: 3, location: "Mumbai Port", color: "bg-fleet-warning/10 text-fleet-warning border-fleet-warning/20" },
  { doNumber: "DO-2026-003", stock: "Cement", trucks: 8, location: "Nashik Plant", color: "bg-muted text-foreground border-border" },
  { doNumber: "DO-2026-004", stock: "Limestone", trucks: 4, location: "Solapur Quarry", color: "bg-fleet-supplier/10 text-fleet-supplier border-fleet-supplier/20" },
];

const mockTrucksByDO: Record<string, Array<{ number: string; driver: string; status: "in-transit" | "loading" | "delivered"; from: string; to: string; eta: string }>> = {
  "DO-2026-001": [
    { number: "MH12AB1234", driver: "Rajesh K.", status: "in-transit", from: "Pune", to: "Mumbai", eta: "2h 15m" },
    { number: "MH14CD5678", driver: "Sunil M.", status: "loading", from: "Pune", to: "Delhi", eta: "-" },
    { number: "MH09EF9012", driver: "Amit P.", status: "delivered", from: "Pune", to: "Nashik", eta: "Done" },
  ],
  "DO-2026-002": [
    { number: "MH20GH3456", driver: "Vikram S.", status: "in-transit", from: "Mumbai", to: "Surat", eta: "4h 30m" },
    { number: "MH31IJ7890", driver: "Ravi T.", status: "delivered", from: "Mumbai", to: "Pune", eta: "Done" },
  ],
  "DO-2026-003": [
    { number: "MH04KL1234", driver: "Mahesh D.", status: "loading", from: "Nashik", to: "Aurangabad", eta: "-" },
    { number: "MH15MN5678", driver: "Santosh G.", status: "in-transit", from: "Nashik", to: "Mumbai", eta: "3h" },
  ],
  "DO-2026-004": [
    { number: "MH11OP9012", driver: "Ganesh R.", status: "in-transit", from: "Solapur", to: "Pune", eta: "5h" },
  ],
};

const biltyByDO: Record<string, Array<{ id: string; from: string; to: string; truckNumber: string; date: string; status: "in-transit" | "delivered" | "pending" }>> = {
  "DO-2026-001": [
    { id: "4521", from: "Pune", to: "Mumbai", truckNumber: "MH12AB1234", date: "17 Feb 2026", status: "in-transit" },
    { id: "4520", from: "Pune", to: "Delhi", truckNumber: "MH14CD5678", date: "16 Feb 2026", status: "pending" },
  ],
  "DO-2026-002": [
    { id: "4518", from: "Mumbai", to: "Surat", truckNumber: "MH20GH3456", date: "17 Feb 2026", status: "in-transit" },
  ],
  "DO-2026-003": [
    { id: "4517", from: "Nashik", to: "Mumbai", truckNumber: "MH15MN5678", date: "16 Feb 2026", status: "in-transit" },
  ],
  "DO-2026-004": [
    { id: "4516", from: "Solapur", to: "Pune", truckNumber: "MH11OP9012", date: "17 Feb 2026", status: "pending" },
  ],
};

const statusBadge = {
  "in-transit": "bg-fleet-admin/15 text-fleet-admin",
  loading: "bg-fleet-warning/15 text-fleet-warning",
  delivered: "bg-fleet-success/15 text-fleet-success",
};

const SupplierPortal = () => {
  const { userName, logout } = useAuth();
  const [selectedDO, setSelectedDO] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStocks = mockStocks.filter(
    (s) => s.doNumber.toLowerCase().includes(searchQuery.toLowerCase()) || s.stock.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTrucks = selectedDO ? mockTrucksByDO[selectedDO] || [] : [];
  const selectedBilties = selectedDO ? biltyByDO[selectedDO] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-supplier">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Supplier Portal</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">FleetFlow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-supplier text-xs font-bold text-primary-foreground">
                {userName?.[0]?.toUpperCase() || "S"}
              </div>
              <button onClick={logout} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-fleet-danger transition-colors">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
        {/* DO Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
          <h3 className="text-base font-bold text-foreground mb-1">Select Stock / DO Number</h3>
          <p className="text-xs text-muted-foreground mb-4">Choose an active Delivery Order to view assigned trucks and bilties</p>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search DO Number or Stock name..."
              className="w-full rounded-xl border-2 border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-fleet-supplier focus:ring-2 focus:ring-fleet-supplier/20 transition-all"
            />
          </div>

          {/* Active DO Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredStocks.map((stock) => {
              const isSelected = selectedDO === stock.doNumber;
              return (
                <motion.button
                  key={stock.doNumber}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDO(isSelected ? null : stock.doNumber)}
                  className={`relative flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-fleet-supplier bg-fleet-supplier/5 shadow-md"
                      : "border-border hover:border-fleet-supplier/40 hover:shadow-sm"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${stock.color} mb-3`}>
                    <Box className="h-5 w-5" />
                  </div>
                  <p className="text-base font-bold text-foreground">{stock.stock}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{stock.doNumber}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {stock.location}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Truck className="h-3 w-3 text-fleet-supplier" />
                    <span className="text-xs font-medium text-fleet-supplier">{stock.trucks} trucks</span>
                  </div>
                  {isSelected && (
                    <motion.div layoutId="doIndicator" className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-fleet-supplier" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Trucks & Bilties for selected DO */}
        <AnimatePresence mode="wait">
          {selectedDO && (
            <motion.div
              key={selectedDO}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Trucks */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4 text-fleet-supplier" />
                    Trucks for {selectedDO}
                  </h3>
                  <span className="text-xs text-muted-foreground">{selectedTrucks.length} trucks</span>
                </div>
                <div className="space-y-3">
                  {selectedTrucks.map((truck) => (
                    <div key={truck.number} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fleet-supplier/10">
                          <Truck className="h-5 w-5 text-fleet-supplier" />
                        </div>
                        <div>
                          <p className="text-sm font-bold font-mono text-foreground">{truck.number}</p>
                          <p className="text-xs text-muted-foreground">{truck.driver} • {truck.from} → {truck.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[truck.status]}`}>
                            {truck.status === "in-transit" ? "In Transit" : truck.status === "loading" ? "Loading" : "Delivered"}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 justify-end">
                            <Clock className="h-3 w-3" /> ETA: {truck.eta}
                          </p>
                        </div>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-fleet-supplier/10 text-fleet-supplier hover:bg-fleet-supplier/20 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Bilties for this DO */}
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-fleet-supplier" />
                  Digital Bilties — {selectedDO}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedBilties.map((b) => (
                    <DigitalBilty key={b.id} id={b.id} from={b.from} to={b.to} truckNumber={b.truckNumber} date={b.date} status={b.status} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedDO && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Select a DO Number above to view trucks and bilties</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SupplierPortal;
