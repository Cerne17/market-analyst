"use client";
import { useActionState } from "react";
import { GitBranch, Mail } from "lucide-react";
import {
  requestMagicLink,
  signInWithGitHub,
  type LoginState,
} from "@/app/login/actions";
import { SubmitButton } from "./submit-button";

export function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action] = useActionState<LoginState, FormData>(
    requestMagicLink,
    {
      status: "idle",
      message: "",
    },
  );
  return (
    <div className="login-forms">
      <form action={action} className="form-stack">
        <label htmlFor="login-email">E-mail do convite</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          required
          maxLength={254}
          disabled={!enabled}
        />
        <SubmitButton disabled={!enabled} pendingLabel="Solicitando acesso…">
          <Mail size={16} aria-hidden="true" /> Receber link de acesso
        </SubmitButton>
        {state.message && (
          <p
            className={state.status === "error" ? "form-error" : "form-message"}
            role={state.status === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {state.message}
          </p>
        )}
      </form>
      <div className="form-divider">
        <span />
        ou
        <span />
      </div>
      <form action={signInWithGitHub}>
        <SubmitButton
          disabled={!enabled}
          variant="outline"
          pendingLabel="Abrindo GitHub…"
        >
          <GitBranch size={16} aria-hidden="true" /> Continuar com GitHub
        </SubmitButton>
      </form>
      <p className="muted-caption">
        Use no GitHub o mesmo e-mail que recebeu o convite. Não há cadastro
        público.
      </p>
    </div>
  );
}
