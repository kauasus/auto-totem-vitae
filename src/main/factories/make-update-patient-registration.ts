import { RemoteUpdatePatientRegistration } from "../../data/usecases/remote-update-patient-registration";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { env } from "../config/env";

const UPDATE_PATIENT_REGISTRATION_PATH = "/paciente/atualizar-cadastro";

export const makeUpdatePatientRegistration = () => {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, "");

  return new RemoteUpdatePatientRegistration(
    createFetchHttpClient(),
    env.updatePatientRegistrationApiUrl ||
      `${baseUrl}${UPDATE_PATIENT_REGISTRATION_PATH}`,
  );
};
