import { getDatabase, ref, set, update, remove } from 'firebase/database';
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
    first: userData.first,
    last: userData.last,
    email: userData.email,
    password: userData.password
  });
}