// Component to display food events (optional)
// Manual foodInfo input form, writing foodInfo to database

import { writeFoodInfo } from '../firebaseUtils';
import React, { useState, useEffect } from 'react';

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]); // State to store food items, used to store/manage list of food items
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [food, setFood] = useState('');
  const [time, setTime] = useState('');
  const [club, setClub] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if any of the fields are undefined or empty
    if (!building || !room || !food || !time || !club) {
      alert("All fields are required!");
      return;
    }
  
    const foodId = Math.random().toString(36).substr(2, 9); // Generate a random ID
    
    // Create an object with the food data
    const foodData = {
      building,
      room,
      food,   
      time,
      club
    };
  
    // Write to Firebase database
    writeFoodInfo(foodId, foodData); 
  
    // Reset the form fields
    setBuilding('');
    setRoom('');
    setFood('');
    setTime('');
    setClub('');
  };

  return (
    <div>
      <h1>Food List</h1>
      
      <form onSubmit={handleSubmit}>
      <input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="Building" required />
      <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" required />
      <input value={food} onChange={(e) => setFood(e.target.value)} placeholder="Food" required />
      <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" required />
      <input value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club" required />
  <button type="submit">Add Food</button>
</form>
    </div>
  );
};
  
  export default FoodList;