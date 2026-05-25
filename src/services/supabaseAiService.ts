import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aqcglagrjazexqtlujvm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AIInsightRow {
  id: string;
  created_at: string;
  title: string;
  summary: string;
  category: string;
  recommended_assets: Array<{
    symbol: string;
    name: string;
    reasoning: string;
  }>;
  disclaimer: string;
}

export async function fetchAIInsights(category?: string): Promise<AIInsightRow[]> {
  let query = supabase
    .from('ai_insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching AI insights from Supabase:', error);
    return [];
  }
  return data as AIInsightRow[];
}
