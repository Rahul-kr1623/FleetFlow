import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Shield, CreditCard, AlertTriangle, CheckCircle, Eye, X, QrCode } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export interface Document {
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
  const { role } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Filter documents based on role
  const filteredDocuments = documents.filter((doc) => {
    if (role === "admin") return true; // Fleet Owner sees all
    if (role === "driver") {
      // Driver sees only vehicle docs + their license
      // In a real app, check doc.vehicleNumber === assignedVehicle
      return ["RC", "Insurance", "Permit", "License"].includes(doc.type);
    }
    if (role === "supplier") {
      // Supplier sees only verification docs for the truck
      return ["RC", "Insurance", "Permit"].includes(doc.type);
    }
    return false;
  });

  const getExpiryTag = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { label: "Expired", className: "bg-destructive/15 text-destructive border-destructive/30" };
    if (days <= 7) return { label: `${days}d left`, className: "bg-orange-500/15 text-orange-600 border-orange-500/30" };
    if (days <= 30) return { label: `${days}d left`, className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" };
    return { label: "Valid", className: "bg-green-500/15 text-green-600 border-green-500/30" };
  };

  return (
    <>
      <div className="space-y-3">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-accent/20 rounded-xl border border-dashed border-border px-4">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No documents found for your role.</p>
          </div>
        ) : (
          filteredDocuments.map((doc, i) => {
            const tag = getExpiryTag(doc.expiryDate);
            const Icon = typeIcons[doc.type] || FileText;
            const days = differenceInDays(new Date(doc.expiryDate), new Date());

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDoc(doc)}
                className="group relative flex items-center justify-between rounded-xl border border-border bg-card p-3 hover:bg-accent/50 transition-colors cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${days < 0 ? "bg-destructive/10" : "bg-primary/10"}`}>
                    {days < 0 ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Icon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {doc.vehicleNumber ? <span className="font-mono bg-muted px-1 rounded">{doc.vehicleNumber}</span> : null}
                      {doc.vehicleNumber && "•"}
                      Exp: {format(new Date(doc.expiryDate), "dd MMM yy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tag.className}`}>
                    {tag.label}
                  </span>
                  <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Show to RTO Full Screen Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl p-4 sm:p-6"
            style={{ touchAction: "none" }} // Prevent scrolling while open
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide">RTO VERIFICATION MODE</span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Document Content */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-300">
              {/* Simulated High Brightness Warning or Effect */}

              <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-black uppercase">{selectedDoc.name}</h2>
                  <p className="text-sm text-gray-500 font-mono mt-1">{selectedDoc.vehicleNumber}</p>
                </div>

                <div className="aspect-square bg-white border-4 border-black rounded-xl mb-6 p-2 flex items-center justify-center relative">
                  {/* Placeholder QR Code */}
                  <QrCode className="h-full w-full text-black" strokeWidth={1} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-white px-2 text-xs font-bold text-black border border-black">SCAN TO VERIFY</span>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase font-bold">Status</span>
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> ACTIVE / VALID
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase font-bold">Issued By</span>
                    <span className="text-sm font-bold text-black">MoRTH, Govt of India</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase font-bold">Valid Upto</span>
                    <span className="text-sm font-bold text-black">{format(new Date(selectedDoc.expiryDate), "dd MMMM yyyy")}</span>
                  </div>
                </div>
              </div>

              <p className="text-white/50 text-xs text-center max-w-xs">
                This is a digital copy of the document valid under IT Act 2000.
                Please increase screen brightness for scanning.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DocumentVault;
