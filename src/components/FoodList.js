import { writeFoodInfo, getFoodInfo, deleteExpiredEntries } from '../firebaseUtils';
import { populateFirebaseFromGroupMe } from '../groupmeUtils';
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

  // Function to handle form submission
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

    const foodId = Math.random().toString(36).substr(2, 9); // Generate a random ID
    const foodData = {
      building,
      room: room || "Not Specified",
      food: food || "Free Food!",
      time: time || "Not Specified",
      club: club || "Not Specified",
    };

    writeFoodInfo(foodId, foodData); // Write food data to Firebase
    const updatedFoodItems = [...foodItems, { foodId, ...foodData }];
    setFoodItems(updatedFoodItems); // Update local state

    // Clear form fields
    setBuilding('');
    setRoom('');
    setFood('');
    setTime('');
    setClub('');
  };

  // Function to fetch food items and clean up expired ones
  const fetchFoodItems = async () => {
    setLoading(true);
    await deleteExpiredEntries(); // Clean up expired entries
    const foodData = await getFoodInfo(); // Fetch current food items
    if (foodData) {
      const foodArray = Object.keys(foodData).map((key) => ({
        foodId: key,
        ...foodData[key],
      }));
      setFoodItems(foodArray);
    }
    setLoading(false);
  };

  // Fetch food items on component mount
  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Function to handle fetching entries from GroupMe
  const handleGroupMeFetch = async () => {
    await populateFirebaseFromGroupMe(); // Fetch new entries from GroupMe
    fetchFoodItems(); // Refresh the food list
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
          {/* Dropdown for building selection */}
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
        <button onClick={handleGroupMeFetch}>Fetch Food Entries from GroupMe</button>
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
