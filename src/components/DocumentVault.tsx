import { motion } from "framer-motion";
import { FileText, Shield, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { differenceInDays, format } from "date-fns";

interface Document {
  id: string;
  name: string;
  type: "RC" | "Insurance" | "Permit" | "License" | "Fitness";
  expiryDate: string;
  vehicleNumber?: string;
}

const typeIcons = {
  RC: FileText,
  Insurance: Shield,
  Permit: CreditCard,
  License: CreditCard,
  Fitness: CheckCircle,
};

const DocumentVault = ({ documents }: { documents: Document[] }) => {
  const getExpiryTag = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { label: "Expired", className: "bg-fleet-danger/15 text-fleet-danger border-fleet-danger/30" };
    if (days <= 7) return { label: `${days}d left`, className: "bg-fleet-warning/15 text-fleet-warning border-fleet-warning/30" };
    if (days <= 30) return { label: `${days}d left`, className: "bg-fleet-driver/15 text-fleet-driver border-fleet-driver/30" };
    return { label: "Valid", className: "bg-fleet-success/15 text-fleet-success border-fleet-success/30" };
  };

  return (
    <div className="space-y-3">
      {documents.map((doc, i) => {
        const tag = getExpiryTag(doc.expiryDate);
        const Icon = typeIcons[doc.type] || FileText;
        const days = differenceInDays(new Date(doc.expiryDate), new Date());

        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${days < 0 ? "bg-fleet-danger/15" : "bg-primary/10"}`}>
                {days < 0 ? (
                  <AlertTriangle className="h-4 w-4 text-fleet-danger" />
                ) : (
                  <Icon className="h-4 w-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.vehicleNumber && `${doc.vehicleNumber} • `}Exp: {format(new Date(doc.expiryDate), "dd MMM yyyy")}
                </p>
              </div>
            </div>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tag.className}`}>
              {tag.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DocumentVault;
