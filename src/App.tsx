// src/App.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CpfInput from "./components/CpfInput";
import AppointmentConfirm from "./components/AppointmentConfirm";
import ConfirmData from "./components/ConfirmData";
import Payment from "./components/Payment";
import Summary from "./components/Sumarry";
import Success from "./components/Sucess";
import type { Appointment, PatientData } from "./types";
import { searchPatientByCpf } from "./mock/api";
import VitaeLogo from "./components/VitaeLogo";
import { isValidEmail, normalizeEmail } from "./utils/validation";
import AddressForm from "./components/AddressForm";

type Step =
  | "cpf"
  | "appointment"
  | "confirm"
  | "address"
  | "payment"
  | "summary"
  | "success";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<Step>("cpf");

  const [cpfOnlyNumbers, setCpfOnlyNumbers] = useState("");
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "PIX" | "CREDITO" | "DEBITO" | null
  >(null);

  const canProceedConfirm = isValidEmail(patient?.email ?? "");

  const handleStart = () => setShowSplash(false);

  const handleRestart = () => {
    setPatient(null);
    setAppointment(null);
    setCpfOnlyNumbers("");
    setPaymentMethod(null);
    setStep("cpf");
  };

  const handleCpfSearch = async (cpfNums: string) => {
    const res = await searchPatientByCpf(cpfNums);
    if (res.found && res.patient) {
      setPatient(res.patient);
      setAppointment(res.appointment ?? null);
      setStep("appointment");
    }
    return res;
  };

  const handleFinalize = () => {
    setStep("success");
    setTimeout(() => {
      handleRestart();
      setShowSplash(true);
    }, 8500);
  };

  const subtitleMap: Record<Step, string> = {
    cpf: "Identifique-se para iniciar o atendimento",
    appointment: "Confirme seu agendamento",
    confirm: "Confirme seus dados pessoais",
    address: "Confirme seu endereço",
    payment: "Confirme seu procedimento e o preço",
    summary: "Revise e confirme suas informações",
    success: "Pagamento confirmado",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] bg-white-300 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative mb-12"
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative z-10">
                <VitaeLogo
                  width={220}
                  height={220}
                  className="vitae-animated"
                  animate={true}
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-white/30 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#b42222] text-white px-16 py-5 rounded-full text-2xl font-black uppercase tracking-[0.2em] shadow-2xl">
                Iniciar Atendimento
              </div>
            </motion.button>

            <p className="mt-6 font-medium tracking-widest uppercase text-sm animate-pulse">
              Toque no botão para começar
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="totem-content"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20">
              <div className="bg-gradient-to-r from-[#b42222] to-[#8b1212] text-white p-8">
                <h1 className="font-black uppercase tracking-tighter text-3xl md:text-4xl text-center drop-shadow-md">
                  {subtitleMap[step]}
                </h1>
              </div>

              <div className="bg-white p-8 min-h-[500px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === "cpf" && (
                      <CpfInput
                        cpf={cpfOnlyNumbers}
                        setCpf={setCpfOnlyNumbers}
                        onSubmit={handleCpfSearch}
                      />
                    )}

                    {step === "appointment" && patient && appointment && (
                      <AppointmentConfirm
                        appointment={appointment}
                        onBack={handleRestart}
                        onNext={() => setStep("confirm")}
                      />
                    )}

                    {step === "confirm" && patient && (
                      <ConfirmData
                        patient={patient}
                        canProceed={canProceedConfirm}
                        onBack={() => setStep("appointment")}
                        onEmailChange={(email) => {
                          setPatient((current) =>
                            current
                              ? { ...current, email: normalizeEmail(email) }
                              : current,
                          );
                        }}
                        onNext={() => {
                          if (canProceedConfirm) setStep("address");
                        }}
                      />
                    )}

                    {step === "address" && patient && appointment && (
                      <AddressForm
                        value={patient.address}
                        onChange={(address) => {
                          setPatient((current) =>
                            current ? { ...current, address } : current,
                          );
                        }}
                        onBack={() => setStep("confirm")}
                        onNext={() => setStep("payment")}
                      />
                    )}

                    {step === "payment" && patient && appointment && (
                      <Payment
                        appointment={appointment}
                        onBack={() => setStep("address")}
                        onSelect={(method) => {
                          setPaymentMethod(method);
                          setStep("summary");
                        }}
                      />
                    )}

                    {step === "summary" &&
                      patient &&
                      appointment &&
                      paymentMethod && (
                        <Summary
                          patient={patient}
                          appointment={appointment}
                          paymentMethod={paymentMethod}
                          onBack={() => setStep("payment")}
                          onFinalize={handleFinalize}
                        />
                      )}

                    {step === "success" && (
                      <Success
                        patient={patient}
                        consultorio={
                          appointment
                            ? `Consultório ${appointment.consultorio}`
                            : "Consultório 3"
                        }
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
