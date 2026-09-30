import { clearApiToken, getApiToken } from "./api-token-storage";
import { clearAttendanceUserName, getAttendanceUserName } from "./attendance-user-storage";

export const SESSION_EXPIRED_EVENT = "auto-totem-session-expired";
export const hasSession = () => Boolean(getApiToken().trim() && getAttendanceUserName());

export const expireSession = () => {
  localStorage.removeItem("auto_totem_login_credentials");
  clearApiToken();
  clearAttendanceUserName();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};
