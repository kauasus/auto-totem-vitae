import type { SearchPatientByCpfUseCase } from "../../domain/usecases/search-patient-by-cpf";
import type { SearchPatientResult } from "../../domain/entities/check-in";
import type { AppointmentSearchResponseDto } from "../dtos/appointment-search-response.dto";
import { mapAppointmentSearchResponse } from "../mappers/appointment-search-mapper";
import { isValidCpf, normalizeCpf } from "../../validation";
import type { HttpClient } from "../../infra/http/fetch-http-client";

export class RemoteSearchPatientByCpf implements SearchPatientByCpfUseCase {
  private readonly httpClient: HttpClient;
  private readonly endpoint: string;

  constructor(httpClient: HttpClient, endpoint: string) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async execute(cpfInput: string): Promise<SearchPatientResult> {
    const cpf = normalizeCpf(cpfInput);

    if (!isValidCpf(cpf)) {
      return {
        found: false,
        message: "Digite um CPF válido com 11 dígitos.",
      };
    }

    if (!this.endpoint.trim()) {
      return {
        found: false,
        message: "Defina a URL da API em `VITE_API_BASE_URL`.",
      };
    }

    try {
      const response = await this.httpClient.post<AppointmentSearchResponseDto>(
        this.endpoint,
        { cpf },
      );

      if (!response) {
        return {
          found: false,
          message: "A API não retornou dados para esse CPF.",
        };
      }

      return mapAppointmentSearchResponse(response, cpf);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível consultar a API no momento.";

      return {
        found: false,
        message,
      };
    }
  }
}
