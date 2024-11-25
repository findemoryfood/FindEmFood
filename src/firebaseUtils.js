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

export async function getUserInfo(identifier) {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, 'userInfo'));
    if (snapshot.exists()) {
      const users = snapshot.val();
      console.log('Retrieved users:', users); // Log all users for debugging

      // Iterate through each user to find a match by email or username
      for (let key in users) {
        if (users[key].email === identifier || users[key].username === identifier) {
          console.log('Matching user found:', users[key]);
          return users[key];  // Return user data if a match is found
        }
      }
    }
    console.log('No matching user found');
    return null;  // No matching user found
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export const getAllUsers = async () => {
  const database = getDatabase();
  const usersRef = ref(database, 'userInfo');

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return {};
  }
};