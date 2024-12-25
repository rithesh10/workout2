import React, { useState } from 'react';

const WorkoutPlan = () => {
  const [workoutPlans, setWorkoutPlans] = useState([
    {
      id: 1,
      name: 'Beginner Full Body',
      duration: '4 weeks',
      difficulty: 'Beginner',
      workoutsPerWeek: 3,
      targetMuscles: ['Full Body'],
      description: 'Perfect for those just starting their fitness journey',
      phases: [
        {
          week: 1,
          workouts: [
            {
              day: 'Monday',
              exercises: [
                { name: 'Bodyweight Squats', sets: 3, reps: 10 },
                { name: 'Push-ups', sets: 3, reps: 5 },
                { name: 'Walking Lunges', sets: 2, reps: 10 }
              ]
            },
            // More workouts...
          ]
        }
      ],
      assignedUsers: 15,
      goals: ['Strength', 'Endurance']
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'details', 'edit'

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    difficulty: 'Beginner',
    workoutsPerWeek: 3,
    targetMuscles: [],
    description: '',
    goals: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlan) {
      setWorkoutPlans(prev =>
        prev.map(plan =>
          plan.id === selectedPlan.id
            ? { ...plan, ...formData }
            : plan
        )
      );
    } else {
      setWorkoutPlans(prev => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
          assignedUsers: 0,
          phases: []
        }
      ]);
    }
    setIsEditing(false);
    setSelectedPlan(null);
  };

  const handleDelete = (id) => {
    setWorkoutPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const renderPlanDetails = (plan) => (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Duration</h4>
            <p>{plan.duration}</p>
          </div>
          <div>
            <h4 className="font-semibold">Difficulty</h4>
            <p>{plan.difficulty}</p>
          </div>
          <div>
            <h4 className="font-semibold">Workouts/Week</h4>
            <p>{plan.workoutsPerWeek}</p>
          </div>
          <div>
            <h4 className="font-semibold">Target Muscles</h4>
            <p>{plan.targetMuscles.join(', ')}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">Description</h4>
          <p>{plan.description}</p>
        </div>

        <div>
          <h4 className="font-semibold">Weekly Schedule</h4>
          {plan.phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="mt-2">
              <h5 className="font-medium">Week {phase.week}</h5>
              {phase.workouts.map((workout, workoutIndex) => (
                <div key={workoutIndex} className="ml-4 mt-2">
                  <h6 className="font-medium">{workout.day}</h6>
                  <ul className="ml-4">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <li key={exerciseIndex}>
                        {exercise.name}: {exercise.sets} sets × {exercise.reps} reps
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Workout Plans</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutPlans.map(plan => (
          <div key={plan.id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="space-x-2">
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCurrentView('details');
                  }}
                  className="text-blue-500"
                >
                  View Details
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p>Duration: {plan.duration}</p>
              <p>Difficulty: {plan.difficulty}</p>
              <p>Workouts per week: {plan.workoutsPerWeek}</p>
              <p>Assigned Users: {plan.assignedUsers}</p>
              <p>Goals: {plan.goals.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedPlan ? 'Edit Workout Plan' : 'Create New Workout Plan'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Plan Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  placeholder="e.g., 4 weeks"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                >
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedPlan(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {selectedPlan ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentView === 'details' && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Plan Details</h2>
              <button
                onClick={() => {
                  setCurrentView('overview');
                  setSelectedPlan(null);
                }}
                className="text-gray-500"
              >
                Close
              </button>
            </div>
            {renderPlanDetails(selectedPlan)}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;