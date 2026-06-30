import React from "react";
import AddressForm from "./AddressForm";
import type { AddressData, Appointment, PatientData } from "../types";

type PaymentMethod = "PIX" | "CREDITO" | "DEBITO";

interface PaymentProps {
  patient: PatientData;
  appointment: Appointment;
  onBack: () => void;
  onConfirm: (method: PaymentMethod) => Promise<void>;
  onAddressChange: (address: AddressData) => void;
}

const priceLabel = (v?: number) =>
  typeof v === "number"
    ? `R$ ${v.toFixed(2).replace(".", ",")}`
    : "Não informado";

const roomLabel = (appointment: Appointment) =>
  appointment.local || `Consultório ${appointment.consultorio}`;

const addressLabel = (patient: PatientData) => {
  if (!patient.address) return "Endereço não informado";
  return [
    [patient.address.logradouro, patient.address.numero]
      .filter(Boolean)
      .join(", "),
    patient.address.bairro,
    [patient.address.cidade, patient.address.uf].filter(Boolean).join("/"),
    patient.address.cep,
  ]
    .filter((part) => part && String(part).trim().length > 0)
    .join(" • ");
};

const Field: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
    <div className="text-[11px] uppercase font-bold tracking-widest text-gray-400">
      {label}
    </div>
    <div className="mt-1 text-sm font-semibold text-gray-800 break-words">
      {value || "-"}
    </div>
  </div>
);

const paymentOptions: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    value: "PIX",
    label: "PIX",
    description: "Pagamento instantâneo",
  },
  {
    value: "CREDITO",
    label: "Cartão de Crédito",
    description: "Confirmar na maquininha/cartão",
  },
  {
    value: "DEBITO",
    label: "Cartão de Débito",
    description: "Confirmar na maquininha/cartão",
  },
];

const Payment: React.FC<PaymentProps> = ({
  patient,
  appointment,
  onBack,
  onConfirm,
  onAddressChange,
}) => {
  const [method, setMethod] = React.useState<PaymentMethod | "">("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddressOpen, setIsAddressOpen] = React.useState(false);

  const handleConfirm = async () => {
    if (!method) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(method);
    } catch (confirmError) {
      setError(
        confirmError instanceof Error
          ? confirmError.message
          : "Não foi possível concluir o pagamento agora.",
      );
      setIsSubmitting(false);
    }
  };

  if (isAddressOpen) {
    return (
      <AddressForm
        value={patient.address}
        onChange={onAddressChange}
        onBack={() => setIsAddressOpen(false)}
        onNext={() => setIsAddressOpen(false)}
      />
    );
  }

  return (
    <div className="animate-fade-slide-up">
      <div className="p-6 space-y-6">
        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5 space-y-3">
          <h4 className="text-sm font-black uppercase tracking-widest text-[#a31515]">
            Dados
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nome" value={patient.nomeCompleto} />
            <Field
              label="Telefone"
              value={patient.telefone || patient.telefone2}
            />
            <Field label="Nascimento" value={patient.dataNascimento} />
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
              <div className="text-[11px] uppercase font-bold tracking-widest text-gray-400">
                Endereço
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-800 break-words">
                {addressLabel(patient)}
              </div>
              <button
                type="button"
                onClick={() => setIsAddressOpen(true)}
                className="mt-3 rounded-lg border border-[#a31515] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#a31515] hover:bg-[#fef2f2]"
              >
                Editar endereço
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Nota fiscal: notafiscal@vitaecenter.com.br
          </p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5 space-y-3">
          <h4 className="text-sm font-black uppercase tracking-widest text-[#a31515]">
            Consulta
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Dr." value={appointment.medico} />
            <Field label="Especialidade" value={appointment.especialidade} />
            <Field label="Horário" value={appointment.horario} />
            <Field label="Consultório" value={roomLabel(appointment)} />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5 space-y-3">
          <h4 className="text-sm font-black uppercase tracking-widest text-[#a31515]">
            Pagamento
          </h4>
          <Field label="Valor" value={priceLabel(appointment.valor)} />
          <div className="text-sm font-semibold text-gray-700">
            Caixinha para selecionar e pagar
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {paymentOptions.map((option) => {
              const selected = method === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMethod(option.value)}
                  className={[
                    "rounded-xl border px-4 py-3 text-left transition-all",
                    selected
                      ? "border-[#a31515] bg-[#fff1f1] shadow-sm"
                      : "border-gray-200 bg-white hover:border-[#d9a5a5]",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={[
                        "mt-1 h-4 w-4 rounded-full border-2",
                        selected
                          ? "border-[#a31515] bg-[#a31515]"
                          : "border-gray-300 bg-white",
                      ].join(" ")}
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-gray-600">
            Em frente do agendamento de pagamento, verificar a
            maquininha/cartão.
          </p>
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
        </section>
      </div>

      <footer className="flex items-center justify-between p-6 border-t border-gray-100 bg-white">
        <button
          onClick={onBack}
          className="text-gray-700 font-semibold text-lg px-6 py-3 rounded-xl hover:bg-gray-50 transition"
        >
          ← Voltar
        </button>
        <button
          onClick={() => void handleConfirm()}
          disabled={!method || isSubmitting}
          className={[
            "px-10 py-3 rounded-xl font-bold text-lg transition-all",
            !method || isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#a31515] text-white shadow-lg hover:bg-[#8b1212] active:scale-95",
          ].join(" ")}
        >
          {isSubmitting ? "Confirmando..." : "Concluir Pagamento"}
        </button>
      </footer>
    </div>
  );
};

export default Payment;
