import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const exercises = ['push-ups', 'bicep-curls', 'plank']; // Add more exercises as needed

  const handleExerciseSelect = (exercise) => {
    navigate('/exercise', { state: { exercise } });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>AI GYM TRAINER</h1>
      <h2>Select an exercise</h2>
      <div>
        {exercises.map((exercise) => (
          <button
            key={exercise}
            onClick={() => handleExerciseSelect(exercise)}
            style={{
              margin: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {exercise}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
