import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import type { PatientData } from "../types";
import { fireConfetti } from "../utils/confetti";

interface SuccessProps {
  patient?: PatientData | null;
  consultorio: string;
}

const Success: React.FC<SuccessProps> = ({ patient, consultorio }) => {
  useEffect(() => {
    // dispara confete quando o componente monta
    fireConfetti();
  }, []);

  return (
    <div className="animate-fade-slide-up text-center py-8">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="w-24 h-24 text-green-500" />
        <h2 className="text-2xl font-bold">Pagamento confirmado!</h2>
        <p className="text-lg">
          Obrigado,{" "}
          <span className="font-semibold">
            {patient?.nomeCompleto ?? "Paciente"}
          </span>
          .
        </p>
        <p className="text-lg font-semibold mt-2">Dirija-se ao {consultorio}</p>
        <p className="text-sm text-gray-500 mt-2">
          A tela voltará ao início automaticamente.
        </p>
      </div>
    </div>
  );
};

export default Success;
