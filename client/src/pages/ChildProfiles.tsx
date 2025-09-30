import React, { useEffect, useState } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdAdd, MdEdit, MdDelete, MdPerson, MdSchool } from 'react-icons/md';
import { ChildProfileForm } from '../components/ChildProfileForm';
import { ChildProfileWizard } from '../components/ChildProfileWizard';
import { apiFetch } from '../services/api';

interface Child {
  id: string;
  firstName: string;
  ageYears?: number;
  neurotype?: string;
  interests?: string;
  learningContext?: 'homeschool' | 'classroom';
  state?: string;
  createdAt: string;
}

interface ChildProfile {
  firstName: string;
  ageYears: number | null;
  neurotype?: string;
  interests: string;
  learningContext: 'homeschool' | 'classroom' | '';
  state: string;
}

export default function ChildProfiles() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/children') as Child[];
      setChildren(data);
    } catch (error) {
      console.error('Failed to fetch children:', error);
      setMessage('Failed to load children profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChild = async (profile: ChildProfile) => {
    try {
      const newChild = await apiFetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      }) as Child;
      
      setChildren(prev => [...prev, newChild]);
      setShowForm(false);
      setMessage('Child profile created successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to create child:', error);
      setMessage('Failed to create child profile');
    }
  };

  const handleUpdateChild = async (profile: ChildProfile) => {
    if (!editingChild) return;
    
    try {
      const updatedChild = await apiFetch(`/api/children/${editingChild.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      }) as Child;
      
      setChildren(prev => prev.map(child => 
        child.id === editingChild.id ? updatedChild : child
      ));
      setEditingChild(null);
      setMessage('Child profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update child:', error);
      setMessage('Failed to update child profile');
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!confirm('Are you sure you want to delete this child profile? This will also delete all associated learning plans.')) {
      return;
    }

    try {
      await apiFetch(`/api/children/${childId}`, {
        method: 'DELETE'
      });
      
      setChildren(prev => prev.filter(child => child.id !== childId));
      setMessage('Child profile deleted successfully');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to delete child:', error);
      setMessage('Failed to delete child profile');
    }
  };

  const startEditing = (child: Child) => {
    setEditingChild(child);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingChild(null);
  };

  // Show wizard if creating new or editing
  if (showForm || editingChild) {
    return (
      <ChildProfileWizard
        onSave={editingChild ? handleUpdateChild : handleCreateChild}
        onCancel={cancelForm}
        initialData={editingChild ? {
          ...editingChild,
          neurotypes: editingChild.neurotype ? editingChild.neurotype.split(', ') : [],
          interests: editingChild.interests ? editingChild.interests.split(', ') : []
        } : undefined}
        isEditing={!!editingChild}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-medium text-on-surface-variant">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-small">Child Profiles</h1>
          <p className="text-body-large text-on-surface-variant">
            Manage your children's profiles to create personalized learning experiences
          </p>
        </div>
        <Button
          variant="filled"
          iconLeft={<MdAdd size={20} />}
          text="Add Child"
          onClick={() => setShowForm(true)}
        />
      </div>

      {/* Message */}
      {message && (
        <Card className="p-4 bg-surface-container">
          <p className="text-body-medium">{message}</p>
        </Card>
      )}

      {/* Children Grid */}
      {children.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
              <MdPerson size={48} className="text-on-surface-variant" />
            </div>
            <h2 className="text-title-large mb-2">No child profiles yet</h2>
            <p className="text-body-medium text-on-surface-variant mb-6 max-w-md mx-auto">
              Create your first child profile to start generating personalized, neurodiversity-affirming learning plans.
            </p>
            <Button
              variant="filled"
              iconLeft={<MdAdd size={20} />}
              text="Create First Profile"
              onClick={() => setShowForm(true)}
            />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Card key={child.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Child Avatar */}
              <div className="mb-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <MdPerson size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-title-large">{child.firstName}</h3>
                  {child.ageYears && (
                    <p className="text-body-medium text-on-surface-variant">
                      {child.ageYears} years old
                    </p>
                  )}
                </div>
              </div>

              {/* Child Details */}
              <div className="space-y-3 mb-6">
                {child.neurotype && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-body-small text-on-surface-variant">
                      {child.neurotype}
                    </span>
                  </div>
                )}
                
                {child.learningContext && (
                  <div className="flex items-center gap-2">
                    <MdSchool size={16} className="text-on-surface-variant" />
                    <span className="text-body-small text-on-surface-variant capitalize">
                      {child.learningContext}
                    </span>
                  </div>
                )}

                {child.state && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    <span className="text-body-small text-on-surface-variant">
                      {child.state}
                    </span>
                  </div>
                )}

                {child.interests && (
                  <div className="mt-3">
                    <p className="text-label-small text-on-surface-variant mb-1">Interests:</p>
                    <p className="text-body-small line-clamp-2">{child.interests}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  iconLeft={<MdEdit size={16} />}
                  text="Edit"
                  onClick={() => startEditing(child)}
                  className="flex-1"
                />
                <Button
                  variant="text"
                  iconLeft={<MdDelete size={16} />}
                  text="Delete"
                  onClick={() => handleDeleteChild(child.id)}
                  className="text-error hover:bg-error-container/10"
                />
              </div>

              {/* Created Date */}
              <div className="mt-4 pt-4 border-t border-outline">
                <p className="text-body-small text-on-surface-variant">
                  Created {new Date(child.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
