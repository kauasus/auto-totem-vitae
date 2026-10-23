import CheckInPage from "./presentation/pages/CheckInPage";
import { useEffect, useState } from "react";
import LoginPage from "./presentation/pages/LoginPage";
import { hasSession, SESSION_EXPIRED_EVENT } from "./infra/auth/session";
import { activatePaymentService } from "./infra/payment/payment-service";

const App = () => {
  const [authenticated, setAuthenticated] = useState(hasSession);
  const [expired, setExpired] = useState(false);
  const [activationError, setActivationError] = useState("");

  const activate = () => {
    void activatePaymentService().catch((error: unknown) => {
      setActivationError(error instanceof Error ? error.message : "Não foi possível ativar a maquininha.");
    });
  };

  useEffect(() => { activate(); }, []);

  useEffect(() => {
    const onExpired = () => {
      setAuthenticated(false);
      setExpired(true);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  return <>
    {activationError && <div role="alert" className="fixed inset-x-0 top-0 z-[1200] flex items-center justify-center gap-4 bg-red-100 p-4 text-red-800">
      <span>Ativação da maquininha: {activationError}</span>
      <button className="shrink-0 rounded-lg border border-red-800 px-4 py-2 font-bold" onClick={() => { setActivationError(""); activate(); }}>Tentar ativar novamente</button>
    </div>}
    {authenticated ? <CheckInPage /> : (
    <LoginPage expired={expired} onLogin={() => {
      setExpired(false);
      setAuthenticated(true);
    }} />
  )}
  </>;
};

export default App;
