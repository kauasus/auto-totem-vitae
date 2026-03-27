import React, { useState } from 'react';
import CpfInput from './components/CpfInput';
import ConfirmData from './components/ConfirmData';
import Payment from './components/Payment';
import Summary from './components/Sumarry';
import Success from './components/Sucess';
import type { PatientData, Appointment } from './types';
import { searchPatientByCpf } from './mock/api';

type Step = 'cpf' | 'confirm' | 'payment' | 'summary' | 'success';

const mockAppointment: Appointment = {
  especialidade: 'Clínico Geral',
  procedimento: 'Consulta Avulsa',
  valor: 120.0,
  sala: 'Consultório 3',
};

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('cpf');
  const [cpfOnlyNumbers, setCpfOnlyNumbers] = useState('');
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [appointment] = useState<Appointment>(mockAppointment);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDITO' | 'DEBITO' | null>(null);

  const handleCpfSearch = async (cpfNums: string) => {
    const res = await searchPatientByCpf(cpfNums);
    if (res.found && res.patient) {
      setPatient(res.patient);
      setStep('confirm');
    }
    return res;
  };

  const handleConfirmNext = () => setStep('payment');
  const handlePaymentSelect = (method: 'PIX' | 'CREDITO' | 'DEBITO') => {
    setPaymentMethod(method);
    setStep('summary');
  };
  const handleFinalize = () => {
    setStep('success');
    setTimeout(() => {
      // reinicia o totem automaticamente
      setPatient(null);
      setCpfOnlyNumbers('');
      setPaymentMethod(null);
      setStep('cpf');
    }, 3000);
  };

  // subtitle dinâmico para o header
  const subtitleMap: Record<Step, string> = {
    cpf: 'Identifique-se para iniciar o atendimento',
    confirm: '07:00 · CONS. PSIQUIATRIA · Sala 13 · CRISTIANE MILAGRES RESENDE',
    payment: `${appointment.especialidade} · ${appointment.procedimento}`,
    summary: 'Revise e confirme suas informações',
    success: 'Pagamento confirmado',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* enquadramento único: cabeçalho vermelho + área branca abaixo */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-[#b42222] to-[#8b1212] text-white p-6">
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wide">Recepção de Paciente</h1>
              <p className="text-sm mt-1 opacity-90">{subtitleMap[step]}</p>
            </div>
          </div>

          <div className="bg-white p-6">
            {/* conteúdo por etapa */}
            {step === 'cpf' && (
              <div className="space-y-6">
                <CpfInput cpf={cpfOnlyNumbers} setCpf={setCpfOnlyNumbers} onSubmit={handleCpfSearch} />
              </div>
            )}

            {step === 'confirm' && patient && (
              <ConfirmData
                patient={patient}
                onBack={() => {
                  // limpa CPF ao voltar para a tela inicial (evita busca imediata)
                  setPatient(null);
                  setCpfOnlyNumbers('');
                  setStep('cpf');
                }}
                onNext={handleConfirmNext}
              />
            )}

            {step === 'payment' && patient && (
              <Payment appointment={appointment} onBack={() => setStep('confirm')} onSelect={handlePaymentSelect} />
            )}

            {step === 'summary' && patient && paymentMethod && (
              <Summary
                patient={patient}
                appointment={appointment}
                paymentMethod={paymentMethod}
                onBack={() => setStep('payment')}
                onFinalize={handleFinalize}
              />
            )}

            {step === 'success' && (
              <div className="py-8">
                <Success patient={patient} consultorio={appointment.sala ?? 'Consultório 1'} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;