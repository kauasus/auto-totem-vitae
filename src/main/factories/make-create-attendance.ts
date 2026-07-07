import { RemoteCreateAttendance } from "../../data/usecases/remote-create-attendance";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { env } from "../config/env";

const CREATE_ATTENDANCE_PATH = "/atendimento/cria-atendimento";

export const makeCreateAttendance = () => {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, "");

  return new RemoteCreateAttendance(
    createFetchHttpClient(),
    env.createAttendanceApiUrl || `${baseUrl}${CREATE_ATTENDANCE_PATH}`,
  );
};
