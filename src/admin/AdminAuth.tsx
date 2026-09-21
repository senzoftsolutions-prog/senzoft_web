import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser, signIn, signOut, type CurrentUser } from "../services/api/auth";
import { tokenStore } from "../services/api/client";

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const adminRoles = new Set(["RECRUITER", "HIRING_MANAGER", "INTERVIEWER", "HR", "ADMIN", "SUPER_ADMIN"]);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function restore() {
      if (!tokenStore.access()) {
        setLoading(false);
        return;
      }
      try {
        const response = await getCurrentUser();
        if (!adminRoles.has(response.data.role)) throw new Error("This account cannot access SENZOFT Admin.");
        if (active) setUser(response.data);
      } catch {
        signOut();
      } finally {
        if (active) setLoading(false);
      }
    }
    void restore();
    return () => { active = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (username, password) => {
      await signIn(username, password);
      try {
        const response = await getCurrentUser();
        if (!adminRoles.has(response.data.role)) throw new Error("This account does not have admin-panel access.");
        setUser(response.data);
      } catch (error) {
        signOut();
        throw error;
      }
    },
    logout: () => { signOut(); setUser(null); },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return value;
}
