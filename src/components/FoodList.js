import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useFoodList } from '../FoodListContext';
import { writeFoodInfo, getFoodInfo } from '../firebaseUtils';
import { populateFirebaseFromGroupMe } from '../groupmeUtils';
import locations from "../BuildingContent";
import '../styles/FoodList.css'

const buildingAcronyms = ["MSC", "ESC", "SAAC"];

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
    <div className= "foodlist-parent">
    <div className="foodlist-container">
    <div className="foodlist-card">
      <h1 className="foodlist-header">Food Hub</h1>
      

      {isLoggedIn ? (
        <>
          <div className="foodlist-buttons">
            <button onClick={() => setShowForm(!showForm)} className="foodlist-button">
              {showForm ? 'Hide Form' : 'Add Food'}
            </button>
            <button onClick={handleGroupMeFetch} disabled={loading} className="foodlist-button">
              {loading ? 'Fetching...' : 'Fetch Food Entries from GroupMe'}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="foodlist-form">
              <select value={building} onChange={(e) => setBuilding(e.target.value)} required className="dropdown-filter">
                <option value="">Select Building</option>
                {Object.keys(locations).map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Room"
                className="dropdown-filter"
              />
              <input
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="Food"
                className="dropdown-filter"
              />
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Time"
                className="dropdown-filter"
              />
              <input
                value={club}
                onChange={(e) => setClub(e.target.value)}
                placeholder="Club"
                className="dropdown-filter"
              />
              <button type="submit" className="foodlist-button">Add Food</button>
            </form>
          )}
        </>
      ) : (
        <div className="foodlist-buttons">
          <button onClick={() => navigate('/OrgSignIn')} className="foodlist-button">
            Log in to add food entries
          </button>
          <p style={{ fontSize: '0.9em', color: '#555' }}>
            Log in to add your own food entries to the list!
          </p>
        </div>
      )}

      <div className="foodlist-grid">
        {loading ? (
          <p>Loading food items...</p>
        ) : (
          foodItems
            .filter((item) => item.name && item.location)
            .map((item, index) => {
              const formattedRoom =
                item.room && item.room.toLowerCase().startsWith('room')
                  ? capitalizeWords(item.room.replace(/^room\s*/i, ''))
                  : capitalizeWords(item.room);
              return (
                <div key={index} className="food-card">
                  <p><strong>Food:</strong> {capitalizeWords(item.name)}</p>
                  <p><strong>Building:</strong> {formatBuildingName(item.location)}</p>
                  <p><strong>Room:</strong> {formattedRoom}</p>
                  <p><strong>Time:</strong> {capitalizeWords(item.time)}</p>
                  <p><strong>Club:</strong> {capitalizeWords(item.club)}</p>
                </div>
              );
            })
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default FoodList;
