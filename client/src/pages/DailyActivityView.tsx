import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdArrowBack, MdHome, MdPrint, MdSchedule, MdCheckCircle, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { apiFetch } from '../services/api';
import { getCurriculumDescription } from '../utils/curriculumLibrary';

interface Activity {
  title: string;
  objective: string;
  curriculumCodes: string[];
  materials: string[];
  instructions: string;
  declarativeLanguage?: string;
  modifications?: string;
  estimatedDuration: string;
}

interface Day {
  dayIndex: number;
  dayName: string;
  activities: Activity[];
}

interface PlanData {
  themeTitle: string;
  overview: string;
  days: Day[];
  pathways?: Array<{
    id: string;
    title: string;
    subtitle: string;
    color: 'green' | 'yellow' | 'blue';
    stepCount: number;
    setupRequired?: {
      duration: string;
      description: string;
    };
    steps: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
    wrapUp?: {
      title: string;
      description: string;
    };
  }>;
}

interface Plan {
  id: string;
  themeTitle: string;
  overview: string;
  planJson: {
    structured?: PlanData;
    raw: string;
  };
  createdAt: string;
  weekOf: string;
}

export default function DailyActivityView() {
  const { planId, dayIndex } = useParams<{ planId: string; dayIndex: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'instructions' | 'adult-support' | 'language' | 'materials' | 'reflection'>('instructions');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Progress tracking state
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [progressData, setProgressData] = useState({
    engagementLevel: 3,
    difficultyLevel: 3,
    enjoymentLevel: 3,
    generalNotes: '',
    successfulMoments: '',
    challenges: '',
    futureImprovements: '',
    activityStatus: 'in-progress' as 'not-started' | 'in-progress' | 'completed'
  });

  const dayIndexNum = dayIndex ? parseInt(dayIndex, 10) : 0;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const saveProgress = async () => {
    if (!planId) return;
    
    try {
      setSaving(true);
      setSaveMessage(null);
      
      // Prepare engagement notes combining all reflection data
      const engagementNotes = [
        progressData.generalNotes && `General Notes: ${progressData.generalNotes}`,
        progressData.successfulMoments && `Successful Moments: ${progressData.successfulMoments}`,
        progressData.challenges && `Challenges: ${progressData.challenges}`,
        progressData.futureImprovements && `Future Improvements: ${progressData.futureImprovements}`
      ].filter(Boolean).join('\n\n');
      
      // Prepare evidence JSON with ratings and status
      const evidenceJson = {
        engagementLevel: progressData.engagementLevel,
        difficultyLevel: progressData.difficultyLevel,
        enjoymentLevel: progressData.enjoymentLevel,
        activityStatus: progressData.activityStatus,
        timestamp: new Date().toISOString()
      };
      
      await apiFetch(`/api/progress/${planId}/day/${dayIndexNum}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagementNotes,
          evidenceJson
        })
      });
      
      setSaveMessage('Progress saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save progress:', error);
      setSaveMessage('Failed to save progress. Please try again.');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    async function fetchPlan() {
      if (!planId) return;
      
      try {
        setLoading(true);
        const planData = await apiFetch(`/api/plans/${planId}`) as Plan;
        setPlan(planData);
      } catch (err) {
        console.error('Failed to fetch plan:', err);
        setError('Failed to load plan');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPlan();
  }, [planId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-medium text-on-surface-variant">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back to Plan"
            onClick={() => navigate(`/plans/${planId}`)}
          />
        </div>
        <Card className="p-6 text-center">
          <h2 className="text-title-large mb-2">Activity Not Found</h2>
          <p className="text-body-medium text-on-surface-variant">
            {error || 'The requested activity could not be found.'}
          </p>
        </Card>
      </div>
    );
  }

  const structuredData = plan.planJson.structured;
  const currentDay = structuredData?.days?.find(d => d.dayIndex === dayIndexNum);

  if (!currentDay) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back to Plan"
            onClick={() => navigate(`/plans/${planId}`)}
          />
        </div>
        <Card className="p-6 text-center">
          <h2 className="text-title-large mb-2">Day Not Found</h2>
          <p className="text-body-medium text-on-surface-variant">
            The requested day could not be found in this plan.
          </p>
        </Card>
      </div>
    );
  }

  const totalDuration = currentDay.activities.reduce((total, activity) => {
    const duration = activity.estimatedDuration.match(/\d+/);
    return total + (duration ? parseInt(duration[0], 10) : 0);
  }, 0);

  const tabs = [
    { id: 'instructions', label: 'Instructions' },
    { id: 'adult-support', label: 'Adult Support' },
    { id: 'language', label: 'Language' },
    { id: 'materials', label: 'Materials' },
    { id: 'reflection', label: 'Reflection' }
  ] as const;

  const declarativeExamples = [
    "I notice you've arranged those Hot Wheels in an interesting pattern",
    "That's such a thoughtful way to connect the track pieces",
    "I'm wondering what you think about this map",
    "Your knowledge about cars shows incredible attention to detail",
    "There are several ways we could build this",
    "Your brain works differently, and that's exactly what makes this creative"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back"
            onClick={() => navigate(`/plans/${planId}`)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            iconLeft={<MdHome size={16} />}
            text="Dashboard"
            onClick={() => navigate('/dashboard')}
          />
          <Button
            variant="outlined"
            iconLeft={<MdPrint size={16} />}
            text="Print Day"
            onClick={() => window.print()}
          />
        </div>
      </div>

      {/* Day Header */}
      <div className="mb-6">
        <h1 className="text-display-small mb-2">
          Day {dayIndexNum + 1}: {currentDay.activities[0]?.title || currentDay.dayName}
        </h1>
        <p className="text-body-large text-on-surface-variant mb-4">
          Focus: {currentDay.activities[0]?.objective || 'Learning through play and exploration'}
        </p>
      </div>

      {/* Main Activity */}
      <Card className="p-6">
        {currentDay.activities.map((activity, activityIndex) => (
          <div key={activityIndex} className="mb-6">
            <div className="mb-6">
              <h3 className="text-title-large mb-4">Activity Overview</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-title-medium mb-2">Learning Focus</h4>
                  <p className="text-body-medium text-on-surface-variant mb-4">{activity.objective}</p>
                  
                  <h4 className="text-title-medium mb-2">Duration & Flexibility</h4>
                  <p className="text-body-medium text-on-surface-variant">
                    {activity.estimatedDuration} (follow your child's energy and interest)
                  </p>
                  <p className="text-body-small text-on-surface-variant mt-1">
                    Please have distinctive features and adapt timing as needed!
                  </p>
                </div>
                
                <div>
                  <h4 className="text-title-medium mb-2">Curriculum Connections</h4>
                  <div className="space-y-2">
                    {activity.curriculumCodes.map((code, idx) => (
                      <div key={idx} className="p-3 bg-surface-container-low rounded-lg">
                        <p className="text-label-large font-medium text-primary mb-1">{code}</p>
                        <p className="text-body-small text-on-surface-variant">
                          {getCurriculumDescription(code)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-outline mb-4">
              <div className="flex gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-body-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-6">
              {activeTab === 'instructions' && (
                <div className="space-y-6">
                  {/* Activity Pathways */}
                  <div>
                    <h4 className="text-title-medium mb-3">Activity Pathways</h4>
                    <p className="text-body-medium text-on-surface-variant mb-4">
                      Choose the approach that feels right for your child today. Each path includes detailed setup, 
                      step-by-step instructions, and wrap-up guidance.
                    </p>
                    
                    {/* Low Demand Path */}
                    <div className="mb-4">
                      <div 
                        className="cursor-pointer bg-green-50 border border-green-200 rounded-lg p-4"
                        onClick={() => toggleSection('low-demand-path')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <h5 className="text-title-medium">Low Demand Path</h5>
                              <p className="text-body-small text-green-700">PDA-friendly, high autonomy</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-body-small text-green-700">Flexible approach</span>
                            {expandedSections['low-demand-path'] ? <MdExpandLess /> : <MdExpandMore />}
                          </div>
                        </div>
                      </div>
                      
                      {expandedSections['low-demand-path'] && (
                        <div className="mt-3 p-4 bg-green-25 border-l-4 border-green-400 rounded-r-lg">
                          <div className="mb-4">
                            <h6 className="text-label-large font-medium mb-2">🛠️ Setup Required</h6>
                            <p className="text-body-medium text-green-800">
                              [10 mins] Set up materials casually, let child explore at their own pace, no pressure to follow exact steps.
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <h6 className="text-label-large font-medium mb-2">📋 Step-by-Step Instructions</h6>
                            <div className="space-y-2 text-body-medium text-green-800">
                              {activity.instructions.split(/\d+\./).filter(step => step.trim()).map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-1 font-medium">{idx + 1}.</span>
                                  <p className="flex-1">{step.trim()}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="text-label-large font-medium mb-2">🎯 Wrap-Up</h6>
                            <p className="text-body-medium text-green-800">
                              Let child decide when they're finished - any engagement is success!
                            </p>
                          </div>
                          
                          <div className="mt-4 p-3 bg-green-100 rounded-lg">
                            <p className="text-body-small text-green-700 italic">
                              💡 Remember: These are guides, not rules. Follow your child's lead and energy levels.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Moderate Structure Path */}
                    <div className="mb-4">
                      <div 
                        className="cursor-pointer bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                        onClick={() => toggleSection('moderate-structure-path')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div>
                              <h5 className="text-title-medium">Moderate Structure Path</h5>
                              <p className="text-body-small text-yellow-700">Shared control, balanced approach</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-body-small text-yellow-700">Guided steps</span>
                            {expandedSections['moderate-structure-path'] ? <MdExpandLess /> : <MdExpandMore />}
                          </div>
                        </div>
                      </div>
                      
                      {expandedSections['moderate-structure-path'] && (
                        <div className="mt-3 p-4 bg-yellow-25 border-l-4 border-yellow-400 rounded-r-lg">
                          <div className="mb-4">
                            <h6 className="text-label-large font-medium mb-2">🛠️ Setup Required</h6>
                            <p className="text-body-medium text-yellow-800">
                              [15 mins] Set up materials together, discuss the plan, and establish clear expectations.
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <h6 className="text-label-large font-medium mb-2">📋 Step-by-Step Instructions</h6>
                            <div className="space-y-2 text-body-medium text-yellow-800">
                              {activity.instructions.split(/\d+\./).filter(step => step.trim()).map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-yellow-600 mt-1 font-medium">{idx + 1}.</span>
                                  <p className="flex-1">{step.trim()}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="text-label-large font-medium mb-2">🎯 Wrap-Up</h6>
                            <p className="text-body-medium text-yellow-800">
                              Review what was learned and celebrate achievements together.
                            </p>
                          </div>
                          
                          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                            <p className="text-body-small text-yellow-700 italic">
                              💡 Remember: Adjust the pace based on your child's responses and interest level.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* High Engagement Path */}
                    <div className="mb-4">
                      <div 
                        className="cursor-pointer bg-blue-50 border border-blue-200 rounded-lg p-4"
                        onClick={() => toggleSection('high-engagement-path')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <h5 className="text-title-medium">High Engagement Path</h5>
                              <p className="text-body-small text-blue-700">Detailed exploration, extended learning</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-body-small text-blue-700">Deep dive</span>
                            {expandedSections['high-engagement-path'] ? <MdExpandLess /> : <MdExpandMore />}
                          </div>
                        </div>
                      </div>
                      
                      {expandedSections['high-engagement-path'] && (
                        <div className="mt-3 p-4 bg-blue-25 border-l-4 border-blue-400 rounded-r-lg">
                          <div className="mb-4">
                            <h6 className="text-label-large font-medium mb-2">🛠️ Setup Required</h6>
                            <p className="text-body-medium text-blue-800">
                              [20 mins] Full setup with additional materials and extension activities prepared.
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <h6 className="text-label-large font-medium mb-2">📋 Step-by-Step Instructions</h6>
                            <div className="space-y-2 text-body-medium text-blue-800">
                              {activity.instructions.split(/\d+\./).filter(step => step.trim()).map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-blue-600 mt-1 font-medium">{idx + 1}.</span>
                                  <p className="flex-1">{step.trim()}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="text-label-large font-medium mb-2">🎯 Wrap-Up</h6>
                            <p className="text-body-medium text-blue-800">
                              Explore extensions, document learning, and plan follow-up activities.
                            </p>
                          </div>
                          
                          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                            <p className="text-body-small text-blue-700 italic">
                              💡 Remember: This path is for when your child is highly motivated and wants to explore deeply.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'adult-support' && (
                <div className="space-y-4">
                  {/* Neurodiversity Support Sections */}
                  <div className="space-y-3">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>🧠</span>
                        <h4 className="text-label-large font-medium text-blue-800">Emotional Preparation</h4>
                      </div>
                      <p className="text-body-medium text-blue-700">
                        Your child might become deeply absorbed in building and resist transitions - this shows their autistic strength of focused attention, not defiance. The combination of Hot Wheels, building, and creative content might trigger intense engagement.
                      </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>⚡</span>
                        <h4 className="text-label-large font-medium text-green-800">Co-regulation Strategy</h4>
                      </div>
                      <p className="text-body-medium text-green-700">
                        If you feel frustrated by their intense focus on track building over geography learning, remember this is their brain's superpower - breathe and join their world. Let the learning happen through their interests.
                      </p>
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>🔧</span>
                        <h4 className="text-label-large font-medium text-orange-800">Troubleshooting</h4>
                      </div>
                      <p className="text-body-medium text-orange-700">
                        If they reject the cultural connections, just focus on the building and movement - geography and cultural learning can happen naturally through their interests in cars and tracks.
                      </p>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>✨</span>
                        <h4 className="text-label-large font-medium text-purple-800">Success Reframing</h4>
                      </div>
                      <p className="text-body-medium text-purple-700">
                        Success is your child being engaged and happy with building, creating, or exploring - not completing every planned cultural element. Any connection they make between their interests and the wider world is meaningful learning.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div>
                  <div 
                    className="cursor-pointer"
                    onClick={() => toggleSection('declarative-examples')}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span>💬</span>
                      <h4 className="text-label-large font-medium">Declarative Language Examples</h4>
                      {expandedSections['declarative-examples'] ? <MdExpandLess /> : <MdExpandMore />}
                    </div>
                  </div>
                  
                  {expandedSections['declarative-examples'] && (
                    <div>
                      <p className="text-body-medium text-on-surface-variant mb-4">
                        Use these connection-focused phrases instead of direct commands:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {declarativeExamples.map((example, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-3 bg-surface-container-low rounded-lg">
                            <span className="text-primary">💭</span>
                            <p className="text-body-medium italic">"{example}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-title-medium mb-4">Materials Needed</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-label-large mb-3 font-medium">🥘 Core Building Materials</h5>
                        <ul className="space-y-2">
                          <li className="text-body-medium">LEGO bricks (2-3 cups mixed colors and sizes)</li>
                          <li className="text-body-medium">Playdough (4-5 colors, 1 container each)</li>
                          <li className="text-body-medium">Hot Wheels cars (5-10 cars)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-label-large mb-3 font-medium">🚗 Track and Movement</h5>
                        <ul className="space-y-2">
                          <li className="text-body-medium">Hot Wheels track pieces (10-15 pieces)</li>
                          <li className="text-body-medium">Base plates or cardboard (2-3 large pieces)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-title-medium mb-4">🌏 Cultural and Geographic Resources</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <ul className="space-y-2">
                          <li className="text-body-medium">World map or globe (1)</li>
                          <li className="text-body-medium">Pictures of different countries (5-10 images)</li>
                          <li className="text-body-medium">Music playlist (1-2 hours of K-pop)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-label-large mb-3 font-medium">📱 Documentation and Creativity</h5>
                        <ul className="space-y-2">
                          <li className="text-body-medium">Paper and markers (10 sheets, basic colors)</li>
                          <li className="text-body-medium">Camera or phone (1)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reflection' && (
                <div className="space-y-8">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary rounded-lg">
                        <MdCheckCircle size={20} className="text-on-primary" />
                      </div>
                      <div>
                        <h3 className="text-title-medium">Record Progress for {activity.title}</h3>
                        <p className="text-body-small text-on-surface-variant">Track engagement, outcomes, and observations</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-label-small ${
                      progressData.activityStatus === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : progressData.activityStatus === 'in-progress'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        progressData.activityStatus === 'completed' 
                          ? 'bg-green-500' 
                          : progressData.activityStatus === 'in-progress'
                          ? 'bg-orange-500'
                          : 'bg-gray-500'
                      }`}></div>
                      {progressData.activityStatus === 'completed' 
                        ? 'Completed' 
                        : progressData.activityStatus === 'in-progress'
                        ? 'In Progress'
                        : 'Not Started'
                      }
                    </div>
                  </div>

                  {/* Mark as Complete */}
                  <div>
                    <Button
                      variant={progressData.activityStatus === 'completed' ? 'filled' : 'outlined'}
                      text={progressData.activityStatus === 'completed' ? 'Activity Completed' : 'Mark as Complete'}
                      iconLeft={<MdCheckCircle size={16} />}
                      onClick={() => setProgressData(prev => ({ 
                        ...prev, 
                        activityStatus: prev.activityStatus === 'completed' ? 'in-progress' : 'completed' 
                      }))}
                    />
                  </div>

                  {/* Engagement Tracking */}
                  <div>
                    <h4 className="text-title-medium mb-4">How engaged was your child?</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { icon: '👎', label: 'Not interested', value: 1 },
                        { icon: '👎', label: 'A bit reluctant', value: 2 },
                        { icon: '⚫', label: 'Neutral', value: 3 },
                        { icon: '👍', label: 'Engaged', value: 4 },
                        { icon: '⭐', label: 'Very engaged', value: 5 }
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={`flex items-center gap-2 p-3 border rounded-lg transition-colors text-left ${
                            progressData.engagementLevel === option.value 
                              ? 'border-primary bg-primary-container' 
                              : 'border-outline hover:bg-surface-container-low'
                          }`}
                          onClick={() => setProgressData(prev => ({ ...prev, engagementLevel: option.value }))}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-body-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <h4 className="text-title-medium mb-4">How was the difficulty level?</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { label: 'Too easy', code: 'E', value: 1 },
                        { label: 'A bit easy', code: 'e', value: 2 },
                        { label: 'Just right', code: '✓', value: 3 },
                        { label: 'A bit hard', code: 'h', value: 4 },
                        { label: 'Too hard', code: 'H', value: 5 }
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors ${
                            progressData.difficultyLevel === option.value 
                              ? 'border-primary bg-primary-container' 
                              : 'border-outline hover:bg-surface-container-low'
                          }`}
                          onClick={() => setProgressData(prev => ({ ...prev, difficultyLevel: option.value }))}
                        >
                          <span className="text-lg font-bold">{option.code}</span>
                          <span className="text-body-small text-center">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enjoyment Level */}
                  <div>
                    <h4 className="text-title-medium mb-4">How much did your child enjoy it?</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { emoji: '😞', label: "Didn't enjoy", value: 1 },
                        { emoji: '😐', label: 'Not much', value: 2 },
                        { emoji: '🙂', label: 'It was okay', value: 3 },
                        { emoji: '😊', label: 'Enjoyed it', value: 4 },
                        { emoji: '🤩', label: 'Loved it!', value: 5 }
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={`flex items-center gap-2 p-3 border rounded-lg transition-colors text-left ${
                            progressData.enjoymentLevel === option.value 
                              ? 'border-primary bg-primary-container' 
                              : 'border-outline hover:bg-surface-container-low'
                          }`}
                          onClick={() => setProgressData(prev => ({ ...prev, enjoymentLevel: option.value }))}
                        >
                          <span className="text-lg">{option.emoji}</span>
                          <span className="text-body-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* General Notes */}
                  <div>
                    <h4 className="text-title-medium mb-3">General Notes</h4>
                    <textarea
                      className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      rows={4}
                      placeholder="Any additional observations about your child's experience with this activity..."
                      value={progressData.generalNotes}
                      onChange={(e) => setProgressData(prev => ({ ...prev, generalNotes: e.target.value }))}
                    />
                  </div>

                  {/* Reflection Questions */}
                  <div>
                    <h4 className="text-title-medium mb-4">Reflection Questions</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-body-medium text-on-surface-variant mb-2">
                          What went really well during this activity?
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          rows={3}
                          placeholder="Describe the positive moments, breakthroughs, or successes..."
                          value={progressData.successfulMoments}
                          onChange={(e) => setProgressData(prev => ({ ...prev, successfulMoments: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-body-medium text-on-surface-variant mb-2">
                          What was challenging or didn't work as expected?
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          rows={3}
                          placeholder="Note any difficulties, confusion, or areas that need adjustment..."
                          value={progressData.challenges}
                          onChange={(e) => setProgressData(prev => ({ ...prev, challenges: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-body-medium text-on-surface-variant mb-2">
                          What would you try differently or expand on next time?
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          rows={3}
                          placeholder="Ideas for improvements, extensions, or adaptations for future activities..."
                          value={progressData.futureImprovements}
                          onChange={(e) => setProgressData(prev => ({ ...prev, futureImprovements: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <h4 className="text-title-medium mb-3">Documentation & Evidence</h4>
                    <p className="text-body-medium text-on-surface-variant mb-4">
                      Upload photos of work, observations, or any relevant documents for this activity.
                    </p>
                    
                    <div className="border-2 border-dashed border-outline rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-surface-container-low rounded-lg">
                          <svg className="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-body-medium text-on-surface-variant mb-2">
                            Upload photos or documents from this activity
                          </p>
                          <Button
                            variant="outlined"
                            text="Choose Files"
                            onClick={() => console.log('File upload clicked')}
                          />
                          <p className="text-body-small text-on-surface-variant mt-2">0/5 files uploaded</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Message */}
                  {saveMessage && (
                    <div className={`p-4 rounded-lg ${
                      saveMessage.includes('successfully') 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      <p className="text-body-medium">{saveMessage}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-outline">
                    <Button
                      variant="outlined"
                      text="⚡ Request Activity Extension"
                      onClick={() => console.log('Request extension')}
                    />
                    
                    <Button
                      variant="filled"
                      text={saving ? 'Saving...' : 'Save Progress'}
                      iconLeft={<MdCheckCircle size={16} />}
                      disabled={saving}
                      onClick={saveProgress}
                    />
                  </div>

                  {/* Reporting Notice */}
                  <div className="p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">💡</span>
                      <div>
                        <p className="text-body-medium">
                          <strong>For Reporting:</strong> All your notes, reflections, and attachments are automatically 
                          saved and can be exported as a comprehensive report for education authorities or your records.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Adaptations & Supports */}
                  <div>
                    <h4 className="text-title-medium mb-4">Adaptations & Supports</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-body-medium">
                          <span className="text-green-600">✓</span>
                          <span>Allow movement between testing locations</span>
                        </div>
                        <div className="flex items-center gap-2 text-body-medium">
                          <span className="text-green-600">✓</span>
                          <span>Use visual timers for transitions</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-body-medium">
                          <span className="text-green-600">✓</span>
                          <span>Provide noise-cancelling headphones for breaks</span>
                        </div>
                        <div className="flex items-center gap-2 text-body-medium">
                          <span className="text-green-600">✓</span>
                          <span>Offer choice of recording method (drawing, writing, voice recording)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </Card>

      {/* Activity Pathways are now integrated into the Instructions tab */}

      {/* Completion Card */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-title-large mb-2">Amazing work today!</h2>
          <p className="text-body-medium text-on-surface-variant">
            Your child has completed all the activities for Day {dayIndexNum + 1}: {currentDay.activities[0]?.title}. 
            Remember, every step forward is progress worth celebrating!
          </p>
        </div>
      </Card>
    </div>
  );
}
