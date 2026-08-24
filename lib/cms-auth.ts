const defaultAdminEmails = ["douglaskaua92@gmail.com"];

export function isCmsAdmin(email: string, configuredEmails?: string | null): boolean {
  const configured = configuredEmails
    ?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const allowed = configured?.length ? configured : defaultAdminEmails;
  return allowed.includes(email.trim().toLowerCase());
}
