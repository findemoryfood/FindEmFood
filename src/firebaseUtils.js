import { getDatabase, ref, set, update, remove, get, child } from 'firebase/database';
import { app } from './firebaseConfig';  // Import the initialized app

// Initialize Realtime Database
const database = getDatabase(app);

// Function to write food data to the database
export function writeFoodInfo(foodId, foodData) {
    return set(ref(database, 'foodInfo/' + foodId), {
      building: foodData.building,
      room: foodData.room,
      club: foodData.club,
      food: foodData.food
    });
  }

// Function to write user data to the database
export function writeUserInfo(userId, userData) {
  return set(ref(database, 'userInfo/' + userId), {
    username: userData.username,
    email: userData.email,
    password: userData.password
  });
}

export async function getFoodInfo() {
  const dbRef = ref(database);  // Get a reference to the database root
  try {
    // Get the foodInfo node
    const snapshot = await get(child(dbRef, 'foodInfo'));
    if (snapshot.exists()) {
      // Return the food data if it exists
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching food data:", error);
    return null;
  }
}