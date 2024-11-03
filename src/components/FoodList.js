import { writeFoodInfo, getFoodInfo } from '../firebaseUtils';
import React, { useState, useEffect } from 'react';

const FoodList = ({ foodItems, setFoodItems, isLoggedIn }) => {
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [food, setFood] = useState('');
  const [time, setTime] = useState('');
  const [club, setClub] = useState('');
  const [showForm, setShowForm] = useState(false); // Toggle between showing form and displaying food list
  const [loading, setLoading] = useState(false); // To handle loading state when fetching data

  // Function to handle form submission for adding food data
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Please log in to add food entries.');
      return;
    }

    // Validate form inputs
    if (!building || !room || !food || !time || !club) {
      alert('All fields are required!');
      return;
    }

    const foodId = Math.random().toString(36).substr(2, 9); // Generate random ID
    const foodData = { building, room, food, time, club };

    // Write food data to Firebase
    writeFoodInfo(foodId, foodData);

    // Add new item to the food items state
    const updatedFoodItems = [...foodItems, { foodId, ...foodData }];
    setFoodItems(updatedFoodItems); // Update shared state in App

    // Reset form fields
    setBuilding('');
    setRoom('');
    setFood('');
    setTime('');
    setClub('');
  };

  // Function to fetch food data from Firebase
  const fetchFoodItems = async () => {
    setLoading(true); // Set loading state to true while fetching
    const foodData = await getFoodInfo();
    if (foodData) {
      const foodArray = Object.keys(foodData).map((key) => ({
        foodId: key,
        ...foodData[key],
      }));
      setFoodItems(foodArray); // Update shared state in App
    }
    setLoading(false); // Stop loading once data is fetched
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  return (
    <div>
      <h1>Food List</h1>

      {/* Display add food option based on login status */}
      <div>
        {isLoggedIn ? (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Add Food'}
          </button>
        ) : (
          <div>
            <button disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              Log in to add food entries
            </button>
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Log in to add your own food entries to the list!
            </p>
          </div>
        )}
      </div>

      {/* Show form only if the user is logged in */}
      {isLoggedIn && showForm && (
        <form onSubmit={handleSubmit}>
          <input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="Building" required />
          <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" required />
          <input value={food} onChange={(e) => setFood(e.target.value)} placeholder="Food" required />
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" required />
          <input value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club" required />
          <button type="submit">Add Food</button>
        </form>
      )}

      {/* Display food items */}
      <div>
        {loading ? (
          <p>Loading food items...</p>
        ) : (
          <ul>
            {foodItems.length > 0 ? (
              foodItems.map((item) => (
                <li key={item.foodId}>
                  {item.food} - {item.building}, Room: {item.room}, Time: {item.time}, Club: {item.club}
                </li>
              ))
            ) : (
              <p>No food items found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FoodList;
