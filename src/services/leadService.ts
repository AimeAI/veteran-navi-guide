
import { supabase } from "@/integrations/supabase/client";
import { EmployerLead, LeadStatus } from "@/types/leads";
import { toast } from "sonner";

const TABLE_NAME = 'employer_leads';

export const getLeads = async (
  filters?: { status?: LeadStatus },
  sortBy?: { field: string; direction: 'asc' | 'desc' }
): Promise<EmployerLead[]> => {
  try {
    let query = supabase.from(TABLE_NAME).select('*');
    
    // Apply filters
    if (filters?.status) {
      query = query.eq('lead_status', filters.status);
    }
    
    // Apply sorting
    if (sortBy) {
      query = query.order(sortBy.field, { ascending: sortBy.direction === 'asc' });
    } else {
      // Default sort by date_added descending
      query = query.order('date_added', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load employer leads');
      return [];
    }
    
    return data as EmployerLead[];
  } catch (error) {
    console.error('Exception in getLeads:', error);
    toast.error('An error occurred while fetching leads');
    return [];
  }
};

export const createLead = async (lead: Omit<EmployerLead, 'id' | 'date_added' | 'updated_at'>): Promise<EmployerLead | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([lead])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create employer lead');
      return null;
    }
    
    toast.success('Employer lead added successfully');
    return data as EmployerLead;
  } catch (error) {
    console.error('Exception in createLead:', error);
    toast.error('An error occurred while creating the lead');
    return null;
  }
};

export const updateLead = async (id: string, updates: Partial<EmployerLead>): Promise<EmployerLead | null> => {
  try {
    // Always update the updated_at timestamp when updating a lead
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update employer lead');
      return null;
    }
    
    toast.success('Employer lead updated successfully');
    return data as EmployerLead;
  } catch (error) {
    console.error('Exception in updateLead:', error);
    toast.error('An error occurred while updating the lead');
    return null;
  }
};

export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete employer lead');
      return false;
    }
    
    toast.success('Employer lead deleted successfully');
    return true;
  } catch (error) {
    console.error('Exception in deleteLead:', error);
    toast.error('An error occurred while deleting the lead');
    return false;
  }
};

// Function to export all leads as CSV
export const exportLeadsToCSV = (leads: EmployerLead[]): string => {
  // CSV Header
  const csvHeader = [
    'Company Name',
    'Website URL',
    'LinkedIn URL',
    'Lead Status',
    'Notes',
    'Date Added',
    'Last Updated'
  ].join(',');
  
  // Format each lead as a CSV row
  const csvRows = leads.map(lead => {
    // Escape fields that might contain commas
    const escapeCsvField = (field: string | undefined) => {
      if (!field) return '';
      // If field contains commas, quotes, or newlines, wrap in quotes and escape internal quotes
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };
    
    return [
      escapeCsvField(lead.company_name),
      escapeCsvField(lead.website_url),
      escapeCsvField(lead.linkedin_url),
      lead.lead_status,
      escapeCsvField(lead.notes),
      new Date(lead.date_added).toLocaleDateString(),
      new Date(lead.updated_at).toLocaleDateString()
    ].join(',');
  });
  
  // Combine header and rows
  return [csvHeader, ...csvRows].join('\n');
};

// Function to parse CSV data and return leads
export const parseCSVToLeads = (csvData: string): Omit<EmployerLead, 'id' | 'date_added' | 'updated_at'>[] => {
  const lines = csvData.split('\n');
  
  // Skip header row and parse each data row
  const leads = lines.slice(1).filter(line => line.trim() !== '').map(line => {
    // This is a simple CSV parser, in production you would use a more robust CSV parsing library
    // that handles quoted fields with commas properly
    
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    // Parse CSV with respect to quotes
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        // Toggle quote state
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // End of field
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        // Add character to current field
        currentValue += char;
      }
    }
    
    // Add the last field
    values.push(currentValue.trim());
    
    // Map CSV values to lead fields
    return {
      company_name: values[0] || '',
      website_url: values[1] || '',
      linkedin_url: values[2] || undefined,
      lead_status: (values[3] as LeadStatus) || 'New',
      notes: values[4] || undefined
    };
  });
  
  return leads;
};

// Import leads from CSV
export const importLeadsFromCSV = async (csvData: string): Promise<number> => {
  try {
    const leads = parseCSVToLeads(csvData);
    
    if (leads.length === 0) {
      toast.error('No valid leads found in the CSV file');
      return 0;
    }
    
    // Insert all leads in one batch
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(leads)
      .select();
    
    if (error) {
      console.error('Error importing leads:', error);
      toast.error('Failed to import leads');
      return 0;
    }
    
    toast.success(`Successfully imported ${data.length} leads`);
    return data.length;
  } catch (error) {
    console.error('Exception in importLeadsFromCSV:', error);
    toast.error('An error occurred while importing leads');
    return 0;
  }
};
