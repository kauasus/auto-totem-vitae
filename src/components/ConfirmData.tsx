import React from 'react';
import { User, Phone } from 'lucide-react';
import type { PatientData } from '../types';

interface ConfirmDataProps {
  patient: PatientData;
  onBack: () => void;
  onNext: () => void;
}

const Field: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] uppercase font-bold text-gray-400 ml-1">{label}</label>
    <div className="p-3 bg-[#f8f9fa] border border-gray-100 rounded-lg text-gray-700 font-medium">
      {value || '-'}
    </div>
  </div>
);

const ConfirmData: React.FC<ConfirmDataProps> = ({ patient, onBack, onNext }) => {
  return (
    <div className="animate-fade-slide-up">
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2 mb-3 text-[#a31515]">
          <User size={18} />
          <h4 className="font-bold text-sm uppercase tracking-widest">Identificação</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Nome completo" value={patient.nomeCompleto} />
          <Field label="CPF" value={patient.cpf} />
          <Field label="RG" value={patient.rg} />
          <Field label="Data de nascimento" value={patient.dataNascimento} />
          <Field label="Estado civil" value={patient.estadoCivil} />
          <Field label="Sexo" value={patient.sexo} />
        </div>

        <div className="flex items-center gap-2 mt-4 mb-2 text-[#a31515]">
          <Phone size={18} />
          <h4 className="font-bold text-sm uppercase tracking-widest">Contato</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Telefone / Celular" value={patient.telefone} />
          <Field label="Telefone 2" value={patient.telefone2} />
          <Field label="E-mail" value={patient.email} />
        </div>
      </div>

      <footer className="flex items-center justify-between p-6 border-t border-gray-100 bg-white">
        <button onClick={onBack} className="text-gray-700 font-semibold text-lg px-6 py-3 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
          ← Cancelar
        </button>
        <button onClick={onNext} className="bg-[#a31515] text-white font-bold px-12 py-3 rounded-xl shadow-lg hover:bg-[#8b1212] active:scale-95 transition-all text-xl">
          Próximo →
        </button>
      </footer>
    </div>
  );
};

export default ConfirmData;