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
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ email, password }) });
      const raw = await response.text();
      let result: { error?: string };
      try { result = JSON.parse(raw) as { error?: string }; } catch { throw new Error(`O servidor não retornou uma resposta válida (${response.status}).`); }
      if (!response.ok) throw new Error(result.error ?? "Não foi possível entrar.");
      window.location.replace("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível entrar.");
      setLoading(false);
    }
  }

  return (
    <main className="cms-login-page">
      <style>{`
        .cms-login-page { min-height:100vh; padding:0 !important; display:grid; grid-template-columns:minmax(0,58%) minmax(420px,42%); background:#f7f9fc !important; }
        .cms-login-brand { min-height:100vh; width:auto !important; max-width:none !important; margin:0 !important; padding:clamp(42px,7vw,92px) clamp(34px,7vw,110px) 56px !important; display:flex !important; flex-direction:column !important; align-items:flex-start !important; justify-content:space-between !important; gap:30px !important; background:#071d4f !important; color:#fff !important; }
        .cms-login-brand > a { display:block; width:min(590px,100%); }
        .cms-login-brand img { display:block; width:100% !important; max-width:590px !important; height:auto !important; margin:0 !important; filter:drop-shadow(0 18px 28px rgba(0,0,0,.24)); }
        .cms-login-brand-copy { display:grid; gap:10px; color:#fff; text-transform:uppercase; letter-spacing:.14em; }
        .cms-login-brand-copy strong { color:#f0c64f; font-size:11px; font-weight:900; }
        .cms-login-brand-copy span { color:#9fb4d4; font-size:9px; font-weight:800; }
        .cms-login-card { width:auto !important; min-height:100vh; margin:0 !important; padding:clamp(42px,7vw,92px) clamp(32px,6vw,82px) !important; display:flex; flex-direction:column; justify-content:center; background:#f7f9fc !important; box-shadow:none !important; }
        .cms-login-card .eyebrow { margin-bottom:20px; }
        @media (max-width:900px) { .cms-login-page { grid-template-columns:1fr; } .cms-login-brand { min-height:42vh; padding:38px 28px 34px !important; } .cms-login-brand > a { width:min(520px,100%); } .cms-login-card { min-height:auto; padding:46px 28px 58px !important; } }
      `}</style>
      <div className="cms-login-brand">
        <Link href="/" aria-label="Voltar para a campanha Claudia Benassuly">
          <img src="/campaign/logo-slogan-dark.png" alt="Claudia Benassuly — Deputada Federal — Por ela. Por nós. Por todas." />
        </Link>
        <div className="cms-login-brand-copy"><strong>Central de conteúdo da campanha</strong><span>Gestão editorial · agenda · notícias · santinho digital</span></div>
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
