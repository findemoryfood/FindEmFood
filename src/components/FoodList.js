import { writeFoodInfo, getFoodInfo } from '../firebaseUtils'; 
import { populateFirebaseFromGroupMe } from '../groupmeUtils'; // Updated import
import React, { useState, useEffect } from 'react';
import locations from "../BuildingContent";

const FoodList = ({ foodItems, setFoodItems, isLoggedIn }) => {
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [food, setFood] = useState('');
  const [time, setTime] = useState('');
  const [club, setClub] = useState('');
  const [showForm, setShowForm] = useState(false); // Toggle between showing form and displaying food list
  const [loading, setLoading] = useState(false); // To handle loading state when fetching data
  const [selectedBuilding, setSelectedBuilding] = useState(''); // State to store selected building for GPS link

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Please log in to add food entries.');
      return;
    }

    if (!building) {
      alert('Building name is required!');
      return;
    }

    const foodId = Math.random().toString(36).substr(2, 9);
    const foodData = {
      building,
      room: room || "Not Specified",
      food: food || "Free Food!",
      time: time || "Not Specified",
      club: club || "Not Specified",
    };
    writeFoodInfo(foodId, foodData);
    const updatedFoodItems = [...foodItems, { foodId, ...foodData }];
    setFoodItems(updatedFoodItems);

    setBuilding('');
    setRoom('');
    setFood('');
    setTime('');
    setClub('');
  };

  const fetchFoodItems = async () => {
    setLoading(true);
    const foodData = await getFoodInfo();
    if (foodData) {
      const foodArray = Object.keys(foodData).map((key) => ({
        foodId: key,
        ...foodData[key],
      }));
      setFoodItems(foodArray);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleGroupMeFetch = async () => {
    await populateFirebaseFromGroupMe(); // Updated function call
    fetchFoodItems(); // Refresh the food list after populating
  };

  return (
    <div>
      <h1>Food List</h1>

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

      {isLoggedIn && showForm && (
        <form onSubmit={handleSubmit}>
          {/* Dropdown for Building Selection based on buildings from BuildingContent to prevent mapping error / typo*/}
          <select value={building} onChange={(e) => setBuilding(e.target.value)} required>
            <option value="">Select Building</option>
            {Object.keys(locations).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" />
          <input value={food} onChange={(e) => setFood(e.target.value)} placeholder="Food" />
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" />
          <input value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club" />
          <button type="submit">Add Food</button>
        </form>
      )}

      <div>
        <button onClick={handleGroupMeFetch}>Fetch Food Entries from GroupMe</button> {/* Updated Button */}
      </div>

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
