import CheckInPage from "./presentation/pages/CheckInPage";
import { useEffect, useState } from "react";
import LoginPage from "./presentation/pages/LoginPage";
import { hasSession, SESSION_EXPIRED_EVENT } from "./infra/auth/session";

const App = () => {
  const [authenticated, setAuthenticated] = useState(hasSession);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const onExpired = () => {
      setAuthenticated(false);
      setExpired(true);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  return authenticated ? <CheckInPage /> : (
    <LoginPage expired={expired} onLogin={() => {
      setExpired(false);
      setAuthenticated(true);
    }} />
  );
};

export default App;
