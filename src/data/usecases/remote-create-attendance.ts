import type { Appointment, PatientData } from "../../domain/entities/check-in";
import type { PaymentMethod } from "../../domain/entities/check-in";
import type { HttpClient } from "../../infra/http/fetch-http-client";
import { env } from "../../main/config/env";
import { getAttendanceUserName } from "../../infra/auth/attendance-user-storage";

export type CreateAttendanceRequest = {
  codEmpresa: number;
  codAgenda: number;
  numSala: number;
  codMedico: number;
  codEspecialidade: number;
  codProcedimento: number;
  codConvenio: number;
  datAtendimento: Date;
  horInicio: string;
  codPaciente: number;
  indRetorno: boolean;
  nomUsuario: string;
  codTipoGuia: number;
  dscEspecie: string;
  nomPaciente: string;
  nomProcedimento: string;
  valProcedimento: number;
};

export type CreateAttendanceResponse =
  | number
  | {
      codAtendimento?: number;
      CodAtendimento?: number;
      cod_atendimento?: number;
    };

export interface CreateAttendanceUseCase {
  execute(input: {
    patient: PatientData;
    appointment: Appointment;
    paymentMethod: PaymentMethod;
  }): Promise<number>;
}

const requireNumber = (
  value: number | undefined,
  fieldName: string,
): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Campo obrigatório ausente para gerar atendimento: ${fieldName}.`);
  }

  return value;
};

const requireString = (
  value: string | undefined,
  fieldName: string,
): string => {
  const normalized = value?.trim() ?? "";

  if (!normalized) {
    throw new Error(`Campo obrigatório ausente para gerar atendimento: ${fieldName}.`);
  }

  return normalized;
};

const pickResponseCodAtendimento = (response: CreateAttendanceResponse) => {
  if (typeof response === "number") {
    return response;
  }

  return response.codAtendimento ?? response.CodAtendimento ?? response.cod_atendimento;
};

export class RemoteCreateAttendance implements CreateAttendanceUseCase {
  private readonly httpClient: HttpClient;
  private readonly endpoint: string;

  constructor(httpClient: HttpClient, endpoint: string) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async execute(input: {
    patient: PatientData;
    appointment: Appointment;
    paymentMethod: PaymentMethod;
  }): Promise<number> {
    const { patient, appointment, paymentMethod } = input;
    const resolvedEndpoint = this.endpoint.trim();

    if (!resolvedEndpoint.trim()) {
      throw new Error("Defina a URL da API de atendimento em `VITE_CREATE_ATENDIMENTO_URL`.");
    }

    const payload: CreateAttendanceRequest = {
      codEmpresa: requireNumber(1, "codEmpresa"),
      codAgenda: requireNumber(appointment.codAgenda, "codAgenda"),
      numSala: requireNumber(appointment.numSala, "numSala"),
      codMedico: requireNumber(appointment.codMedico, "codMedico"),
      codEspecialidade: requireNumber(
        appointment.codEspecialidade,
        "codEspecialidade",
      ),
      codProcedimento: requireNumber(
        appointment.codProcedimento,
        "codProcedimento",
      ),
      codConvenio: requireNumber(
        appointment.codConvenio,
        "codConvenio",
      ),
      datAtendimento: new Date(),
      horInicio: requireString(
        appointment.horInicio ?? appointment.horario,
        "horInicio",
      ),
      codPaciente: requireNumber(
        appointment.codPaciente ?? patient.codPaciente,
        "codPaciente",
      ),
      indRetorno: Boolean(appointment.indRetorno),
      nomUsuario: requireString(getAttendanceUserName(), "nomUsuario"),
      codTipoGuia: appointment.codTipoGuia ?? env.attendanceCodTipoGuia,
      dscEspecie: requireString(paymentMethod, "dscEspecie"),
      nomPaciente: requireString(
        appointment.nomPaciente ?? patient.nomeCompleto,
        "nomPaciente",
      ),
      nomProcedimento: requireString(
        appointment.nomProcedimento ?? appointment.procedimento,
        "nomProcedimento",
      ),
      valProcedimento: requireNumber(
        appointment.valProcedimento,
        "valProcedimento",
      ),
    };

    const response = await this.httpClient.post<CreateAttendanceResponse>(
      resolvedEndpoint,
      payload,
    );

    const codAtendimento = pickResponseCodAtendimento(response);

    if (typeof codAtendimento !== "number" || Number.isNaN(codAtendimento)) {
      throw new Error("A API de atendimento não retornou `codAtendimento`.");
    }

    return codAtendimento;
  }
}
