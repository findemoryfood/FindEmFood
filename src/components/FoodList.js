import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useFoodList } from '../FoodListContext';
import { writeFoodInfo, getFoodInfo } from '../firebaseUtils';
import { populateFirebaseFromGroupMe } from '../groupmeUtils';
import locations from "../BuildingContent";

// List of building acronyms to display in all caps
const buildingAcronyms = ["MSC", "ESC", "SAAC"];

// Helper function to capitalize each word except for "AM" and "PM"
const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => {
      if (word.toLowerCase() === 'am' || word.toLowerCase() === 'pm') return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// Helper function to format building names with acronyms
const formatBuildingName = (building) => {
  if (!building) return '';
  const upperCased = building.toUpperCase();
  return buildingAcronyms.includes(upperCased) ? upperCased : capitalizeWords(building);
};

const FoodList = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { foodItems, setFoodItems, fetchFoodItems } = useFoodList();
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [food, setFood] = useState('');
  const [time, setTime] = useState('');
  const [club, setClub] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
      name: capitalizeWords(food || "Free Food!"),
      location: formatBuildingName(building),
      room: capitalizeWords(room || ""),
      time: capitalizeWords(time || ""),
      club: capitalizeWords(club || ""),
      entryDate: new Date().toISOString().split('T')[0],
    };

    try {
      await writeFoodInfo(foodId, foodData);
      setFoodItems((prevItems) => [...prevItems, { foodId, ...foodData }]);
      setBuilding('');
      setRoom('');
      setFood('');
      setTime('');
      setClub('');
      setShowForm(false);
    } catch (error) {
      console.error('Error writing food data to Firebase:', error);
      alert('An error occurred while adding the food entry. Please try again.');
    }
  };

  const handleGroupMeFetch = async () => {
    try {
      setLoading(true);
      await populateFirebaseFromGroupMe();
      fetchFoodItems();
    } catch (error) {
      console.error('Error fetching entries from GroupMe:', error);
      alert('An error occurred while fetching entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  return (
    <div>
      <h1>Food List</h1>

      {isLoggedIn ? (
        <>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Add Food'}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit}>
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
        </>
      ) : (
        <div>
          <button onClick={() => navigate('/OrgSignIn')} style={{ cursor: 'pointer' }}>
            Log in to add food entries
          </button>
          <p style={{ fontSize: '0.9em', color: '#555' }}>
            Log in to add your own food entries to the list!
          </p>
        </div>
      )}

      <div>
        <button onClick={handleGroupMeFetch} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Food Entries from GroupMe'}
        </button>
      </div>

      <div>
        {loading ? (
          <p>Loading food items...</p>
        ) : (
          <ul>
            {foodItems
              .filter((item) => item.name && item.location) // Exclude invalid entries like `init`
              .map((item, index) => {
                const formattedRoom =
                  item.room && item.room.toLowerCase().startsWith('room')
                    ? capitalizeWords(item.room.replace(/^room\s*/i, ''))
                    : capitalizeWords(item.room);
                return (
                  <li key={index}>
                    {capitalizeWords(item.name)}
                    {item.location && ` - ${formatBuildingName(item.location)}`}
                    {formattedRoom && `, Room: ${formattedRoom}`}
                    {item.time && `, Time: ${capitalizeWords(item.time)}`}
                    {item.club && `, Club: ${capitalizeWords(item.club)}`}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FoodList;
