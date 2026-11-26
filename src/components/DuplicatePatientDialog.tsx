import { useEffect, useRef } from "react";
import type { PatientData } from "../domain/entities/check-in";

type DuplicatePatientDialogProps = {
  patients: PatientData[];
  onSelect: (patient: PatientData) => void;
  onCancel: () => void;
};

export default function DuplicatePatientDialog({
  patients,
  onSelect,
  onCancel,
}: DuplicatePatientDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="duplicate-patient-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto max-h-[85vh] w-[min(92vw,38rem)] overflow-y-auto rounded-2xl p-6 shadow-xl backdrop:bg-black/50"
    >
      <h2 id="duplicate-patient-title" className="text-2xl font-bold text-[#a31515]">
        Selecione seu cadastro
      </h2>
      <p className="mt-2 text-gray-700">
        Encontramos cadastro para o CPF e a data de nascimento informados.
      </p>
      <ul className="my-5 space-y-3">
        {patients.map((patient) => (
          <li key={patient.codPaciente}>
            <button
              type="button"
              onClick={() => onSelect(patient)}
              className="w-full rounded-xl border border-gray-300 p-4 text-left hover:border-[#a31515] hover:bg-red-50 focus-visible:outline-[#a31515]"
            >
              <span className="block text-lg font-bold">{patient.nomeCompleto}</span>
              <span className="text-gray-600">Cadastro nº {patient.codPaciente}</span>
              {patient.telefone && (
                <span className="ml-3 text-gray-600">
                  Telefone final {patient.telefone.slice(-4)}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onCancel} className="rounded-lg px-4 py-3 font-bold text-gray-700 hover:bg-gray-100">
        Voltar
      </button>
    </dialog>
  );
}
