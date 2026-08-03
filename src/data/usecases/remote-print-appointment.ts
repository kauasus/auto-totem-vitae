import type { PatientData, Appointment } from "../../domain/entities/check-in";
import type { PrinterHttpClient } from "../../infra/http/printer-fetch-http-client";
import { getAttendanceUserName } from "../../infra/auth/attendance-user-storage";

export type PrintAppointmentRequest = {
  codAtendimento: number;
  paciente: string;
  medico: string;
  procedimento: string;
  sala: string;
  corLinha: string;
  andar: string;
  atendimentoGeradoPor?: string;
};

export interface PrintAppointmentUseCase {
  execute(input: {
    patient: PatientData;
    appointment: Appointment;
  }): Promise<void>;
}

const formatPrintDateTime = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

// const formatDoctorLabel = (value: string) => {
//   const normalized = value.trim();

//   if (!normalized) {
//     return normalized;
//   }

//   if (/^(dr\.?|dra\.?)\b/i.test(normalized)) {
//     return normalized.replace(/^(dr\.?|dra\.?)\b/i, (match) => {
//       const lower = match.toLowerCase();
//       return lower.startsWith("dra") ? "Dra." : "Dr.";
//     });
//   }

//   return `Dr. ${normalized}`;
// };

export class RemotePrintAppointment implements PrintAppointmentUseCase {
  private readonly httpClient: PrinterHttpClient;
  private readonly endpoint: string;

  constructor(httpClient: PrinterHttpClient, endpoint: string) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async execute(input: {
    patient: PatientData;
    appointment: Appointment;
  }): Promise<void> {
    const { patient, appointment } = input;

    if (!this.endpoint.trim()) {
      throw new Error("Defina a URL da impressora em `VITE_PRINT_API_URL`.");
    }

    if (!appointment.codAtendimento) {
      throw new Error("Não foi possível imprimir: codAtendimento ausente.");
    }

    const payload: PrintAppointmentRequest = {
      codAtendimento: appointment.codAtendimento,
      paciente: patient.nomeCompleto,
      medico: `${appointment.indSexoMedico === "Feminino" ? "DRA." : "DR."} ${appointment.medico}`,
      procedimento: appointment.procedimento,
      sala: appointment.numSala.toString(),
      corLinha: appointment.corLinha,
      andar: appointment.andar,
      atendimentoGeradoPor: `Recepcionado por ${getAttendanceUserName().toUpperCase()} em ${formatPrintDateTime(new Date())}`,
    };

    await this.httpClient.post<void>(this.endpoint, payload);
  }
}
