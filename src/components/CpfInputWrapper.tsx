/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/CpfInputWrapper.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CpfInput from "./CpfInput";

interface CpfInputWrapperProps {
  visible: boolean;
  cpf: string;
  setCpf: (cpf: string) => void;
  onSubmit: (cpfOnlyNumbers: string) => Promise<any>;
}

const CpfInputWrapper: React.FC<CpfInputWrapperProps> = ({
  visible,
  cpf,
  setCpf,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cpf-input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <CpfInput cpf={cpf} setCpf={setCpf} onSubmit={onSubmit} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CpfInputWrapper;
