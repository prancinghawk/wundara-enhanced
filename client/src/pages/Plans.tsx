import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdAdd, MdAutoAwesome } from 'react-icons/md';
import { apiFetch } from '../services/api';
import { CreatePlanWizard } from '../components/CreatePlanWizard';
import { ClassroomSetupWizard } from '../components/ClassroomSetupWizard';
import { useAuth, useUser } from '@clerk/clerk-react';
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
  const location = useLocation();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showClassroomSetup, setShowClassroomSetup] = useState(false);
  const [planType, setPlanType] = useState<'individual' | 'classroom'>('individual');
  const [currentClassroom, setCurrentClassroom] = useState<any>(null);

  // Check if user is an educator
  const isEducator = useMemo(() => {
    if (!user) return false;
    const publicMetadata = user.publicMetadata as any;
    const unsafeMetadata = user.unsafeMetadata as any;
    const metadata = { ...publicMetadata, ...unsafeMetadata };
    return metadata.accountType === 'classroom';
  }, [user]);

  // Handle navigation from ClassroomProfiles
  useEffect(() => {
    const state = location.state as any;
    if (state?.planType === 'classroom' && state?.classroomData && state?.openWizard) {
      setPlanType('classroom');
      setCurrentClassroom(state.classroomData);
      setShowCreateWizard(true);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Fetch children on component mount (only for homeschool users)
  useEffect(() => {
    // Skip fetching children for educators
    if (isEducator) {
      return;
    }

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
      }
    }
    fetchChildren();
  }, [getToken, isEducator]);
  // Fetch plans for selected child (only for homeschool users)
  useEffect(() => {
    if (!selectedChildId || isEducator) return;
    
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
  }, [selectedChildId, isEducator]);

  async function handlePlanCreated(newPlan: Plan) {
    console.log('handlePlanCreated called with:', newPlan);
    
    // Add the new plan to the list immediately
    setPlans(prev => {
      console.log('Adding plan to existing plans:', prev.length);
      return [newPlan, ...prev];
    });
    
    if (isEducator && planType === 'classroom') {
      setMessage('Classroom plan generated successfully!');
      console.log('Classroom plan created, not refreshing individual child plans');
    } else {
      setMessage('Plan generated successfully!');
      
      // Only refresh individual child plans for non-classroom plans
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
          {isEducator 
            ? "Create personalized, neurodiversity-affirming learning plans for individual students or entire classrooms."
            : "Create personalized, neurodiversity-affirming learning plans for your children."
          }
        </p>
      </div>

      {/* Plan Generation */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-title-large">Generate New Plan</h2>
          <p className="text-body-medium text-on-surface-variant mt-1">
            {isEducator 
              ? "Create individual student plans or comprehensive classroom plans for multiple students."
              : "Select a child and generate an AI-powered weekly learning plan based on their interests and neurotype."
            }
          </p>
        </div>

        {/* Plan Type Selector for Educators */}
        {isEducator && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-title-medium mb-3">Plan Type</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="planType"
                  value="individual"
                  checked={planType === 'individual'}
                  onChange={(e) => setPlanType(e.target.value as 'individual' | 'classroom')}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-body-medium">
                  <strong>Individual Student</strong> - Create a personalized plan for one student with special accommodations
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="planType"
                  value="classroom"
                  checked={planType === 'classroom'}
                  onChange={(e) => setPlanType(e.target.value as 'individual' | 'classroom')}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-body-medium">
                  <strong>Classroom Plan</strong> - Create a plan for an entire classroom with differentiation options
                </span>
              </label>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap items-end gap-4">
          {/* Child Selection - only show for individual plans or non-educators */}
          {(!isEducator || planType === 'individual') && (
            <div className="min-w-[240px]">
              <label className="text-label-large mb-2 block">
                {isEducator ? 'Select student' : 'Select child'}
              </label>
              <select
                className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={selectedChildId ?? ''}
                onChange={(e) => setSelectedChildId(e.target.value)}
              >
                <option value="">{isEducator ? 'Choose a student...' : 'Choose a child...'}</option>
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Classroom Plan Info */}
          {isEducator && planType === 'classroom' && (
            <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-body-medium text-blue-700">
                <strong>Classroom Plan:</strong> This will create a comprehensive plan that can be adapted for all students in your classroom, with built-in differentiation strategies and accommodation options.
              </p>
            </div>
          )}
          
          <Button
            onClick={() => {
              if (isEducator && planType === 'classroom') {
                if (currentClassroom) {
                  setShowCreateWizard(true);
                } else {
                  setShowClassroomSetup(true);
                }
              } else {
                setShowCreateWizard(true);
              }
            }}
            disabled={(!isEducator || planType === 'individual') && !selectedChildId}
            variant="filled"
            iconLeft={<MdAutoAwesome size={20} />}
            text={
              isEducator && planType === 'classroom' 
                ? (currentClassroom ? 'Create Classroom Plan' : 'Setup Classroom First')
                : 'Create New Plan'
            }
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
        
        {!isEducator && children.length === 0 ? (
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
                    <h3 className="text-title-medium">
                      {(p as any).themeTitle || (p as any).classroomName || (p as any).classTheme?.title || 'Untitled Plan'}
                    </h3>
                    <p className="text-body-small text-on-surface-variant">
                      {(p as any).classroomName && `${(p as any).subject} • ${(p as any).yearLevel} • `}
                      Created {new Date((p as any).createdAt || (p as any).generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      text="View Plan"
                      onClick={() => viewPlan(p.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Create Plan Wizard */}
      {showCreateWizard && (
        <CreatePlanWizard
          isOpen={showCreateWizard}
          onClose={() => setShowCreateWizard(false)}
          onPlanCreated={handlePlanCreated}
          planType={planType}
          isEducator={isEducator}
          classroomData={currentClassroom}
        />
      )}

      {/* Classroom Setup Wizard */}
      {showClassroomSetup && (
        <ClassroomSetupWizard
          isOpen={showClassroomSetup}
          onClose={() => setShowClassroomSetup(false)}
          onClassroomCreated={(classroom) => {
            setCurrentClassroom(classroom);
            setShowClassroomSetup(false);
            setMessage(`Classroom "${classroom.classroomName}" created successfully! You can now create plans for this classroom.`);
            setTimeout(() => setMessage(null), 5000);
          }}
        />
      )}
    </div>
  );
}
