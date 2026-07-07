const ATTENDANCE_USER_STORAGE_KEY = "auto_totem_attendance_nom_usuario";
const DEFAULT_ATTENDANCE_USER = "Totem 1";

export const getAttendanceUserName = () => {
  const storedValue = localStorage.getItem(ATTENDANCE_USER_STORAGE_KEY)?.trim();

  if (storedValue) {
    return storedValue;
  }

  localStorage.setItem(ATTENDANCE_USER_STORAGE_KEY, DEFAULT_ATTENDANCE_USER);
  return DEFAULT_ATTENDANCE_USER;
};

export const setAttendanceUserName = (userName: string) => {
  const normalized = userName.trim();

  localStorage.setItem(
    ATTENDANCE_USER_STORAGE_KEY,
    normalized || DEFAULT_ATTENDANCE_USER,
  );
};

export const clearAttendanceUserName = () => {
  localStorage.removeItem(ATTENDANCE_USER_STORAGE_KEY);
};
