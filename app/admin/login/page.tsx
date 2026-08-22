"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      const raw = await response.text();
      let result: { error?: string };
      try {
        result = JSON.parse(raw) as { error?: string };
      } catch {
        throw new Error(`O servidor não retornou uma resposta válida (${response.status}).`);
      }
      if (!response.ok) throw new Error(result.error ?? "Não foi possível entrar.");
      window.location.replace("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível entrar.");
      setLoading(false);
    }
  }

  return (
    <main className="cms-login-page">
      <div className="cms-login-brand">
        <Link href="/" aria-label="Voltar para a campanha Claudia Benassuly">
          <img src="/campaign/logo-slogan-dark.png" alt="Claudia Benassuly — Deputada Federal — Por ela. Por nós. Por todas." />
        </Link>
        <div className="cms-login-brand-copy">
          <strong>Central de conteúdo da campanha</strong>
          <span>Gestão editorial · agenda · notícias · santinho digital</span>
        </div>
      </div>

      <section className="cms-login-card">
        <p className="eyebrow">Área restrita</p>
        <h1>Entrar no <em>painel.</em></h1>
        <p>Gerencie o site, o santinho, a agenda e as notícias da campanha.</p>
        <form onSubmit={submit}>
          <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
          <label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error && <div className="cms-login-error" role="alert">{error}</div>}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar no painel"}</button>
        </form>
        <Link className="cms-login-back" href="/">Voltar para o site</Link>
      </section>
    </main>
  );
}
