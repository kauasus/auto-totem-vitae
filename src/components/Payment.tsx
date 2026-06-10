import React from "react";
import { ArrowRight, CreditCard, DollarSign, Zap } from "lucide-react";
import type { Appointment } from "../types";

interface PaymentProps {
  appointment: Appointment;
  onBack: () => void;
  onSelect: (method: "PIX" | "CREDITO" | "DEBITO") => void;
}

const priceLabel = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

const Payment: React.FC<PaymentProps> = ({ appointment, onBack, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 animate-fade-slide-up">
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Procedimento</div>
              <div className="font-semibold text-lg">
                {appointment.procedimento}
              </div>
              <div className="text-sm text-gray-500">
                {appointment.especialidade}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Valor</div>
              <div className="text-2xl font-bold text-[color:var(--accent)]">
                {priceLabel(appointment.valor)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-white p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase font-bold">
                Médico
              </div>
              <div className="font-semibold">{appointment.medico}</div>
            </div>
            <div className="rounded-xl bg-white p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase font-bold">
                Horário
              </div>
              <div className="font-semibold">{appointment.horario}</div>
            </div>
            <div className="rounded-xl bg-white p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase font-bold">
                Consultório
              </div>
              <div className="font-semibold">
                Consultório {appointment.consultorio}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Escolha a forma de pagamento
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onSelect("PIX")}
              className="p-5 rounded-lg border border-gray-200 bg-white flex items-center justify-between hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-semibold">PIX</div>
                  <div className="text-xs text-gray-500">
                    Pagamento instantâneo
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => onSelect("CREDITO")}
              className="p-5 rounded-lg border border-gray-200 bg-white flex items-center justify-between hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-semibold">Cartão de Crédito</div>
                  <div className="text-xs text-gray-500">
                    Parcelamento disponível
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => onSelect("DEBITO")}
              className="p-5 rounded-lg border border-gray-200 bg-white flex items-center justify-between hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-indigo-600" />
                <div>
                  <div className="font-semibold">Débito</div>
                  <div className="text-xs text-gray-500">
                    Pagamento direto na maquininha
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="text-gray-700 font-semibold text-lg px-4 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          ← Voltar
        </button>
        <div className="text-sm text-gray-500">
          Toque na forma desejada para continuar
        </div>
      </footer>
    </div>
  );
};

export default Payment;
