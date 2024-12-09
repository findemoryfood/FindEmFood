import { getDatabase, ref, set, remove, get, child } from 'firebase/database';
import { app } from './firebaseConfig'; // Import the initialized app

// Initialize Realtime Database
const database = getDatabase(app);

// Function to write food data to the database
export function writeFoodInfo(foodId, foodData) {
  const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  return set(ref(database, 'foodInfo/' + foodId), {
    ...foodData, // Include all existing fields in foodData
    entryDate: currentDate, // Add entryDate field
  });
}

// Function to write user data to the database
export function writeUserInfo(userId, userData) {
  return set(ref(database, 'userInfo/' + userId), {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });
}

// Function to fetch all food entries
export async function getFoodInfo() {
  const dbRef = ref(database, 'foodInfo');
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Return all food data
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching food data:", error);
    return null;
  }
}

// Function to fetch user information based on identifier (username or email)
export async function getUserInfo(identifier) {
  const dbRef = ref(database, 'userInfo');
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      console.log('Retrieved users:', users); // Log all users for debugging

      // Iterate through each user to find a match by email or username
      for (let key in users) {
        if (users[key].email === identifier || users[key].username === identifier) {
          console.log('Matching user found:', users[key]);
          return users[key]; // Return user data if a match is found
        }
      }
    }
    console.log('No matching user found');
    return null; // No matching user found
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Function to delete expired food entries
export const deleteExpiredEntries = async () => {
  const dbRef = ref(database, 'foodInfo');
  const currentDate = new Date().toISOString().split('T')[0]; // Get today's date

  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const foodEntries = snapshot.val();

      // Loop through entries and delete those not matching today's date
      for (const key in foodEntries) {
        if (foodEntries[key].entryDate !== currentDate) {
          await remove(ref(database, `foodInfo/${key}`));
          console.log(`Deleted expired entry with ID: ${key}`);
        }
      }
    } else {
      console.log("No food entries to check.");
    }
  } catch (error) {
    console.error("Error deleting expired entries:", error);
  }
};

// Function to fetch all user data
export const getAllUsers = async () => {
  const dbRef = ref(database, 'userInfo');
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return {};
  }
};

// Function to delete user data
export async function deleteUser(userId) {
  try {
    await remove(ref(database, `userInfo/${userId}`));
    console.log(`User with ID ${userId} has been deleted.`);
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw new Error("Failed to delete user.");
  }
}

// Function to delete a user entry by userId
export async function removeUserInfo(userId) {
  const dbRef = ref(database, `userInfo/${userId}`);
  try {
    await remove(dbRef);
    console.log(`User with ID ${userId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}

