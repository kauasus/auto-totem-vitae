import type { HttpClient } from "../../infra/http/fetch-http-client";
import type {
  Appointment,
  PatientData,
} from "../../domain/entities/check-in";
import { isValidCep, isValidCpf, normalizeCpf, onlyDigits } from "../../validation";
import { getAttendanceUserName } from "../../infra/auth/attendance-user-storage";

export type CreatePatientRequest = {
  nomPaciente: string;
  codCpf: string;
  nomUsuario: string;
  datNascimento: Date;
  numTelefone: string;
  codConvenio: number;
  dscSexo: string;
  abrLogradouro?: string;
  nomLogradouro: string;
  numPredio: string;
  dscCmplmntEndrc: string;
  nomBairro: string;
  codMunicipio: number;
  dscMunicipio?: string;
  sigUnidadeFederacao: string;
  codEndrcmntPstl: string;
};

export type CreatePatientResponse = {
  codPaciente: number;
  [key: string]: unknown;
};

export interface CreatePatientUseCase {
  execute(input: {
    patient: PatientData;
    appointment: Appointment;
  }): Promise<number>;
}

const DUPLICATE_PATIENT_API_MESSAGE =
  "Já existe um cadastro de paciente para este CPF e data de nascimento.";

export const DUPLICATE_PATIENT_MESSAGE =
  "Já existe um cadastro para este CPF, procure o setor de Pós Atendimento";

const requireString = (value: string | undefined, fieldName: string) => {
  const normalized = value?.trim() ?? "";
  if (!normalized) {
    throw new Error(`Campo obrigatório ausente para cadastrar paciente: ${fieldName}.`);
  }
  return normalized;
};

const requireNumber = (value: number | undefined, fieldName: string) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Campo obrigatório ausente para cadastrar paciente: ${fieldName}.`);
  }
  return value;
};

const parseBirthDate = (value?: string) => {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    throw new Error("Data de nascimento inválida para cadastrar paciente.");
  }
  return new Date(`${match[3]}-${match[2]}-${match[1]}T00:00:00`);
};

export class RemoteCreatePatient implements CreatePatientUseCase {
  private readonly httpClient: HttpClient;
  private readonly endpoint: string;

  constructor(
    httpClient: HttpClient,
    endpoint: string,
  ) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async execute(input: {
    patient: PatientData;
    appointment: Appointment;
  }): Promise<number> {
    const endpoint = this.endpoint.trim();

    if (!endpoint) {
      throw new Error("Defina a URL da API de cadastro de paciente.");
    }

    const { patient, appointment } = input;
    const address = patient.address;
    const cpf = normalizeCpf(patient.cpf);
    const cep = onlyDigits(address?.cep ?? "");
    const uf = requireString(address?.uf, "sigUnidadeFederacao").toUpperCase();

    if (!isValidCpf(cpf)) {
      throw new Error("CPF inválido para cadastrar paciente.");
    }

    if (!isValidCep(cep)) {
      throw new Error("CEP inválido para cadastrar paciente.");
    }

    if (uf.length !== 2) {
      throw new Error("UF inválida para cadastrar paciente.");
    }

    const payload: CreatePatientRequest = {
      nomPaciente: requireString(patient.nomeCompleto, "nomPaciente"),
      codCpf: cpf,
      nomUsuario: requireString(
        getAttendanceUserName().toUpperCase(),
        "nomUsuario",
      ),
      datNascimento: parseBirthDate(patient.dataNascimento),
      numTelefone: requireString(
        onlyDigits(patient.telefone || patient.telefone2 || ""),
        "numTelefone",
      ),
      codConvenio: requireNumber(appointment.codConvenio, "codConvenio"),
      dscSexo: requireString(patient.sexo, "dscSexo"),
      nomLogradouro: requireString(address?.logradouro, "nomLogradouro"),
      numPredio: requireString(address?.numero, "numPredio"),
      dscCmplmntEndrc: address?.complemento?.trim() ?? "",
      nomBairro: requireString(address?.bairro, "nomBairro"),
      codMunicipio: requireNumber(address?.codMunicipio, "codMunicipio"),
      dscMunicipio: requireString(address?.cidade, "dscMunicipio"),
      sigUnidadeFederacao: uf,
      codEndrcmntPstl: cep,
    };

    try {
      const response = await this.httpClient.post<CreatePatientResponse>(
        endpoint,
        payload,
      );

      return requireNumber(response?.codPaciente, "codPaciente retornado");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes(DUPLICATE_PATIENT_API_MESSAGE)
      ) {
        throw new Error(DUPLICATE_PATIENT_MESSAGE);
      }

      throw error;
    }
  }
}
