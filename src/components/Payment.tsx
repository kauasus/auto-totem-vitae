import React from "react";
import { AlertCircle, Keyboard } from "lucide-react";
import AddressForm from "./AddressForm";
import FieldKeyboardModal from "./FieldKeyboardModal";
import type { AddressData, Appointment, PatientData } from "../types";
import type { PaymentMethod } from "../domain/entities/check-in";
import { formatPhone, isValidCep, onlyDigits } from "../utils/validation";

interface PaymentProps {
  patient: PatientData;
  appointment: Appointment;
  onBack: () => void;
  onConfirm: (method: PaymentMethod) => Promise<void>;
  onAddressChange: (address: AddressData) => void;
  onPhoneChange: (telefone: string) => void;
  onBirthDateChange: (dataNascimento: string) => void;
  onNameChange: (nomeCompleto: string) => void;
  onSexChange: (sexo: string) => void;
}

const formatBirthDate = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const isValidBirthDate = (value?: string) => {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    year >= 1900 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= new Date()
  );
};

const isAddressComplete = (address?: AddressData) =>
  Boolean(
    address &&
      isValidCep(address.cep) &&
      address.logradouro.trim() &&
      address.numero.trim() &&
      address.bairro.trim() &&
      address.cidade.trim() &&
      address.uf.trim().length === 2 &&
      typeof address.codMunicipio === "number",
  );

const priceLabel = (v?: number) =>
  typeof v === "number"
    ? `R$ ${v.toFixed(2).replace(".", ",")}`
    : "Não informado";

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
    <div className="mt-1 text-sm font-semibold text-gray-800 wrap-break-word">
      {value || "-"}
    </div>
  </div>
);

const EditableField: React.FC<{
  label: string;
  value?: string;
  placeholder: string;
  onClick: () => void;
  invalid?: boolean;
}> = ({ label, value, placeholder, onClick, invalid = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border bg-white px-4 py-3 text-left transition hover:border-[#b91c1c] hover:shadow-sm active:scale-[0.99] ${invalid ? "border-red-400" : "border-gray-100"}`}
  >
    <div className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-widest text-gray-400">
      <span>{label}</span>
      <Keyboard className="h-3.5 w-3.5 text-gray-300" />
    </div>
    <div className="mt-1 text-sm font-semibold text-gray-800 wrap-break-word">
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  </button>
);

const paymentOptions: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    value: "PIX",
    label: "PIX",
    description: "",
  },
  {
    value: "Cartão Crédito",
    label: "Cartão de Crédito",
    description: "",
  },
  {
    value: "Cartão Débito",
    label: "Cartão de Débito",
    description: "",
  },
];

