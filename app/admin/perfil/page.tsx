"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Admin = { id: string; email: string; display_name: string; created_at: string };

type CmsResponse = { email?: string; admins?: Admin[]; error?: string };

export default function AdminProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("Administrador");
  const [newPassword, setNewPassword] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [notice, setNotice] = useState("Carregando perfil...");
  const [saving, setSaving] = useState(false);

  async function load() {
    const response = await fetch("/api/cms", { cache: "no-store" });
    const data = (await response.json()) as CmsResponse;
    if (!response.ok || !data.email) {
      window.location.href = "/admin/login";
      return;
    }
    setEmail(data.email);
    setAdmins(data.admins ?? []);
    setNotice("Perfil carregado.");
  }

  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, []);

  async function call(action: string, body: Record<string, unknown>) {
    setSaving(true);
    try {
      const response = await fetch("/api/cms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ...body }) });
      const data = (await response.json()) as CmsResponse;
      if (!response.ok) throw new Error(data.error ?? "Não foi possível salvar.");
      if (data.email) setEmail(data.email);
      if (data.admins) setAdmins(data.admins);
      setNotice("Alteração salva com sucesso.");
      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar.");
      return false;
    } finally { setSaving(false); }
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    const body: Record<string, unknown> = { email, displayName: name };
    if (newPassword) body.password = newPassword;
    const ok = await call("profile", body);
    if (ok) setNewPassword("");
  }

  async function addAdmin(event: FormEvent) {
    event.preventDefault();
    const ok = await call("admin_create", { email: newAdminEmail, displayName: newAdminName || "Administrador", password: newAdminPassword });
    if (ok) { setNewAdminEmail(""); setNewAdminName(""); setNewAdminPassword(""); }
  }

  async function removeAdmin(id: string, adminEmail: string) {
    if (!window.confirm(`Excluir o acesso de ${adminEmail}?`)) return;
    await call("admin_delete", { id });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f9fc", padding: "42px 6vw", color: "#071d4f" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Link href="/admin" style={{ color: "#071d4f", fontWeight: 800, textDecoration: "none" }}>← Voltar ao painel</Link>
        <div style={{ marginTop: 28, marginBottom: 30 }}><p style={{ letterSpacing: ".16em", fontSize: 11, fontWeight: 900 }}>CONFIGURAÇÕES</p><h1 style={{ fontSize: "clamp(34px,5vw,62px)", margin: "8px 0" }}>Meu perfil.</h1><p style={{ color: "#61708b" }}>Atualize seus dados de acesso e gerencie os administradores do CMS.</p></div>
        <p style={{ padding: "12px 16px", background: "#fff", border: "1px solid #dbe3ef" }}>{saving ? "Salvando..." : notice}</p>

        <section style={{ background: "#fff", border: "1px solid #dbe3ef", padding: 28, marginTop: 22 }}>
          <h2>Seus dados de acesso</h2>
          <form onSubmit={saveProfile} style={{ display: "grid", gap: 16, maxWidth: 650 }}>
            <label>Nome<input value={name} onChange={e => setName(e.target.value)} required style={inputStyle} /></label>
            <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} /></label>
            <label>Nova senha <small>(deixe em branco para manter)</small><input type="password" minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password" style={inputStyle} /></label>
            <button disabled={saving} style={buttonStyle}>{saving ? "Salvando..." : "Salvar meu perfil"}</button>
          </form>
        </section>

        <section style={{ background: "#fff", border: "1px solid #dbe3ef", padding: 28, marginTop: 22 }}>
          <h2>Outros administradores</h2>
          <p style={{ color: "#61708b" }}>Cadastre pessoas autorizadas a entrar no painel.</p>
          <form onSubmit={addAdmin} style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr)) auto", gap: 12, alignItems: "end", margin: "22px 0" }}>
            <label>Nome<input value={newAdminName} onChange={e => setNewAdminName(e.target.value)} required style={inputStyle} /></label>
            <label>E-mail<input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} required style={inputStyle} /></label>
            <label>Senha inicial<input type="password" minLength={8} value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} required style={inputStyle} /></label>
            <button disabled={saving} style={buttonStyle}>Adicionar</button>
          </form>
          <div style={{ display: "grid", gap: 10 }}>
            {admins.map(admin => <div key={admin.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, borderTop: "1px solid #e7ecf3", padding: "14px 0" }}><div><strong>{admin.display_name}</strong><div style={{ color: "#61708b", fontSize: 14 }}>{admin.email}</div></div><button onClick={() => removeAdmin(admin.id, admin.email)} style={{ ...buttonStyle, background: "#fff", color: "#8b2635", border: "1px solid #d9aab1" }}>Remover</button></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}

const inputStyle = { display: "block", width: "100%", marginTop: 7, padding: "13px 14px", border: "1px solid #cbd6e5", background: "#f8fafc", boxSizing: "border-box" as const };
const buttonStyle = { padding: "13px 18px", border: "0", background: "#071d4f", color: "#fff", fontWeight: 900, cursor: "pointer" };
