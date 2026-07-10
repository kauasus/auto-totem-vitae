import { RemoteRunLog } from "../../data/usecases/remote-register-log";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { getApiToken } from "../../infra/auth/api-token-storage";
import { env } from "../config/env";

const REGISTER_LOG_PATH = "/log-programa/registrar";

export const makeRunLog = () => {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, "");

  return new RemoteRunLog(
    createFetchHttpClient({ getAuthToken: getApiToken }),
    `${baseUrl}${REGISTER_LOG_PATH}`,
  );
};
