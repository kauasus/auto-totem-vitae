import React from "react";
import type { PatientData, Appointment } from "../types";

interface SummaryProps {
  patient: PatientData;
  appointment: Appointment;
  paymentMethod: "PIX" | "CREDITO" | "DEBITO";
  onBack: () => void;
  onFinalize: () => Promise<void>;
}

const priceLabel = (v?: number) =>
  typeof v === "number"
    ? `R$ ${v.toFixed(2).replace(".", ",")}`
    : "Não informado";

const Summary: React.FC<SummaryProps> = ({
  patient,
  appointment,
  paymentMethod,
  onBack,
  onFinalize,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFinalize = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onFinalize();
    } catch (finalizeError) {
      setError(
        finalizeError instanceof Error
          ? finalizeError.message
          : "Não foi possível imprimir agora.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-slide-up">
      <div className="space-y-4">
        <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500">Paciente</div>
          <div className="font-semibold text-lg">{patient.nomeCompleto}</div>
          <div className="text-sm text-gray-500">{patient.cpf}</div>
          <div className="mt-2 text-sm text-gray-500">
            {patient.email ?? "-"}
          </div>
        </div>

        {patient.address && (
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <div className="text-xs text-gray-500">Endereço</div>
            <div className="font-semibold text-lg">
              {patient.address.logradouro}, {patient.address.numero}
            </div>
            <div className="text-sm text-gray-500">
              {patient.address.complemento
                ? `${patient.address.complemento} • `
                : ""}
              {patient.address.bairro} • {patient.address.cidade}/
              {patient.address.uf}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {patient.address.cep}
            </div>
          </div>
        )}

        <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Procedimento</div>
            <div className="font-semibold">{appointment.procedimento}</div>
            <div className="text-sm text-gray-500">
              {appointment.especialidade}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {appointment.medico} • {appointment.horario} •{" "}
              {appointment.local || `Consultório ${appointment.numSala}`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Valor</div>
            <div className="text-2xl font-bold text-[#b91c1c]">
              {priceLabel(appointment.valor)}
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500">Forma de pagamento</div>
          <div className="font-semibold">{paymentMethod}</div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="text-gray-700 font-semibold text-lg px-4 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          ← Voltar
        </button>
        <button
          onClick={() => {
            void handleFinalize();
          }}
          disabled={isSubmitting}
          className={[
            "bg-[#b91c1c] text-white font-bold px-8 py-4 rounded-lg shadow-lg transition text-lg",
            isSubmitting ? "cursor-wait opacity-80" : "hover:bg-[#8b1212]",
          ].join(" ")}
        >
          {isSubmitting ? "Imprimindo..." : "Finalizar"}
        </button>
      </footer>
    </div>
  );
};

export default Summary;
