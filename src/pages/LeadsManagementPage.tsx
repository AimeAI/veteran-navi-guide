
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLeads, exportLeadsToCSV } from '@/services/leadService';
import { EmployerLead, LeadStatus, LEAD_STATUS_OPTIONS } from '@/types/leads';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Building, 
  RefreshCw 
} from 'lucide-react';
import LeadCard from '@/components/leads/LeadCard';
import LeadEditForm from '@/components/leads/LeadEditForm';
import LeadImportDialog from '@/components/leads/LeadImportDialog';
import { toast } from 'sonner';

const LeadsManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState<EmployerLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<EmployerLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'date_added',
    direction: 'desc'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get('status') as LeadStatus | 'all' || 'all';
    const search = searchParams.get('search') || '';
    const sortField = searchParams.get('sortBy') || 'date_added';
    const sortDir = searchParams.get('sortDir') as 'asc' | 'desc' || 'desc';
    
    setStatusFilter(status);
    setSearchTerm(search);
    setSortBy({ field: sortField, direction: sortDir });
  }, [searchParams]);
  
  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Only apply status filter if it's not 'all'
      const filter = statusFilter !== 'all' 
        ? { status: statusFilter } 
        : undefined;
        
      const fetchedLeads = await getLeads(filter, sortBy);
      setLeads(fetchedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, sortBy]);
  
  // Fetch leads on mount and when filters change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);
  
  // Apply search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLeads(leads);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = leads.filter(lead => 
        lead.company_name.toLowerCase().includes(term) ||
        lead.website_url.toLowerCase().includes(term) ||
        (lead.notes && lead.notes.toLowerCase().includes(term))
      );
      setFilteredLeads(filtered);
    }
  }, [leads, searchTerm]);
  
  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    params.set('sortBy', sortBy.field);
    params.set('sortDir', sortBy.direction);
    
    setSearchParams(params);
  }, [statusFilter, searchTerm, sortBy, setSearchParams]);
  
  // Sort leads
  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle export to CSV
  const handleExport = () => {
    if (filteredLeads.length === 0) {
      toast.error('No leads to export');
      return;
    }
    
    const csvContent = exportLeadsToCSV(filteredLeads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employer-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Leads exported successfully');
  };
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex items-center mb-6">
        <Building className="h-8 w-8 mr-3 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-gray-500">Track and manage potential employer leads</p>
        </div>
      </div>
      
      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search leads..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {LEAD_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <Select
                value={`${sortBy.field}-${sortBy.direction}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split('-');
                  setSortBy({ field, direction: direction as 'asc' | 'desc' });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_added-desc">Newest First</SelectItem>
                  <SelectItem value="date_added-asc">Oldest First</SelectItem>
                  <SelectItem value="company_name-asc">Company Name (A-Z)</SelectItem>
                  <SelectItem value="company_name-desc">Company Name (Z-A)</SelectItem>
                  <SelectItem value="lead_status-asc">Status (A-Z)</SelectItem>
                  <SelectItem value="lead_status-desc">Status (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLeads}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <LeadImportDialog onImportComplete={fetchLeads} />
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={filteredLeads.length === 0}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                  </DialogHeader>
                  <LeadEditForm 
                    onSave={() => {
                      setIsAddDialogOpen(false);
                      fetchLeads();
                    }}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isLoading ? 'Loading leads...' : `${filteredLeads.length} ${filteredLeads.length === 1 ? 'Lead' : 'Leads'}`}
          </h2>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters to see more results' 
                : "You haven't added any leads yet"}
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Lead
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLeads.map(lead => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              onLeadUpdated={fetchLeads} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsManagementPage;
