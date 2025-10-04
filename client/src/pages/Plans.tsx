import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdAdd, MdAutoAwesome } from 'react-icons/md';
import { apiFetch } from '../services/api';
import { CreatePlanWizard } from '../components/CreatePlanWizard';
import { useAuth } from '@clerk/clerk-react';
// Removed PlanViewer import - now using separate route

type Child = {
  id: string;
  firstName: string;
};

type Plan = {
  id: string;
  themeTitle: string;
  overview: string;
  planJson: {
    structured?: any;
    raw: string;
  };
  createdAt: string;
  weekOf: string;
};

export default function Plans() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  // Removed viewingPlan state - now using separate route

  useEffect(() => {
    // Fetch real children data
    async function fetchChildren() {
      try {
        const token = await getToken();
        const data = await apiFetch('/api/children', { token }) as Child[];
        setChildren(data);
        if (data.length > 0) {
          setSelectedChildId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch children:', error);
        setMessage('Failed to load children');
      }
    }
    fetchChildren();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    
    async function fetchPlans() {
      try {
        const token = await getToken();
        const data = await apiFetch(`/api/plans/child/${selectedChildId}`, { token }) as Plan[];
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        setMessage('Failed to load plans');
      }
    }
    fetchPlans();
  }, [selectedChildId]);

  async function handlePlanCreated(newPlan: Plan) {
    console.log('handlePlanCreated called with:', newPlan);
    
    // Add the new plan to the list immediately
    setPlans(prev => {
      console.log('Adding plan to existing plans:', prev.length);
      return [newPlan, ...prev];
    });
    setMessage('Plan generated successfully!');
    
    // Also refresh the plans list from server to ensure consistency
    if (selectedChildId) {
      console.log('Refreshing plans for child:', selectedChildId);
      try {
        const token = await getToken();
        console.log('Got token for refresh:', token ? 'Yes' : 'No');
        const data = await apiFetch(`/api/plans/child/${selectedChildId}`, { token }) as Plan[];
        console.log('Refreshed plans from server:', data.length, 'plans');
        setPlans(data);
      } catch (error) {
        console.error('Failed to refresh plans:', error);
        // Keep the optimistically added plan if refresh fails
      }
    }
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  }

  function viewPlan(planId: string) {
    // Navigate to separate plan view page
    navigate(`/plans/${planId}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-display-small">Learning Plans</h1>
        <p className="text-body-large text-on-surface-variant">
          Create personalized, neurodiversity-affirming learning plans for your children.
        </p>
      </div>

      {/* Plan Generation */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-title-large">Generate New Plan</h2>
          <p className="text-body-medium text-on-surface-variant mt-1">
            Select a child and generate an AI-powered weekly learning plan based on their interests and neurotype.
          </p>
        </div>
        
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[240px]">
            <label className="text-label-large mb-2 block">Select child</label>
            <select
              className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedChildId ?? ''}
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              <option value="">Choose a child...</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName}</option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={() => setShowCreateWizard(true)}
            disabled={!selectedChildId}
            variant="filled"
            iconLeft={<MdAutoAwesome size={20} />}
            text="Create New Plan"
          />
        </div>
        
        {message && (
          <div className="mt-4 rounded-lg bg-surface-container p-3">
            <p className="text-body-medium">{message}</p>
          </div>
        )}
      </Card>

      {/* Plans List */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-title-large">Your Plans</h2>
          <Button variant="text" text="View All" />
        </div>
        
        {children.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mb-4 rounded-full bg-surface-container p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <MdAdd size={24} className="text-on-surface-variant" />
            </div>
            <h3 className="text-title-medium mb-2">No child profiles yet</h3>
            <p className="text-body-medium text-on-surface-variant mb-4">
              Create a child profile first to generate personalized learning plans.
            </p>
            <Button 
              variant="filled" 
              text="Create Child Profile" 
              iconLeft={<MdAdd size={16} />}
              onClick={() => navigate('/profiles')}
            />
          </div>
        ) : plans.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mb-4 rounded-full bg-surface-container p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <MdAutoAwesome size={24} className="text-on-surface-variant" />
            </div>
            <h3 className="text-title-medium mb-2">No plans yet</h3>
            <p className="text-body-medium text-on-surface-variant mb-4">
              Generate your first learning plan to get started with personalized education.
            </p>
            <p className="text-body-small text-on-surface-variant mb-4">
              Debug: Plans array length: {plans.length}, Selected child: {selectedChildId}
            </p>
            <Button 
              variant="outlined" 
              text="Create First Plan" 
              iconLeft={<MdAutoAwesome size={16} />}
              disabled={!selectedChildId}
              onClick={() => setShowCreateWizard(true)}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="rounded-lg border border-outline p-4 hover:bg-surface-container-low transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-title-medium">{p.themeTitle}</h3>
                    <p className="text-body-small text-on-surface-variant">
                      Created {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outlined" 
                      text="View" 
                      onClick={() => viewPlan(p.id)}
                    />
                    <Button 
                      variant="text" 
                      text="Edit" 
                      onClick={() => setMessage('Edit functionality coming soon!')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Create Plan Wizard */}
      <CreatePlanWizard
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
}
