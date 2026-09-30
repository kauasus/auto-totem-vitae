import { useState, type FormEvent } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import VitaeLogo from "../../components/VitaeLogo";
import { env } from "../../main/config/env";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { setApiToken } from "../../infra/auth/api-token-storage";
import { setAttendanceUserName } from "../../infra/auth/attendance-user-storage";

const loginClient = createFetchHttpClient({ getAuthToken: () => "" });

export default function LoginPage({ expired, onLogin }: {
  expired: boolean;
  onLogin: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    const formData = new FormData(event.currentTarget);
    const nomUsuario = String(formData.get("username") ?? "").trim();
    const senhaWeb = String(formData.get("password") ?? "");
    if (!nomUsuario || !senhaWeb) {
      setError("Informe o usuário e a senha.");
      return;
    }
    if (!env.apiBaseUrl) {
      setError("O endereço da API não está configurado.");
      return;
    }
    setLoading(true);
    try {
      const response = await loginClient.post<{ accessToken: string; nomUsuario: string }>(
        `${env.apiBaseUrl.replace(/\/$/, "")}/usuario/login`,
        { nomUsuario, senhaWeb },
      );
      if (typeof response?.accessToken !== "string" || !response.accessToken.trim() ||
          typeof response.nomUsuario !== "string" || !response.nomUsuario.trim()) {
        throw new Error("A API não retornou uma sessão válida. Tente novamente.");
      }
      setAttendanceUserName(response.nomUsuario);
      setApiToken(response.accessToken);
      onLogin();
    } catch (cause) {
      setError(cause instanceof TypeError
        ? "Não foi possível conectar à API. Verifique a conexão e tente novamente."
        : cause instanceof Error ? cause.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-red-50 via-white to-gray-50 flex items-center justify-center px-6 py-12">
      <section className="w-full max-w-lg rounded-3xl bg-white border border-gray-100 p-8 sm:p-12 shadow-xl">
        <VitaeLogo width="100%" height={120} />
        <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <LockKeyhole size={28} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-center text-3xl font-bold text-gray-900">Acesso ao totem</h1>
        <p className="mt-3 text-center text-gray-500">Entre para liberar o autoatendimento.</p>
        {expired && <p role="status" className="mt-6 rounded-xl bg-amber-50 p-4 text-amber-900">
          Sua sessão expirou ou foi invalidada. Clique em Logar para validar o acesso novamente.
        </p>}
        <form onSubmit={handleSubmit} method="post" autoComplete="on" className="mt-8 space-y-5" aria-busy={loading}>
          <div>
            <label htmlFor="login-user" className="mb-2 block font-semibold text-gray-700">Usuário</label>
            <input id="login-user" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false}
              required readOnly={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-4 text-xl outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60" />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block font-semibold text-gray-700">Senha</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password"
              required readOnly={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-4 text-xl outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60" />
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-700 px-6 py-4 text-xl font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 disabled:opacity-60">
            <LogIn size={24} aria-hidden="true" />
            {loading ? "Entrando…" : "Logar"}
          </button>
        </form>
      </section>
    </main>
  );
}
