import type {
  AddressData,
  Appointment,
  PatientData,
} from "../../domain/entities/check-in";
import type { HttpClient } from "../../infra/http/fetch-http-client";
import { isValidCep, onlyDigits } from "../../utils/validation";

export type UpdatePatientRegistrationRequest = {
  codPaciente: number;
  datNascimento: string;
  numTelefone: string;
  nomLogradouro: string;
  numPredio: string;
  dscCmplmntEndrc: string;
  nomBairro: string;
  dscMunicipio: string;
  sigUnidadeFederacao: string;
  codEndrcmntPstl: string;
};

export interface UpdatePatientRegistrationUseCase {
  execute(input: {
    patient: PatientData;
    appointment: Appointment;
  }): Promise<void>;
}

const requireNumber = (
  value: number | undefined,
  fieldName: string,
): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Campo obrigatorio ausente para atualizar cadastro: ${fieldName}.`);
  }

  return value;
};

const requireString = (value: string | undefined, fieldName: string) => {
  const normalized = value?.trim() ?? "";
  if (!normalized) {
    throw new Error(`Campo obrigatorio ausente para atualizar cadastro: ${fieldName}.`);
  }

  return normalized;
};

const normalizeAddress = (address?: AddressData): AddressData => ({
  cep: address?.cep ?? "",
  logradouro: address?.logradouro ?? "",
  numero: address?.numero ?? "",
  complemento: address?.complemento ?? "",
  bairro: address?.bairro ?? "",
  cidade: address?.cidade ?? "",
  uf: address?.uf ?? "",
});

const toApiDate = (value?: string) => {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value?.trim() ?? "";
};

export class RemoteUpdatePatientRegistration
  implements UpdatePatientRegistrationUseCase
{
  private readonly httpClient: HttpClient;
  private readonly endpoint: string;

  constructor(httpClient: HttpClient, endpoint: string) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async execute(input: {
    patient: PatientData;
    appointment: Appointment;
  }): Promise<void> {
    const { patient, appointment } = input;
    const resolvedEndpoint = this.endpoint.trim();

    if (!resolvedEndpoint) {
      throw new Error("Defina a URL da API de atualizacao de paciente.");
    }

    const address = normalizeAddress(patient.address);
    const cep = onlyDigits(address.cep);
    const uf = requireString(address.uf, "sigUnidadeFederacao").toUpperCase();

    if (!isValidCep(cep)) {
      throw new Error("CEP invalido para atualizar cadastro.");
    }

    if (uf.length !== 2) {
      throw new Error("UF invalida para atualizar cadastro.");
    }

    const payload: UpdatePatientRegistrationRequest = {
      codPaciente: requireNumber(
        patient.codPaciente ?? appointment.codPaciente,
        "codPaciente",
      ),
      datNascimento: toApiDate(patient.dataNascimento),
      numTelefone: onlyDigits(patient.telefone ?? patient.telefone2 ?? ""),
      nomLogradouro: requireString(address.logradouro, "nomLogradouro"),
      numPredio: requireString(address.numero, "numPredio"),
      dscCmplmntEndrc: (address.complemento ?? "").trim(),
      nomBairro: requireString(address.bairro, "nomBairro"),
      dscMunicipio: requireString(address.cidade, "dscMunicipio"),
      sigUnidadeFederacao: uf,
      codEndrcmntPstl: cep,
    };

    await this.httpClient.put<unknown>(resolvedEndpoint, payload);
  }
}
