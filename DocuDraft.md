# FindEmFood

FindEmFood is a mobile app focused on connecting Emory students with food resources on campus. Utilizing the user’s location, the app connects hungry students with free food opportunities on campus, displaying where these events are and how to get there. Information on free food opportunities is user-submitted from Emory-verified accounts, creating a space to connect event organizers (with excess food) and curious students.

---

# Table of Contents

1. [Application Documentation](#Application-Documentation)
2. [GPS Documentation](#GPS-Documentation)
3. [Firebase Documentation](#Firebase-Documentation)
4. [GroupMe Documentation](#GroupMe-and-Firebase-Integration-Documentation)

---

## Technical Documentation for FindEmFood

### Overview

1. **Main Application**:
   - `App.js` is the central component of a React application that employs React Router for navigation and Context API for managing application-wide settings.

2. **GPS Component**:
   - A navigation tool integrated with Google Maps for locating routes between campus buildings and events.
   - Features indoor and outdoor maps, dark/light themes, and food event popups.

3. **Firebase Integration**:
   - Initializes Firebase for analytics and Realtime Database operations.
   - Includes capabilities for managing food and user data.

4. **GroupMe Integration**:
   - Automates fetching messages, parsing them using OpenAI, and storing structured data in Firebase.

---

## Application Documentation

### Key Features

- **Navigation**: Implements a dynamic NavBar.
- **Routing**: Uses `react-router-dom` for multiple page routes.
- **State Management**: Combines `useState` for local state and `SettingsContext` for global settings.
- **Dynamic UI**: Adapts layouts based on user login status and settings (e.g., dark mode).
- **Modular Components**: Integrates specialized components for functionality.

---

### File Dependencies

#### **Assets**
- `logo_v2.png`: Application logo (imported from `./assets/`).

#### **Styles**
- `App.css`: Global CSS for the application.

#### **Components**
- **`NavBar`**: Dynamic navigation bar that adjusts based on user state.
- **`GPS`**: Displays food-related information using maps.
- **`FoodList`**: Manages and displays a list of food items.
- **`OrgSignIn`**: Handles login/logout for organizational users.
- **`AboutUs`**: Provides organizational details.
- **`Settings`**: Manages app settings.

#### **Contexts**
- **`SettingsProvider`**: Provides global settings like dark mode.

---

### Application Structure

#### **State Management**

1. `foodItems`:
   - **Type**: Array
   - **Description**: List of food items shared across components.
   - **Setter**: `setFoodItems`

2. `isLoggedIn`:
   - **Type**: Boolean
   - **Description**: Tracks user login status.
   - **Setter**: `setIsLoggedIn`

3. `user`:
   - **Type**: Object or null
   - **Description**: Contains logged-in user details.
   - **Setter**: `setUser`

#### **Context Integration**
- **Settings Context**:
  - Accessed via `useSettings()`.
  - Provides settings like `darkMode`.

---

### Component Description

#### **NavBar**
- **Props**:
  - `isLoggedIn`: Indicates user login status.
  - `user`: Details of the logged-in user.
  - `onLogout`: Logs out the user.

#### **GPS**
- **Props**:
  - `foodItems`: List of food items for display.

#### **FoodList**
- **Props**:
  - `foodItems`: Manages the list of food items.
  - `setFoodItems`: Updates the food list.
  - `isLoggedIn`: Controls certain actions based on login status.

#### **OrgSignIn**
- **Props**:
  - `onLogin`: Logs in the user.
  - `isLoggedIn`: Indicates login state.
  - `user`: Logged-in user details.
  - `onLogout`: Logs out the user.

#### **AboutUs**
- Static component with organizational information.

#### **Settings**
- Interface for app settings management.

---

### Routing Table

| Path         | Component   | Description                                             |
|--------------|-------------|---------------------------------------------------------|
| `/`          | `GPS`       | Default route, displays food items.                    |
| `/GPS`       | `GPS`       | Alternate route for GPS.                               |
| `/FoodList`  | `FoodList`  | Manage and view food items.                            |
| `/OrgSignIn` | `OrgSignIn` | Login page for organizational users.                   |
| `/AboutUs`   | `AboutUs`   | Provides information about the organization.           |
| `/Settings`  | `Settings`  | Modify application settings.                           |

---

## GPS Component Documentation

#### **Key Functionalities**

1. **Google Maps Integration**
   - Displays campus maps with location markers.
   - Supports route calculation and navigation bounds.

2. **Indoor and Outdoor Maps**
   - Dynamically renders floor plans for selected buildings.

3. **User Location Tracking**
   - Utilizes geolocation to set the user's current location.

4. **Settings Integration**
   - Supports dark mode and location preferences.

5. **Food Event Notifications**
   - Popups notify users of new food events on campus.

---

### Firebase Documentation

#### **Key Features**

1. **Firebase Initialization**
   - Configures and initializes Firebase services.
   
2. **Firebase Analytics**
   - Tracks app usage and interactions.

3. **Firebase Realtime Database**
   - Real-time synchronization for food and user records.

#### **Configuration**
- **firebaseConfig** object contains:
  - `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `appId`, etc.

#### **Initialization**
- **`initializeApp(firebaseConfig)`**: Sets up Firebase.
- **`getDatabase(app)`**: Connects to the Realtime Database.

#### **Realtime Database Integration**
- **Import Methods**:
  - `ref`, `set`, `update`, `remove`, `get`, `child`.

---

### Functions

1. **`handleLogin(userData)`**
   - Logs in the user and updates the state.

2. **`handleLogout()`**
   - Logs out the user by resetting state.

---

### Dependencies

- **Google Maps API**:
  - Requires an API key (`REACT_APP_GOOGLE_MAPS_API_KEY`).

- **React-Switch**:
  - Provides a toggle switch UI.

---

# GroupMe and Firebase Integration Documentation

---

## Key Features

1. **GroupMe Integration**
   - Fetches messages from a GroupMe group.

2. **Message Grouping**
   - Organizes messages by user and their proximity in time.

3. **AI-Powered Data Parsing**
   - Utilizes OpenAI's GPT-3.5 Turbo to format unstructured messages into structured JSON.

4. **Firebase Integration**
   - Saves parsed data into the `foodInfo` node in Firebase.

---

## Core Components

### GroupMe API Integration

#### **Function**: `fetchGroupMeMessages()`
- **Description**: Fetches the latest messages from a specific GroupMe group.
- **API Used**: 
  ```plaintext
  https://api.groupme.com/v3/groups/:GROUP_ID/messages

### Message Grouping

#### Function: `groupMessagesByUser(messages)`

- **Description**: Groups messages by user and clusters them if they are sent within 5 minutes of each other.
- **Returns**: An array of grouped messages.

---

### AI-Powered Data Parsing

#### Function: `formatWithOpenAI(messages)`

- **Description**:  
  Uses OpenAI's GPT-3.5 Turbo to parse grouped messages into structured JSON. Combines messages from a group into a single entry and extracts fields such as `building`, `food`, `room`, `time`, and `club`.
- **Returns**: Structured JSON data.

---

### Firebase Integration

#### Function: `populateFirebaseFromGroupMe()`

- **Description**:  
  Combines all functionality:
  1. Fetches messages from GroupMe.
  2. Groups messages by user and proximity.
  3. Parses grouped messages into structured JSON using OpenAI.
  4. Saves the structured data into the Firebase `foodInfo` node.

- **Firebase Write Function**: `writeFoodInfo(foodId, foodData)`

---

## Environment Variables

- **`GROUPME_TOKEN`**: API token for GroupMe.
- **`GROUPME_GROUP_ID`**: ID of the GroupMe group to fetch messages from.
- **`OPENAI_API_KEY`**: API key for OpenAI GPT-3.5 Turbo.
