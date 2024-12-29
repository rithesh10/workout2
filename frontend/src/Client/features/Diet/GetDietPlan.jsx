const url=import.meta.env.VITE_BACKEND_URL
import { useState,useEffect } from "react";
import axios from 'axios';
import React from "react";
import Spinner from "../../../components/Spinner";
import NotFound from "../../../components/NotFound";
const GetDietPlan = () => {
    const [dietPlan,setDietPlan] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchDietPlan = async () => {
        try {
          const response = await axios.post(
            `${url}/get-diet`,
            {},
            { withCredentials: true }
          );
          setDietPlan(response.data.data);
        } catch (err) {
          console.error('Error fetching workout plan:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchDietPlan();
    }, []);
    console.log(dietPlan);
  
    if (loading) return <Spinner/>;
    if (!dietPlan) return <NotFound/>;
  
    return (
      <div className="flex justify-center w-screen items-center min-h-screen bg-black text-gray-200 p-6">
  <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl overflow-x-auto">
    <div className="text-center font-bold text-2xl text-white py-4">Current Diet Plan</div>
    <table className="w-full text-sm text-left text-gray-300">
      <thead className="bg-gray-700 text-gray-200 uppercase">
        <tr>
          <th className="px-6 py-4">Type of Meal</th>
          <th className="px-6 py-4">Food Name</th>
          <th className="px-6 py-4">Quantity</th>
          <th className="px-6 py-4">Calories</th>
        </tr>
      </thead>
      <tbody>
        {dietPlan.dailyDiet.map((diet, dayIndex) => (
          <React.Fragment key={dayIndex}>
            <tr className="bg-gray-700 font-bold text-white">
              <td colSpan="4" className="px-6 py-3 text-lg">
                {diet.typeOfMeal}
              </td>
            </tr>
            {diet.FoodItems.map((item, itemIndex) => (
              <tr key={itemIndex} className="border-b border-gray-600 hover:bg-gray-700">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4">{item.foodName}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{item.calories}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
</div>

    );
  };
  export default GetDietPlan;