import { RemoteSearchPatientByCpf } from "../../data/usecases/remote-search-patient-by-cpf";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { getApiToken } from "../../infra/auth/api-token-storage";
import { expireSession } from "../../infra/auth/session";
import { env } from "../config/env";

const SEARCH_PATIENT_BY_CPF_PATH = "/agenda-medico/listar-por-cpf";

export const makeSearchPatientByCpf = () => {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, "");

  return new RemoteSearchPatientByCpf(
    createFetchHttpClient({ getAuthToken: getApiToken, onUnauthorized: expireSession }),
    `${baseUrl}${SEARCH_PATIENT_BY_CPF_PATH}`,
  );
};
