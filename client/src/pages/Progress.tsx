import React, { useEffect, useState } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Progress as ProgressBar } from '../ui/components/progress-bar/Progress';
import { Button } from '../ui/components/button/common-button/Button';
import { MdTrendingUp, MdCalendarToday, MdStar, MdInsights } from 'react-icons/md';
import { apiFetch } from '../services/api';

type Child = { id: string; firstName: string };
type Plan = { 
  id: string; 
  themeTitle: string; 
  createdAt: string;
  planJson: {
    days?: Array<{
      dayIndex: number;
      activities: Array<{
        title: string;
        objective: string;
      }>;
    }>;
  };
};

type ProgressEntry = {
  id: string;
  planId: string;
  dayIndex: number;
  engagementNotes?: string;
  evidenceJson?: any;
  createdAt: string;
};

export default function Progress() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChildren() {
      try {
        const data = await apiFetch('/api/children') as Child[];
        setChildren(data);
        if (data.length > 0) {
          setSelectedChildId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch children:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChildren();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    
    async function fetchPlansAndProgress() {
      try {
        setLoading(true);
        const plansData = await apiFetch(`/api/plans/child/${selectedChildId}`) as Plan[];
        setPlans(plansData);
        
        // Fetch progress data for all plans
        const allProgress: ProgressEntry[] = [];
        for (const plan of plansData) {
          try {
            const progressEntries = await apiFetch(`/api/progress/${plan.id}`) as ProgressEntry[];
            allProgress.push(...progressEntries);
          } catch (error) {
            console.error(`Failed to fetch progress for plan ${plan.id}:`, error);
          }
        }
        setProgressData(allProgress);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlansAndProgress();
  }, [selectedChildId]);

  // Calculate progress metrics from real data
  const totalPlans = plans.length;
  const totalDays = plans.reduce((sum, plan) => sum + (plan.planJson.days?.length || 0), 0);
  const completedDays = progressData.length;
  const plansWithProgress = new Set(progressData.map(p => p.planId)).size;
  
  const plansCompletionPercentage = totalPlans > 0 ? Math.round((plansWithProgress / totalPlans) * 100) : 0;
  const daysCompletionPercentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  
  // Calculate engagement metrics (simplified - could be enhanced with actual engagement scoring)
  const engagementPercentage = progressData.length > 0 ? 
    Math.round((progressData.filter(p => p.engagementNotes && p.engagementNotes.length > 0).length / progressData.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-medium text-on-surface-variant">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-display-small">Progress Tracking</h1>
        <p className="text-body-large text-on-surface-variant">
          Monitor your child's learning journey with engagement-focused progress tracking.
        </p>
      </div>

      {/* Child Selection */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-title-large">Select Child</h2>
        </div>
        <div className="min-w-[240px]">
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
      </Card>

      {selectedChildId && (
        <>
          {/* Progress Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <MdTrendingUp size={24} className="text-primary" />
                <h2 className="text-title-large">Learning Progress</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-body-small">
                    <span>Plans with Progress</span>
                    <span>{plansWithProgress}/{totalPlans}</span>
                  </div>
                  <ProgressBar percentageValue={plansCompletionPercentage} color="bg-primary" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-body-small">
                    <span>Days Completed</span>
                    <span>{completedDays}/{totalDays}</span>
                  </div>
                  <ProgressBar percentageValue={daysCompletionPercentage} color="bg-secondary" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-body-small">
                    <span>Days with Notes</span>
                    <span>{progressData.filter(p => p.engagementNotes).length}/{progressData.length}</span>
                  </div>
                  <ProgressBar percentageValue={engagementPercentage} color="bg-tertiary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <MdStar size={24} className="text-primary" />
                <h2 className="text-title-large">Engagement Highlights</h2>
              </div>
              <div className="space-y-3">
                {progressData.length > 0 ? (
                  <>
                    <div className="rounded-lg bg-surface-container p-3">
                      <h3 className="text-body-medium font-medium">Total Progress Entries</h3>
                      <p className="text-body-small text-on-surface-variant">
                        {progressData.length} learning activities tracked
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-container p-3">
                      <h3 className="text-body-medium font-medium">Recent Activity</h3>
                      <p className="text-body-small text-on-surface-variant">
                        {progressData.length > 0 ? 
                          `Last entry: ${new Date(progressData[progressData.length - 1].createdAt).toLocaleDateString()}` :
                          'No recent activity'
                        }
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-container p-3">
                      <h3 className="text-body-medium font-medium">Documentation Rate</h3>
                      <p className="text-body-small text-on-surface-variant">
                        {engagementPercentage}% of activities have engagement notes
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg bg-surface-container p-3 text-center">
                    <h3 className="text-body-medium font-medium">No Progress Data</h3>
                    <p className="text-body-small text-on-surface-variant">
                      Start completing activities to see engagement highlights
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Recent Plans */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-title-large">Recent Learning Plans</h2>
              <Button 
                variant="text" 
                text="View All Plans" 
                onClick={() => window.location.href = '/plans'}
              />
            </div>
            
            {plans.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mb-4 rounded-full bg-surface-container p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <MdInsights size={24} className="text-on-surface-variant" />
                </div>
                <h3 className="text-title-medium mb-2">No progress data yet</h3>
                <p className="text-body-medium text-on-surface-variant mb-4">
                  Create some learning plans to start tracking progress and engagement.
                </p>
                <Button 
                  variant="outlined" 
                  text="Create First Plan" 
                  onClick={() => window.location.href = '/plans'}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {plans.slice(0, 3).map((p) => {
                  const planProgress = progressData.filter(prog => prog.planId === p.id);
                  const totalDaysInPlan = p.planJson.days?.length || 0;
                  const completedDaysInPlan = planProgress.length;
                  const engagementRate = completedDaysInPlan > 0 ? 
                    Math.round((planProgress.filter(prog => prog.engagementNotes).length / completedDaysInPlan) * 100) : 0;
                  
                  return (
                    <div key={p.id} className="rounded-lg border border-outline p-4 hover:bg-surface-container-low transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-title-medium">{p.themeTitle}</h3>
                          <div className="mt-2 flex items-center gap-4 text-body-small text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <MdCalendarToday size={16} />
                              {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MdTrendingUp size={16} />
                              {completedDaysInPlan}/{totalDaysInPlan} days • {engagementRate}% documented
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outlined" 
                            text="View Details" 
                            onClick={() => window.location.href = `/plans/${p.id}`}
                          />
                          <Button 
                            variant="text" 
                            text="Progress" 
                            onClick={() => {
                              // Could navigate to a detailed progress view for this plan
                              console.log('View progress for plan:', p.id);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
