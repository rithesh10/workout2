import React from "react";
import LandingPage from "./Login/LandingPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import LoginModal from "./Login/Login";
import RegisterModal from "./Login/RegisterModal";
// import { Route} from 'lucide-react'
import Join from "./Pages/join";
import DietPlan from "./Pages/Dietplan";
import WorkoutPlan from "./Pages/Workoutplan";
import Home from "./Pages/Home";
import ExerciseTracker from "./Pages/ExerciseTracker";
import UserProfile from "./Pages/UserProfile";
import NavbarWorkout from "./workout/navbar";
import JoinWorkout from "./workout/join";
import WorkoutPage from "./workout/GetWorkoutPlan";
import ExerciseDetail from "./workout/Exercise";


const App = () => {

  return (
    // <LandingPage/>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginModal />} />
          <Route path="/register" element={<RegisterModal />} />
          <Route path="/dash"element={<Join/>}/>
          <Route path="/dietplan" element={<DietPlan/>}/>
          <Route path="/generateWorout" element={<WorkoutPlan/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/exerciseTracker" element={<ExerciseTracker/>}/>
          <Route path="/profile" element={<UserProfile/>}/>
          {/* <Route path="/navbarWorkout" element={<NavbarWorkout/>}/> */}
          {/* <Route path="/joinWorkout" element={<JoinWorkout/>}/> */}
          <Route path="/getWorkoutPlan" element={<WorkoutPage/>}/>
          <Route path="/getExercise" element={<ExerciseDetail/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;