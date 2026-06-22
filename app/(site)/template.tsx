"use client";

import { motion } from "framer-motion";

/** Fade rapido aplicado en cada cambio de ruta (sin desplazamiento para
 *  no retrasar la percepcion de carga). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
