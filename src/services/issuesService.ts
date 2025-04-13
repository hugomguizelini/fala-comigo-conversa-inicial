
import { supabase } from "@/integrations/supabase/client";

export type Issue = {
  id?: string;
  user_id?: string;
  issue: string;
  description: string;
  related_to: string;
  affected_campaigns: string[];
  severity: string;
  created_at?: string;
  updated_at?: string;
};

export const getIssues = async (): Promise<Issue[]> => {
  const { data, error } = await supabase
    .from('identified_issues')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
  
  return data || [];
};

export const insertIssue = async (issue: Issue): Promise<Issue> => {
  const { data, error } = await supabase
    .from('identified_issues')
    .insert({
      ...issue,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting issue:', error);
    throw error;
  }
  
  return data;
};

export const updateIssue = async (id: string, issue: Partial<Issue>): Promise<Issue> => {
  const { data, error } = await supabase
    .from('identified_issues')
    .update(issue)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating issue:', error);
    throw error;
  }
  
  return data;
};

export const deleteIssue = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('identified_issues')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting issue:', error);
    throw error;
  }
};
