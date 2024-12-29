import React from "react";
import LandingPage from "./Login/LandingPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Client/Pages/Dashboard";
import LoginModal from "./Login/Login";
import RegisterModal from "./Login/RegisterModal";
// import { Route} from 'lucide-react'
import Join from "./Client/Pages/join";
import DietPlan from "./Client/features/Diet/Dietplan"
import WorkoutPlan from "./Client/features/workout/Workoutplan";
import Home from "./Client/Pages/Home";
import ExerciseTracker from "./Client/Pages/ExerciseTracker";
import UserProfile from "./Client/Pages/UserProfile";
// import NavbarWorkout from "./workout/navbar";
import JoinWorkout from "./Client/features/workout/join";
import WorkoutPage from "./Client/features/workout/GetWorkoutPlan";
import ExerciseDetail from "./Client/features/workout/Exercise";
import GetDietPlan from "./Client/features/Diet/GetDietPlan";
import PerformanceModal from "./Client/features/workout/Performance";
import Footer from "./components/Footer";
import ForgotPassword from "./Login/ForgotPassword";
import UserPerformance from "./Client/features/workout/UserPerformance";
import AdminPortal from "./Admin/components/AdminPortal";

const App = () => {

  return (
    // <LandingPage/>
    <div>
      <BrowserRouter>
      <div className="app-container flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<AdminPortal/>}/>
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
          <Route path="/getDiet" element={<GetDietPlan/>}/>
          <Route path="/performance" element={<PerformanceModal/>}/>
          <Route path="/forget-password" element={<ForgotPassword/>}/>
          <Route path="/user-performance" element={<UserPerformance/>}/>
        </Routes>
              </div>

      {/* Footer */}
      <Footer />
      </div>   
   </BrowserRouter>
      
    </div>
    
  );
};

export default App;
