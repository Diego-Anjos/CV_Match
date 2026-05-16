'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export interface IAAnalysisData {
  matchScore: number;
  feedbackGeral: string;
  habilidadesAderentes: string[];
  trilhaEstudos: { lacuna: string; acao: string; cursoRecomendado: string; plataforma: string }[];
}

export interface HistoryItem {
  id: string;
  date: string;
  jobTitle: string;
  companyName?: string;
  status: string;
  analysisData: IAAnalysisData;
}

export interface User {
  nome: string;
  email: string;
  telefone?: string;
  cidadeEstado?: string;
  linkedin?: string;
  portfolio?: string;
  plano: 'free' | 'pro';
  creditosUsados: number;
  creditosTotais: number;
  dataRenovacao: string;
  cicloFaturamento?: 'Mensal' | 'Anual';
  valorPlano?: string;
  metodoPagamento?: string;
}

interface StoredUserData {
  telefone?: string;
  cidadeEstado?: string;
  linkedin?: string;
  portfolio?: string;
  plano: 'free' | 'pro';
  creditosUsados: number;
  creditosTotais: number;
  dataRenovacao: string;
  cicloFaturamento?: 'Mensal' | 'Anual';
  valorPlano?: string;
  metodoPagamento?: string;
}

const DEFAULT_USER_DATA: StoredUserData = {
  plano: 'free',
  creditosUsados: 0,
  creditosTotais: 3,
  dataRenovacao: 'N/A',
};

function getUserDataKey(userId: string) {
  return `cvmatch:userdata:${userId}`;
}

function loadStoredUserData(userId: string): StoredUserData {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId));
    if (raw) return { ...DEFAULT_USER_DATA, ...JSON.parse(raw) };
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_USER_DATA };
}

function saveStoredUserData(userId: string, data: StoredUserData) {
  localStorage.setItem(getUserDataKey(userId), JSON.stringify(data));
}

function buildUser(supabaseUser: SupabaseUser, stored: StoredUserData): User {
  return {
    nome: (supabaseUser.user_metadata?.full_name as string) || supabaseUser.email || '',
    email: supabaseUser.email || '',
    ...stored,
  };
}

export interface ActivateSubscriptionParams {
  planType: 'monthly' | 'annual';
  paymentMethod: 'credit_card' | 'pix';
  cardLastFour?: string;
}

