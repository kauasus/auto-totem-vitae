import React from "react";
import { CalendarClock, Stethoscope } from "lucide-react";
import type { Appointment } from "../types";

interface AppointmentConfirmProps {
  appointment: Appointment;
  onBack: () => void;
  onNext: () => void;
}

const Field: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
    <div className="text-[11px] uppercase font-black tracking-[0.25em] text-gray-400">
      {label}
    </div>
    <div className="mt-2 text-lg font-semibold text-gray-800 leading-snug">
      {value}
    </div>
  </div>
);

const AppointmentConfirm: React.FC<AppointmentConfirmProps> = ({
  appointment,
  onBack,
  onNext,
}) => {
  return (
    <div className="animate-fade-slide-up">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 text-[#a31515]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fef2f2]">
            <CalendarClock className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black text-lg uppercase tracking-widest">
              Confirme o agendamento
            </h4>
            <p className="text-sm text-gray-500">
              Revise os dados antes de continuar
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-gray-100 bg-[#fbfbfb] p-5 md:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fef2f2] px-3 py-1.5 text-sm font-bold text-[#a31515]">
                <Stethoscope className="h-4 w-4" />
                Atendimento localizado
              </div>
              <h3 className="mt-4 text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
                Confira os dados do seu horário
              </h3>
              <p className="mt-2 text-base text-gray-600 max-w-xl">
                Se estiver tudo certo, toque em continuar para seguir para a
                confirmação dos dados pessoais.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 ">
            <Field label="Médico" value={appointment.medico} />
            <Field label="Especialidade" value={appointment.especialidade} />

            <Field label="Horário" value={appointment.horario} />
            <Field
              label="Consultório"
              value={`Consultório ${appointment.consultorio}`}
            />
            <Field label="Data da agenda" value={appointment.dataAgenda ?? "-"} />
          </div>

        
        </div>
      </div>

      <footer className="flex items-center justify-between p-6 border-t border-gray-100 bg-white">
        <button
          onClick={onBack}
          className="text-gray-700 font-semibold text-lg px-6 py-3 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
        >
          ← Voltar
        </button>

        <button
          onClick={onNext}
          className="bg-[#a31515] text-white font-bold px-12 py-3 rounded-xl shadow-lg hover:bg-[#8b1212] active:scale-95 transition-all text-xl"
        >
          Continuar →
        </button>
      </footer>
    </div>
  );
};

export default AppointmentConfirm;
