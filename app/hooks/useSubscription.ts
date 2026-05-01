'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '../contexts/UserContext';

export interface SubscriptionRow {
  id: string;
  status: 'active' | 'canceled' | 'expired';
  plan_type: 'mensal' | 'anual';
  current_period_end: string;
}

export interface UseSubscriptionResult {
  subscription: SubscriptionRow | null;
  isActive: boolean;
  planType: 'mensal' | 'anual' | null;
  currentPeriodEnd: Date | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionResult {
  const { supabaseUserId } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!supabaseUserId) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, status, plan_type, current_period_end')
      .eq('id', supabaseUserId)
      .maybeSingle();

    if (!error && data) {
      setSubscription(data as SubscriptionRow);
    } else {
      setSubscription(null);
    }
    setIsLoading(false);
  }, [supabaseUserId]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;

  const isActive =
    subscription?.status === 'active' &&
    periodEnd !== null &&
    periodEnd > new Date();

  return {
    subscription,
    isActive,
    planType: subscription?.plan_type ?? null,
    currentPeriodEnd: periodEnd,
    isLoading,
    refresh: fetchSubscription,
  };
}
