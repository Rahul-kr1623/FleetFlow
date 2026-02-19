import { motion } from "framer-motion";
import { Truck } from "lucide-react";

const TruckPreloader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative mb-8">
        <motion.div
          className="relative"
          animate={{ x: [-60, 60, -60] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Truck className="h-16 w-16 text-primary" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
        {/* Road line */}
        <div className="mt-2 h-0.5 w-40 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full w-1/3 gradient-primary rounded-full"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
      <motion.p
        className="text-lg font-semibold text-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading FleetFlow...
      </motion.p>
    </div>
  );
};

export default TruckPreloader;
