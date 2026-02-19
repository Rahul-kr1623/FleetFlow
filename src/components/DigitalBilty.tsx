import { motion } from "framer-motion";
import { FileText, QrCode, Download, Truck } from "lucide-react";

interface DigitalBiltyProps {
  id: string;
  from: string;
  to: string;
  truckNumber: string;
  date: string;
  status: "in-transit" | "delivered" | "pending";
}

const statusStyles = {
  "in-transit": "bg-fleet-admin/10 text-fleet-admin border-fleet-admin/30",
  delivered: "bg-fleet-success/10 text-fleet-success border-fleet-success/30",
  pending: "bg-fleet-warning/10 text-fleet-warning border-fleet-warning/30",
};

const DigitalBilty = ({ id, from, to, truckNumber, date, status }: DigitalBiltyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Bilty #{id}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
          {status.replace("-", " ")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-sm font-medium text-foreground">{from}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">To</p>
          <p className="text-sm font-medium text-foreground">{to}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-sm font-mono font-medium text-foreground">{truckNumber}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <QrCode className="h-8 w-8" />
          <span className="text-xs">Scan to verify</span>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>
    </motion.div>
  );
};

export default DigitalBilty;
