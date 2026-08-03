import type { Appointment, PatientData } from "../../domain/entities/check-in";
import type { HttpClient } from "../../infra/http/fetch-http-client";

export type IssueServiceInvoiceRequest = {
  paciente: {
    cpf: string;
    nome: string;
    telefone: string;
    email: string;
    endereco: {
      logradouro: string;
      tipo_logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      municipio: string;
      uf: string;
      cep: string;
    };
  };
  servico: {
    valor_servicos: number;
    ref: string;
  };
};

export interface IssueServiceInvoiceUseCase {
  execute(input: {
    patient: PatientData;
    appointment: Appointment;
  }): Promise<void>;
}

const onlyDigits = (value: string | undefined) =>
  (value ?? "").replace(/\D/g, "");

const requireNumber = (
  value: number | undefined,
  fieldName: string,
): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(
      `Campo obrigatório ausente para emitir a nota fiscal: ${fieldName}.`,
    );
  }

  return value;
};

export class RemoteIssueServiceInvoice
  implements IssueServiceInvoiceUseCase
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
    const address = patient.address;

    if (!this.endpoint.trim()) {
      throw new Error("Defina a URL da API de nota fiscal.");
    }

    const codAtendimento = requireNumber(
      appointment.codAtendimento,
      "codAtendimento",
    );
    const valorServicos = requireNumber(
      appointment.valProcedimento ?? appointment.valor,
      "valor_servicos",
    );

    const payload: IssueServiceInvoiceRequest = {
      paciente: {
        cpf: onlyDigits(patient.cpf),
        nome: patient.nomeCompleto.trim(),
        telefone: onlyDigits(patient.telefone || patient.telefone2),
        email: patient.email?.trim() ?? "",
        endereco: {
          logradouro: address?.logradouro.trim() ?? "",
          tipo_logradouro: "",
          numero: address?.numero.trim() ?? "",
          complemento: address?.complemento?.trim() ?? "",
          bairro: address?.bairro.trim() ?? "",
          municipio: address?.cidade.trim() ?? "",
          uf: address?.uf.trim().toUpperCase() ?? "",
          cep: onlyDigits(address?.cep),
        },
      },
      servico: {
        valor_servicos: valorServicos,
        ref: String(codAtendimento),
      },
    };

    await this.httpClient.post<void>(this.endpoint, payload);
  }
}
