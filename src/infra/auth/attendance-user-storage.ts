const ATTENDANCE_USER_STORAGE_KEY = "auto_totem_attendance_nom_usuario";

export const getAttendanceUserName = () => {
  const storedValue = localStorage.getItem(ATTENDANCE_USER_STORAGE_KEY)?.trim();

  if (storedValue) {
    return storedValue;
  }

  return "";
};

export const setAttendanceUserName = (userName: string) => {
  const normalized = userName.trim();

  localStorage.setItem(
    ATTENDANCE_USER_STORAGE_KEY,
    normalized,
  );
};

export const clearAttendanceUserName = () => {
  localStorage.removeItem(ATTENDANCE_USER_STORAGE_KEY);
};
