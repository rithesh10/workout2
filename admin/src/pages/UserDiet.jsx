import React from "react";

const UserDiet = ({ selectedDiet, selectedUser, fetchError, onClose }) => {
  console.log("Selected Diet Data:", selectedDiet);

  // Handle missing or malformed data gracefully
  if (!selectedDiet) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedUser?.fullName || "User"}'s Diet Plan
          </h2>
          <p className="text-gray-500">No diet plan available for this user.</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { dailyDiet, fitnessGoal, fitnessLevel } = selectedDiet;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {selectedUser?.fullName || "User"}'s Diet Plan
        </h2>
        {fetchError ? (
          <p className="text-red-500 mb-4">{fetchError}</p>
        ) : (
          <div className="border-b pb-4 mb-4">
            <p className="mb-2">
              <strong>Fitness Goal:</strong> {fitnessGoal || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Fitness Level:</strong> {fitnessLevel || "N/A"}
            </p>

            <h3 className="font-semibold mt-4 text-gray-700">Daily Diet:</h3>
            {dailyDiet?.length > 0 ? (
              dailyDiet.map((meal, i) => (
                <div key={meal._id || i} className="mt-4">
                  <h4 className="font-semibold text-gray-700">
                    {meal.typeOfMeal || "Meal"}:
                  </h4>
                  {meal.FoodItems?.length > 0 ? (
                    <ul className="list-disc pl-6">
                      {meal.FoodItems.map((food, j) => (
                        <li key={food._id || j} className="mb-2">
                          <p>
                            <strong>Food:</strong> {food.foodName || "N/A"}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {food.quantity || "N/A"}
                          </p>
                          <p>
                            <strong>Calories:</strong> {food.calories || "N/A"}{" "}
                            kcal
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No food items for this meal.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No meals planned for this user.</p>
            )}
          </div>
        )}
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDiet;
