const url=import.meta.env.VITE_BACKEND_URL
import { useState,useEffect } from "react";
import axios from 'axios';
import React from "react";
import Spinner from "../components/Spinner";
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
    if (!dietPlan) return <p>Error: Could not load workout plan.</p>;
  
    return (
      <div className="flex justify-center w-screen items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl overflow-x-auto">
          <div className='text-center font-bold text-2xl'>Current Diet Plan</div>
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-900 text-white uppercase">
              <tr>
                <th className="px-6 py-4">Type of Meal</th>
                <th className="px-6 py-4">Food name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Calories</th>
              </tr>
            </thead>
            <tbody>
              {dietPlan.dailyDiet.map((diet, dayIndex) => (
                <React.Fragment key={dayIndex}>
                  <tr className="bg-blue-50 font-bold">
                    <td colSpan="4" className="px-6 py-3 text-black text-lg">
                      {diet.typeOfMeal}
                    </td>
                  </tr>
                  {diet.FoodItems.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b hover:bg-gray-50">
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