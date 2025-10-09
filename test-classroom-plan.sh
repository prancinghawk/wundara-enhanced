#!/bin/bash
echo "Testing classroom plan generation endpoint..."
echo ""

curl -X POST http://localhost:3001/api/educator-plans/generate \
  -H "Content-Type: application/json" \
  -d '{
    "classroomName": "Test Classroom",
    "educatorName": "Test Educator",
    "yearLevel": "Year 3",
    "state": "NSW",
    "subject": "English",
    "lessonDuration": 60,
    "students": [
      {
        "id": "1",
        "firstName": "Test Student",
        "ageYears": 8,
        "neurotype": "Autism",
        "strengths": ["Visual learning"],
        "challenges": ["Transitions"],
        "interests": ["Animals"],
        "sensoryNeeds": ["Quiet spaces"],
        "communicationStyle": "Visual",
        "learningPreferences": ["Visual"],
        "accommodations": ["Extra time"]
      }
    ],
    "learningObjectives": ["Test objective"],
    "availableResources": ["Basic crafts"],
    "classroomLayout": "Flexible seating",
    "specialConsiderations": "Test"
  }' | jq '.' || echo "Request failed"

echo ""
echo "Check server console for detailed logs"
