import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import type { PatientData } from "../types";

interface SuccessProps {
  patient?: PatientData | null;
  consultorio: string;
}

type Stage = "processing" | "invoice" | "success";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Success: React.FC<SuccessProps> = ({ patient, consultorio }) => {
  const [stage, setStage] = useState<Stage>("processing");

  useEffect(() => {
    let isMounted = true;

    const runFlow = async () => {
      await delay(2000);
      if (!isMounted) return;
      setStage("invoice");

      await delay(2000);
      if (!isMounted) return;
      setStage("success");

      await delay(10000);
      if (!isMounted) return;

      // aqui você pode resetar ou redirecionar
    };

    runFlow();

    return () => {
      isMounted = false;
    };
  }, []);

  if (stage !== "success") {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>
          {stage === "processing"
            ? "Processando pagamento..."
            : "Emitindo Nota Fiscal..."}
        </span>
      </div>
    );
  }

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
