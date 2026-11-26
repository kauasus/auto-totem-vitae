import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { env } from "../../main/config/env";

export type Municipality = {
  codMunicipio: number;
  dscMunicipio: string;
  dscDistrito?: string | null;
  codUF: string | number;
  codIBGEMunicipio?: string | number | null;
};

const states: Record<string, string> = {
  11: "RO", 12: "AC", 13: "AM", 14: "RR", 15: "PA", 16: "AP", 17: "TO",
  21: "MA", 22: "PI", 23: "CE", 24: "RN", 25: "PB", 26: "PE", 27: "AL", 28: "SE", 29: "BA",
  31: "MG", 32: "ES", 33: "RJ", 35: "SP", 41: "PR", 42: "SC", 43: "RS",
  50: "MS", 51: "MT", 52: "GO", 53: "DF",
};

export const normalizeMunicipalityName = (value: string) =>
  value.trim().normalize("NFD").replace(/\p{M}/gu, "").toUpperCase();

export function municipalityState(municipality: Municipality) {
  const code = String(municipality.codUF ?? "").trim().toUpperCase();
  return states[code] ?? (/^[A-Z]{2}$/.test(code) ? code : "");
}

export function findCepMunicipality(
  municipalities: Municipality[],
  cep: { ibge?: string; localidade?: string; uf?: string },
) {
  const byIbge = cep.ibge ? municipalities.filter((municipality) => {
    const state = String(municipality.codUF).trim();
    const code = String(municipality.codIBGEMunicipio ?? "").trim();
    const ibge = /^\d{2}$/.test(state) && /^\d{1,5}$/.test(code)
      ? state + code.padStart(5, "0")
      : code;
    return ibge === cep.ibge;
  }) : [];
  const matches = byIbge.length ? byIbge : municipalities.filter((municipality) =>
    normalizeMunicipalityName(municipality.dscMunicipio) === normalizeMunicipalityName(cep.localidade ?? "") &&
    municipalityState(municipality) === cep.uf,
  );
  if (matches.length === 1) return matches[0];

  const headquarters = matches.filter((municipality) =>
    normalizeMunicipalityName(municipality.dscDistrito ?? "") === normalizeMunicipalityName(municipality.dscMunicipio),
  );
  return headquarters.length === 1 ? headquarters[0] : undefined;
}

export async function listMunicipalities(): Promise<Municipality[]> {
  const url = `${env.apiBaseUrl.replace(/\/$/, "")}/municipio/listar`;
  const municipalities = await createFetchHttpClient().get<Municipality[]>(url);
  return (municipalities ?? []).filter((item) =>
    Number.isSafeInteger(item.codMunicipio) && item.codMunicipio > 0 &&
    item.dscMunicipio?.trim() && municipalityState(item),
  );
}