const Payment: React.FC<PaymentProps> = ({
  patient,
  appointment,
  onBack,
  onConfirm,
  onAddressChange,
  onPhoneChange,
  onBirthDateChange,
  onNameChange,
  onSexChange,
}) => {
  const [method, setMethod] = React.useState<PaymentMethod>("Retorno");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddressOpen, setIsAddressOpen] = React.useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = React.useState(false);
  const [isBirthDateOpen, setIsBirthDateOpen] = React.useState(false);
  const [isNameOpen, setIsNameOpen] = React.useState(false);

  const isNewPatient = !patient.codPaciente && !appointment.codPaciente;
  const phoneDigits = onlyDigits(patient.telefone || patient.telefone2 || "");
  const personalDataChecks = {
    nome: patient.nomeCompleto.trim().length > 0,
    nascimento: isValidBirthDate(patient.dataNascimento),
    telefone: phoneDigits.length === 10 || phoneDigits.length === 11,
    sexo: Boolean(patient.sexo?.trim()),
    endereco: isAddressComplete(patient.address),
  };
  const missingPersonalData = [
    !personalDataChecks.nome && "nome",
    !personalDataChecks.nascimento && "data de nascimento",
    !personalDataChecks.telefone && "telefone",
    !personalDataChecks.sexo && "sexo",
    !personalDataChecks.endereco && "endereço completo",
  ].filter(Boolean) as string[];
  const canCompleteReception =
    !isNewPatient || missingPersonalData.length === 0;

  const handleConfirm = async () => {
    if (!method) return;
    if (!canCompleteReception) {
      setError(
        `Preencha os dados pessoais obrigatórios: ${missingPersonalData.join(", ")}.`,
      );
      return;
    }
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
    <div className="animate-fade-slide-up h-full flex flex-col">
      <div className="p-4 md:p-5 lg:p-6 space-y-4 md:space-y-5 lg:space-y-6 flex-1 min-h-0 overflow-y-auto">
        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5 space-y-3">
          <h4 className="text-base md:text-lg font-black uppercase tracking-widest text-[#a31515]">
            {isNewPatient ? "Complete seu cadastro" : "Dados Pessoais"}
          </h4>
          {isNewPatient && (
            <p className="text-sm font-medium text-gray-600">
              Como este é seu primeiro atendimento, confira e complete os dados obrigatórios abaixo.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {isNewPatient ? (
              <>
                <EditableField
                  label="Nome"
                  value={patient.nomeCompleto}
                  placeholder="Digite seu nome completo"
                  invalid={!personalDataChecks.nome}
                  onClick={() => setIsNameOpen(true)}
                />
                <Field label="CPF" value={patient.cpf} />
                <EditableField
                  label="Nascimento"
                  value={patient.dataNascimento}
                  placeholder="DD/MM/AAAA"
                  invalid={!personalDataChecks.nascimento}
                  onClick={() => setIsBirthDateOpen(true)}
                />
              </>
            ) : (
              <>
                <Field label="Nome" value={patient.nomeCompleto} />
                <Field label="Nascimento" value={patient.dataNascimento} />
              </>
            )}
            <EditableField
              label="Telefone"
              value={patient.telefone || patient.telefone2}
              placeholder="Digite o telefone"
              invalid={isNewPatient && !personalDataChecks.telefone}
              onClick={() => setIsPhoneOpen(true)}
            />
            {isNewPatient && (
              <div className={`rounded-xl border bg-white px-4 py-3 ${personalDataChecks.sexo ? "border-gray-100" : "border-red-400"}`}>
                <div className="text-[11px] uppercase font-bold tracking-widest text-gray-400">
                  Sexo
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["Feminino", "Masculino"].map((sexo) => (
                    <button
                      key={sexo}
                      type="button"
                      onClick={() => onSexChange(sexo)}
                      className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${patient.sexo === sexo ? "border-[#a31515] bg-[#fff1f1] text-[#a31515]" : "border-gray-200 text-gray-600 hover:border-[#d9a5a5]"}`}
                    >
                      {sexo}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 col-span-1 md:col-span-3">
              <div className="text-[11px] uppercase font-bold tracking-widest text-gray-400">
                Endereço
              </div>
              <div className="mt-1 text-base font-semibold text-gray-800 wrap-break-word leading-tight">
                {addressLabel(patient)}
              </div>
              <button
                type="button"
                onClick={() => setIsAddressOpen(true)}
                className={`mt-3 rounded-lg border px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-[#fef2f2] ${!isNewPatient || personalDataChecks.endereco ? "border-[#a31515] text-[#a31515]" : "border-red-500 bg-red-50 text-red-600"}`}
              >
                Editar endereço
              </button>
            </div>
          </div>
          {isNewPatient && !canCompleteReception && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Para concluir a recepção, preencha: {missingPersonalData.join(", ")}.
              </span>
            </div>
          )}
          {/* <p className="text-sm text-gray-500">
            Nota fiscal: notafiscal@vitaecenter.com.br
          </p> */}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5 space-y-3">
          <h4 className="text-base md:text-lg font-black uppercase tracking-widest text-[#a31515]">
            Dados do Agendamento
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Field
              label={appointment.indSexoMedico === "Feminino" ? "Dra." : "Dr."}
              value={appointment.medico}
            />
            <Field
              label="Serviço"
              value={`${appointment.nomProcedimento} ${appointment.indRetorno ? "Retorno" : ""}`}
            />
            <Field label="Horário" value={appointment.horario} />
            <Field
              label="Consultório"
              value={`${appointment.numSala}`.padStart(2, "0")}
            />
          </div>
        </section>
        {!appointment.indRetorno && (
          <section className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5 space-y-3">
            <h4 className="text-base md:text-lg font-black uppercase tracking-widest text-[#a31515]">
              Pagamento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <Field label="Valor" value={priceLabel(appointment.valor)} />
              <Field label="Convênio" value={appointment.convenio} />
            </div>
            <div className="text-base font-semibold text-gray-700">
              Selecione a forma de pagamento
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {paymentOptions.map((option) => {
                const selected = method === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMethod(option.value)}
                    className={[
                      "rounded-xl border px-4 py-4 text-left transition-all",
                      selected
                        ? "border-[#a31515] bg-[#fff1f1] shadow-sm"
                        : "border-gray-200 bg-white hover:border-[#d9a5a5]",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "mt-1 h-5 w-5 rounded-full border-2",
                          selected
                            ? "border-[#a31515] bg-[#a31515]"
                            : "border-gray-300 bg-white",
                        ].join(" ")}
                      />
                      <div>
                        <div className="text-base font-bold text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* <p className="text-base text-gray-600">
            Em frente do agendamento de pagamento, verificar a
            maquininha/cartão.
          </p> */}
          </section>
        )}
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 border-t border-gray-100 bg-white">
        <button
          onClick={onBack}
          className="text-gray-700 font-semibold text-xl px-6 py-3 rounded-xl hover:bg-gray-50 transition"
        >
          ← Voltar
        </button>
        <button
          onClick={() => void handleConfirm()}
          disabled={
            isSubmitting ||
            !canCompleteReception ||
            (method === "Retorno" && !appointment?.indRetorno)
          }
          className={[
            "px-10 py-4 rounded-xl font-bold text-xl transition-all",
            isSubmitting ||
            !canCompleteReception ||
            (method === "Retorno" && !appointment?.indRetorno) ||
            (!method && !appointment?.indRetorno)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#a31515] text-white shadow-lg hover:bg-[#8b1212] active:scale-95",
          ].join(" ")}
        >
          {isSubmitting
            ? "Confirmando..."
            : appointment.indRetorno
              ? "Concluir Recepção"
              : "Concluir Pagamento"}
        </button>
      </footer>

      <FieldKeyboardModal
        key={`name-${patient.nomeCompleto}`}
        open={isNameOpen}
        title="Nome completo"
        subtitle="Digite seu nome completo."
        value={patient.nomeCompleto}
        keyboardKind="text"
        placeholder="Nome completo"
        maxLength={100}
        onClose={() => setIsNameOpen(false)}
        onConfirm={(nextValue) => {
          onNameChange(nextValue.trim().replace(/\s+/g, " ").toUpperCase());
          setIsNameOpen(false);
        }}
      />

      <FieldKeyboardModal
        key={`birth-date-${patient.dataNascimento ?? ""}`}
        open={isBirthDateOpen}
        title="Data de nascimento"
        subtitle="Digite a data no formato DD/MM/AAAA."
        value={onlyDigits(patient.dataNascimento ?? "")}
        keyboardKind="numeric"
        placeholder="DD/MM/AAAA"
        maxLength={8}
        previewFormatter={formatBirthDate}
        onClose={() => setIsBirthDateOpen(false)}
        onConfirm={(nextValue) => {
          onBirthDateChange(formatBirthDate(nextValue));
          setIsBirthDateOpen(false);
        }}
      />

      <FieldKeyboardModal
        key={`phone-${patient.telefone ?? patient.telefone2 ?? ""}`}
        open={isPhoneOpen}
        title="Telefone"
        subtitle="Digite o telefone com DDD."
        value={onlyDigits(patient.telefone || patient.telefone2 || "")}
        keyboardKind="numeric"
        placeholder="11999999999"
        maxLength={11}
        previewFormatter={formatPhone}
        onClose={() => setIsPhoneOpen(false)}
        onConfirm={(nextValue) => {
          onPhoneChange(formatPhone(nextValue));
          setIsPhoneOpen(false);
        }}
      />
    </div>
  );
};

export default Payment;
