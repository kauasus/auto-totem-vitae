import type { PatientDto } from "../../data/dtos/appointment-search-response.dto";
import { mapPatient } from "../../data/mappers/appointment-search-mapper";
import type { PatientData } from "../../domain/entities/check-in";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { formatApiDate, normalizeCpf } from "../../validation";
import { env } from "../config/env";

export const makeSearchDuplicatePatients = () => {
  const client = createFetchHttpClient();
  const endpoint = `${env.apiBaseUrl.replace(/\/$/, "")}/paciente/buscar`;

  return async (patient: PatientData): Promise<PatientData[]> => {
    const date = patient.dataNascimento?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!date) return [];

    const cpf = normalizeCpf(patient.cpf);
    const query = new URLSearchParams({
      codCpf: cpf,
      datNascimento: `${date[3]}-${date[2]}-${date[1]}`,
    });
    const records = await client.get<PatientDto[]>(`${endpoint}?${query}`);
    return (records ?? [])
      .filter((record) =>
        typeof record.codPaciente === "number" &&
        Number.isSafeInteger(record.codPaciente) &&
        record.codPaciente > 0 &&
        record.nomPaciente?.trim() &&
        normalizeCpf(record.codCpf ?? "") === cpf &&
        formatApiDate(record.datNascimento ?? "") === patient.dataNascimento,
      )
      .map((record) => {
        const municipality = patient.address?.codMunicipio === record.codMunicipio
          ? patient.address?.cidade
          : undefined;

        return mapPatient({
          Paciente: record,
          dscMunicipio: municipality,
        }, patient.cpf);
      });
  };
};
