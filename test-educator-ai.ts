import { generateClassroomPlan } from './server/src/services/educatorAI';

const testRequest = {
  classroomName: 'Test Room',
  educatorName: 'Test Teacher',
  yearLevel: 'Year 3',
  state: 'NSW',
  subject: 'English',
  lessonDuration: 60,
  students: [{
    id: '1',
    firstName: 'Test',
    ageYears: 8,
    neurotype: 'Autism',
    strengths: ['Visual'],
    challenges: ['Transitions'],
    interests: ['Animals'],
    sensoryNeeds: ['Quiet'],
    communicationStyle: 'Visual',
    learningPreferences: ['Visual'],
    accommodations: ['Time']
  }],
  learningObjectives: ['Test objective'],
  availableResources: ['Basic'],
  classroomLayout: 'Flexible',
  specialConsiderations: 'Test'
};

generateClassroomPlan(testRequest).then(result => {
  console.log('Result:', result);
}).catch(err => {
  console.error('Error:', err);
});
