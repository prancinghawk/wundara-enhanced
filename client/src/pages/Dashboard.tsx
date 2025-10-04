import React, { useEffect, useState } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { Progress } from '../ui/components/progress-bar/Progress';
import { TextElement } from '../ui/elements/common/TextElement';
import { MdAdd, MdTrendingUp, MdGroup, MdCalendarToday, MdChat } from 'react-icons/md';
import { apiFetch } from '../services/api';

type Child = {
  id: string;
  firstName: string;
  age?: number;
  neurotype?: string;
};

type Plan = {
  id: string;
  themeTitle: string;
  overview: string;
  createdAt: string;
  childId: string;
  planJson: {
    days?: Array<{
      dayIndex: number;
      activities: Array<{
        title: string;
        objective: string;
        estimatedDuration: string;
      }>;
    }>;
  };
};

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [recentPlans, setRecentPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch children
        const childrenData = await apiFetch('/api/children') as Child[];
        setChildren(childrenData);
        
        // If we have children, fetch their plans
        if (childrenData.length > 0) {
          const firstChild = childrenData[0];
          const plansData = await apiFetch(`/api/plans/child/${firstChild.id}`) as Plan[];
          setRecentPlans(plansData);
          
          // Set the most recent plan as current
          if (plansData.length > 0) {
            setCurrentPlan(plansData[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Show error state instead of fallback data
        setChildren([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  const firstName = children.length > 0 ? children[0].firstName : 'there';

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-medium text-on-surface-variant">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-display-small">Welcome back! Ready for today's adventure?</h1>
        <p className="text-body-large text-on-surface-variant">
          Let's continue {firstName}'s personalized learning journey
        </p>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-on-surface-variant">Active Plans</p>
              <p className="text-display-small font-bold">{recentPlans.length}</p>
            </div>
            <div className="rounded-lg bg-green-100 p-2">
              <div className="h-4 w-4 bg-green-500 rounded"></div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-on-surface-variant">This Week</p>
              <p className="text-display-small font-bold">0/{currentPlan?.planJson.days?.length || 0}</p>
              <p className="text-body-small text-on-surface-variant">Days Done</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-2">
              <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-on-surface-variant">Children</p>
              <p className="text-display-small font-bold">{children.length}</p>
              <p className="text-body-small text-on-surface-variant">Profiles</p>
            </div>
            <div className="rounded-lg bg-purple-100 p-2">
              <MdGroup size={16} className="text-purple-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-on-surface-variant">Total Plans</p>
              <p className="text-display-small font-bold">{recentPlans.length}</p>
              <p className="text-body-small text-on-surface-variant">Created</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-2">
              <div className="h-4 w-4 bg-orange-500 rounded"></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current Learning Plan */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-title-large">Current Learning Plan</h2>
              {currentPlan ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-label-small text-green-700">
                  In Progress
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-label-small text-gray-700">
                  No Active Plan
                </span>
              )}
            </div>
            
            {currentPlan ? (
              <>
                <div className="mb-4">
                  <h3 className="text-title-medium mb-2">
                    {currentPlan.themeTitle}
                  </h3>
                  <p className="text-body-small text-on-surface-variant mb-4">
                    Plan Progress
                  </p>
                  {currentPlan.planJson.days && (
                    <>
                      <div className="mb-2 flex justify-between text-body-small">
                        <span>0 of {currentPlan.planJson.days.length} days completed</span>
                      </div>
                      <Progress percentageValue={0} color="bg-primary" />
                    </>
                  )}
                </div>
                
                <Card className="p-4 bg-surface-container-low">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <span className="text-yellow-600">⭐</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-title-small mb-1">
                        Ready to explore: {currentPlan.planJson.days?.[0]?.activities[0]?.title || 'Learning Adventure'}
                      </h4>
                      <p className="text-body-small text-on-surface-variant mb-2">
                        {currentPlan.overview}
                      </p>
                      <div className="flex items-center gap-4 text-body-small text-on-surface-variant">
                        <span>🕐 {currentPlan.planJson.days?.length || 0} days</span>
                        <span>• Learning • Growth</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="filled" 
                      text="View Plan Details" 
                      className="flex-1"
                      onClick={() => window.location.href = `/plans/${currentPlan.id}`}
                    />
                    <Button 
                      variant="outlined" 
                      text="View All Plans"
                      onClick={() => window.location.href = '/plans'}
                    />
                  </div>
                </Card>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
                <h3 className="text-title-medium mb-2">No Active Learning Plan</h3>
                <p className="text-body-medium text-on-surface-variant mb-4">
                  Create your first personalized learning plan to get started!
                </p>
                <Button 
                  variant="filled" 
                  text="Create New Plan"
                  onClick={() => window.location.href = '/plans'}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-title-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outlined" 
                text="Generate New Plan" 
                iconLeft={<MdAdd size={16} />} 
                className="w-full justify-start"
              />
              <Button 
                variant="outlined" 
                text="Download Current Plan" 
                className="w-full justify-start"
              />
              <Button 
                variant="outlined" 
                text="View Schedule" 
                iconLeft={<MdCalendarToday size={16} />} 
                className="w-full justify-start"
              />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-2">
                <span className="text-green-600">💡</span>
              </div>
              <h3 className="text-title-medium">Today's Tip</h3>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-body-small">
                {currentPlan ? 
                  `${firstName} is working on "${currentPlan.themeTitle}" - remember to follow their lead and celebrate small wins!` :
                  `Ready to create ${firstName}'s first personalized learning plan? Start with their interests and strengths!`
                }
              </p>
            </div>
          </Card>

          {/* Recent Plans */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-title-medium">Recent Plans</h3>
              <Button variant="text" text="See all" />
            </div>
            {recentPlans.length === 0 ? (
              <p className="text-body-small text-on-surface-variant">No plans created yet.</p>
            ) : (
              <div className="space-y-3">
                {recentPlans.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="rounded-lg bg-surface-container-high p-3">
                    <h4 className="text-body-medium font-medium">{plan.themeTitle}</h4>
                    <p className="text-body-small text-on-surface-variant">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Community */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <MdGroup size={20} className="text-on-surface-variant" />
              <h3 className="text-title-medium">Community</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-surface-container p-3">
                <p className="text-body-small">
                  <strong>5 Events Nearby</strong>
                </p>
                <p className="text-body-small text-on-surface-variant">
                  Join local meetups and support groups
                </p>
              </div>
              <Button variant="outlined" text="Explore Community" className="w-full" />
            </div>
          </Card>
        </div>
      </div>

      {/* AI Chat Quick Access */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary p-2">
              <MdChat size={20} className="text-on-primary" />
            </div>
            <div>
              <h3 className="text-title-medium">AI Chat</h3>
              <p className="text-body-small text-on-surface-variant">
                Start a conversation with your AI educational companion
              </p>
            </div>
          </div>
          <Button variant="filled" text="Start Chat" />
        </div>
      </Card>
    </div>
  );
}
