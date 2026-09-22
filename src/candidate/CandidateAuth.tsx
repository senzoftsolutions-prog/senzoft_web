import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, requestLoginCode, signOut, verifyLoginCode, type AuthChallenge, type CurrentUser } from "../services/api/auth";
import { tokenStore } from "../services/api/client";

type CandidateAuthValue = { user: CurrentUser | null; loading: boolean; login: (email: string) => Promise<AuthChallenge>; verify: (challengeId: string, code: string) => Promise<void>; logout: () => void; restore: () => Promise<void> };
const CandidateAuthContext = createContext<CandidateAuthValue | null>(null);

export function CandidateAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const restore = async () => {
    if (!tokenStore.access() && !tokenStore.refresh()) { setUser(null); setLoading(false); return; }
    try { const response = await getCurrentUser(); setUser(response.data.role === "CANDIDATE" ? response.data : null); }
    catch { signOut(); setUser(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { void restore(); }, []);
  const login = (email: string) => requestLoginCode(email, "candidate");
  const verify = async (challengeId: string, code: string) => { await verifyLoginCode(challengeId, code); const response = await getCurrentUser(); if (response.data.role !== "CANDIDATE") { signOut(); throw new Error("This account does not have candidate portal access."); } setUser(response.data); };
  const logout = () => { signOut(); setUser(null); };
  return <CandidateAuthContext.Provider value={{ user, loading, login, verify, logout, restore }}>{children}</CandidateAuthContext.Provider>;
}

export function useCandidateAuth() {
  const value = useContext(CandidateAuthContext);
  if (!value) throw new Error("useCandidateAuth must be used inside CandidateAuthProvider");
  return value;
}
