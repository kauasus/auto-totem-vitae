import { RemoteCreatePatient } from "../../data/usecases/remote-create-patient";
import { getApiToken } from "../../infra/auth/api-token-storage";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { env } from "../config/env";

const CREATE_PATIENT_PATH = "/paciente";

export const makeCreatePatient = () => {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, "");

  return new RemoteCreatePatient(
    createFetchHttpClient({ getAuthToken: getApiToken }),
    `${baseUrl}${CREATE_PATIENT_PATH}`,
  );
};
