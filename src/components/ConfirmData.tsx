import React from "react";
import { Phone, User } from "lucide-react";
import type { PatientData } from "../types";
import EditableEmailField from "./EditableEmailField";

interface ConfirmDataProps {
  patient: PatientData;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onEmailChange: (email: string) => void;
}

const Field: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] uppercase font-bold text-gray-400 ml-1">
      {label}
    </label>
    <div className="p-3 bg-[#f8f9fa] border border-gray-100 rounded-lg text-gray-700 font-medium">
      {value || "-"}
    </div>
  </div>
);

const ConfirmData: React.FC<ConfirmDataProps> = ({
  patient,
  canProceed,
  onBack,
  onNext,
  onEmailChange,
}) => {
  return (
    <div className="animate-fade-slide-up">
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2 mb-3 text-[#a31515]">
          <User size={18} />
          <h4 className="font-bold text-sm uppercase tracking-widest">
            Identificação
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Nome completo" value={patient.nomeCompleto} />
          <Field label="CPF" value={patient.cpf} />

          <Field label="Data de nascimento" value={patient.dataNascimento} />
        </div>

        <div className="flex items-center gap-2 mt-4 mb-2 text-[#a31515]">
          <Phone size={18} />
          <h4 className="font-bold text-sm uppercase tracking-widest">
            Contato
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Telefone / Celular" value={patient.telefone} />
          <Field label="Telefone 2" value={patient.telefone2} />

          <EditableEmailField
            value={patient.email ?? ""}
            onChange={onEmailChange}
          />
        </div>
      </div>

      <footer className="flex items-center justify-between p-6 border-t border-gray-100 bg-white">
        <button
          onClick={onBack}
          className="text-gray-700 font-semibold text-lg px-6 py-3 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
        >
          ← Cancelar
        </button>
        <div className="flex flex-col items-end gap-2">
          {!canProceed && (
            <p className="text-sm font-semibold text-[#a31515] text-right">
              O e-mail precisa estar válido antes de continuar.
            </p>
          )}
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={[
              "px-12 py-3 rounded-xl font-bold text-xl transition-all",
              canProceed
                ? "bg-[#a31515] text-white shadow-lg hover:bg-[#8b1212] active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none",
            ].join(" ")}
          >
            Próximo →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ConfirmData;