interface UserContextType {
  user: User | null;
  supabaseUserId: string | null;
  updateUser: (newData: Partial<User>) => void;
  addCreditUsage: () => void;
  refreshUsage: () => Promise<void>;
  isLoaded: boolean;
  isLoadingProfile: boolean;
  logout: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  activateSubscription: (params: ActivateSubscriptionParams) => Promise<void>;
  isPro: boolean;
  canGenerateCv: boolean;
  availableTemplates: string[];
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  selectedAnalysis: HistoryItem | null;
  setSelectedAnalysis: (item: HistoryItem | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Stable reference — createBrowserClient is a singleton internally, but the
  // ref prevents accidental recreation on re-renders that would break the
  // onAuthStateChange listener closure.
  const supabase = useRef(createClient()).current;
  const router = useRouter();

  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<HistoryItem | null>(null);

  // Load history from localStorage once the user is known
  const loadHistory = useCallback((userId: string) => {
    try {
      const saved = localStorage.getItem(`cvmatch:history:${userId}`);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Returns the start of the current calendar month as an ISO string for Supabase queries.
  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  };

  // Fetch profile data from Supabase and merge it into user state.
  // This is the authoritative source for display fields (name, phone, linkedin, etc.)
  // and prevents the race condition where localStorage is stale or empty after a fresh login.
  // Also fetches the real usage count for the current month from the analyses table.
  const fetchUserProfile = useCallback(async (sbUser: SupabaseUser) => {
    setIsLoadingProfile(true);
    try {
      const [profileResult, usageResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, phone, location, linkedin_url, portfolio_url')
          .eq('id', sbUser.id)
          .maybeSingle(),
        supabase
          .from('analyses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', sbUser.id)
          .gte('created_at', getStartOfMonth()),
      ]);

      const profile = profileResult.data;
      const usageCount = usageResult.count ?? null;

      const stored = loadStoredUserData(sbUser.id);

      // Sync localStorage with the authoritative Supabase count
      if (usageCount !== null) {
        saveStoredUserData(sbUser.id, { ...stored, creditosUsados: usageCount });
      }

      // Build the merged user: profile DB fields take priority over metadata fallbacks
      const mergedUser: User = {
        nome: (profile?.full_name as string) || (sbUser.user_metadata?.full_name as string) || sbUser.email || '',
        email: sbUser.email || '',
        telefone: (profile?.phone as string) || stored.telefone,
        cidadeEstado: (profile?.location as string) || stored.cidadeEstado,
        linkedin: (profile?.linkedin_url as string) || stored.linkedin,
        portfolio: (profile?.portfolio_url as string) || stored.portfolio,
        plano: stored.plano,
        creditosUsados: usageCount !== null ? usageCount : stored.creditosUsados,
        creditosTotais: stored.creditosTotais,
        dataRenovacao: stored.dataRenovacao,
        cicloFaturamento: stored.cicloFaturamento,
        valorPlano: stored.valorPlano,
        metodoPagamento: stored.metodoPagamento,
      };

      setUser(mergedUser);
    } catch {
      // Non-blocking: fall back to whatever buildUser already set
    } finally {
      setIsLoadingProfile(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist history to localStorage
  useEffect(() => {
    if (!supabaseUser || !isLoaded) return;
    localStorage.setItem(`cvmatch:history:${supabaseUser.id}`, JSON.stringify(history));
  }, [history, supabaseUser, isLoaded]);

  // Sync subscription status from Supabase and update local state accordingly
  const syncSubscriptionFromSupabase = useCallback(
    async (sbUser: SupabaseUser) => {
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('status, plan_type, current_period_end')
          .eq('id', sbUser.id)
          .maybeSingle();

        const stored = loadStoredUserData(sbUser.id);

        if (
          data?.status === 'active' &&
          new Date(data.current_period_end) > new Date()
        ) {
          if (stored.plano !== 'pro') {
            const periodEnd = new Date(data.current_period_end);
            const renovacao = periodEnd.toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const updated: StoredUserData = {
              ...stored,
              plano: 'pro',
              creditosTotais: 999999,
              dataRenovacao: renovacao,
              cicloFaturamento: data.plan_type === 'annual' ? 'Anual' : 'Mensal',
            };
            saveStoredUserData(sbUser.id, updated);
            setUser(buildUser(sbUser, updated));
          }
        } else if (data && stored.plano === 'pro') {
          // Subscription expired or canceled — downgrade locally
          const updated: StoredUserData = {
            ...stored,
            plano: 'free',
            creditosTotais: 3,
            cicloFaturamento: undefined,
            valorPlano: undefined,
            metodoPagamento: undefined,
            dataRenovacao: 'N/A',
          };
          saveStoredUserData(sbUser.id, updated);
          setUser(buildUser(sbUser, updated));
        }
      } catch {
        // Non-blocking: Supabase may not have the table yet
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Bootstrap auth state and listen for changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      if (sbUser) {
        // Set a temporary user immediately from localStorage so the UI isn't blank
        const stored = loadStoredUserData(sbUser.id);
        setSupabaseUser(sbUser);
        setUser(buildUser(sbUser, stored));
        loadHistory(sbUser.id);
        // Then fetch the authoritative profile from Supabase (replaces localStorage data)
        fetchUserProfile(sbUser);
        syncSubscriptionFromSupabase(sbUser);
      }
      setIsLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const sbUser = session?.user ?? null;
      setSupabaseUser(sbUser);
      if (sbUser) {
        // Set a temporary user immediately so the UI has something to show
        const stored = loadStoredUserData(sbUser.id);
        setUser(buildUser(sbUser, stored));
        loadHistory(sbUser.id);
        // Fetch fresh profile on login, initial load, or token renewal
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          fetchUserProfile(sbUser);
        }
        syncSubscriptionFromSupabase(sbUser);
      } else {
        setUser(null);
        setHistory([]);
        setSelectedAnalysis(null);
      }
      setIsLoaded(true);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = useCallback(
    (newData: Partial<User>) => {
      if (!supabaseUser) return;
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...newData };
        const stored: StoredUserData = {
          telefone: updated.telefone,
          cidadeEstado: updated.cidadeEstado,
          linkedin: updated.linkedin,
          portfolio: updated.portfolio,
          plano: updated.plano,
          creditosUsados: updated.creditosUsados,
          creditosTotais: updated.creditosTotais,
          dataRenovacao: updated.dataRenovacao,
          cicloFaturamento: updated.cicloFaturamento,
          valorPlano: updated.valorPlano,
          metodoPagamento: updated.metodoPagamento,
        };
        saveStoredUserData(supabaseUser.id, stored);
        return updated;
      });
    },
    [supabaseUser]
  );

  const addCreditUsage = useCallback(() => {
    updateUser({ creditosUsados: (user?.creditosUsados ?? 0) + 1 });
  }, [updateUser, user?.creditosUsados]);

  // Re-queries the analyses count for the current month from Supabase
  // and syncs creditosUsados in state + localStorage. Call this after a
  // successful analysis insert to keep the modal counter accurate immediately.
  const refreshUsage = useCallback(async () => {
    if (!supabaseUser) return;
    try {
      const { count } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', supabaseUser.id)
        .gte('created_at', getStartOfMonth());
      if (count !== null) {
        updateUser({ creditosUsados: count });
      }
    } catch {
      // Non-blocking — the optimistic addCreditUsage() value remains
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseUser, updateUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/');
  }, [supabase, router]);

  const cancelSubscription = useCallback(async () => {
    console.log("Iniciando processo de cancelamento...");

    // Verificação defensiva: sessão deve estar presente com id válido
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id ?? supabaseUser?.id;
    console.log("User ID para cancelamento:", userId);

    if (!userId) {
      throw new Error("Sessão inválida: usuário não autenticado.");
    }

    const { data, error, status } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('id', userId)
      .select();

    console.log("Status da resposta Supabase:", status);
    console.log("Data retornada:", JSON.stringify(data, null, 2));

    if (error) {
      console.error("Erro ao cancelar assinatura no Supabase:", JSON.stringify(error, null, 2));
      throw error;
    }

    // Atualiza a UI imediatamente após confirmação do banco
    updateUser({
      plano: 'free',
      creditosTotais: 3,
      creditosUsados: 0,
      cicloFaturamento: undefined,
      valorPlano: undefined,
      metodoPagamento: undefined,
      dataRenovacao: 'N/A',
    });
    console.log("Cancelamento concluído com sucesso.");
  }, [updateUser, supabaseUser, supabase]);

  const activateSubscription = useCallback(
    async ({ planType, paymentMethod, cardLastFour }: ActivateSubscriptionParams) => {
      if (!supabaseUser) throw new Error('Usuário não autenticado.');

      const now = new Date();
      const periodEnd =
        planType === 'annual'
          ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
          : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      const { error } = await supabase.from('subscriptions').upsert(
        {
          id: supabaseUser.id,
          status: 'active',
          plan_type: planType,
          current_period_end: periodEnd.toISOString(),
        },
        { onConflict: 'id' }
      );

      if (error) throw error;

      const renovacao = periodEnd.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      updateUser({
        plano: 'pro',
        creditosUsados: 0,
        creditosTotais: 999999,
        dataRenovacao: renovacao,
        cicloFaturamento: planType === 'monthly' ? 'Mensal' : 'Anual',
        valorPlano: planType === 'monthly' ? 'R$ 19,99' : 'R$ 14,99',
        metodoPagamento:
          paymentMethod === 'credit_card'
            ? `Cartão final ${cardLastFour || '****'}`
            : 'Pix',
      });
    },
    [supabaseUser, updateUser, supabase]
  );

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  }, []);

  const isPro = user?.plano === 'pro';
  const canGenerateCv = isPro || (user ? user.creditosUsados < user.creditosTotais : false);
  const availableTemplates = isPro ? ['basico', 'executivo', 'minimalista'] : ['basico'];

  return (
    <UserContext.Provider
      value={{
        user,
        supabaseUserId: supabaseUser?.id ?? null,
        updateUser,
        addCreditUsage,
        refreshUsage,
        isLoaded,
        isLoadingProfile,
        logout,
        cancelSubscription,
        activateSubscription,
        isPro,
        canGenerateCv,
        availableTemplates,
        history,
        addToHistory,
        selectedAnalysis,
        setSelectedAnalysis,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
