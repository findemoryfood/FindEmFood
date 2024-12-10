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

## GPS Documentation

#### **Key Functionalities**

1. **Google Maps Integration**
   - Displays campus maps with location markers.
   - Supports route calculation and navigation bounds.

2. **Indoor and Outdoor Maps**
   - Dynamically renders floor plans for selected buildings.

3. **User Location Tracking**
   - Utilizes geolocation to set the user's current location.

4. **Settings Integration**
   - Supports dark mode and font size preferences.

5. **Food Event Notifications**
   - Popups notify users of new food events on campus.

### **Props**

|**Prop Name**|**Type**|**Description**|
| :-: | :-: | :-: |
|foodItems|Array|List of food event objects to display in the popup.|

-----
### **State Variables**

|**Variable**|**Type**|**Description**|
| :-: | :-: | :-: |
|isIndoor|boolean|Toggles between indoor and outdoor map views.|
|startLocation|string|Selected starting location for route calculation.|
|destinationLocation|string|Selected destination for route calculation.|
|userLocation|object|Stores user's geolocation (latitude and longitude).|
|showPopup|boolean|Controls visibility of the food event popup.|

-----
### **Methods**
#### *1. initMap()*
- Initializes the Google Map, sets its center, zoom, and restriction bounds.
- Adds location markers on the map using predefined coordinates.
#### *2. addLocationMarkers(map)*
- Adds markers for all predefined locations from the locations object.
- Each marker includes a title for easy identification.
#### *3. calculateAndDisplayRoute(start, destination)*
- Uses the Google Maps Directions API to compute and display the walking route between the start and destination points.
- Adjusts the map bounds to fit the calculated route.
#### *4. getUserLocation()*
- Fetches the user's current location via the browser's Geolocation API.
- Updates the userLocation state and handles errors gracefully.
#### *5. renderIndoorMap()*
- Renders the indoor map component or a floor plan image for the selected destination.
#### *6. toggleIndoorOutdoor()*
- Switches between indoor and outdoor map views.
#### *7. calculateBounds(center, radiusInMiles)*
- Calculates the bounds of the map based on a center point and radius.
#### *8. handleRouteCalculation()*
- Determines the start and destination points based on user input and calculates the route.
-----
### **Side Effects**
1. **Initialization of Google Maps**
   1. Adds a script dynamically to load the Google Maps API.
   1. Removes the script on component unmount to clean up resources.
1. **Geolocation Handling**
   1. Fetches user location whenever the "Use My Location" toggle is enabled.
1. **Food Event Popup**
   1. Monitors foodItems for changes and displays a popup when new events are available.
-----
### **Dependencies**
1. **Google Maps API**
   1. Requires an API key (REACT\_APP\_GOOGLE\_MAPS\_API\_KEY) to function.
1. **React-Switch**
   1. Provides a toggle switch UI for the "Use My Location" feature (npm install react-switch).

---

### Firebase Documentation

#### **Key Features**

1. **Firebase Initialization**
   - Configures and initializes Firebase services.
   
2. **Firebase Analytics**
   - Tracks app usage and interactions.

3. **Firebase Realtime Database**
   - Real-time synchronization for food and user records.

---

### **Firebase Configuration**
The firebaseConfig object contains the project-specific settings required to connect the app to Firebase services.

|**Key**|**Description**|
| :-: | :-: |
|apiKey|API key for authenticating requests to Firebase services.|
|authDomain|Domain for Firebase Authentication.|
|databaseURL|URL of the Firebase Realtime Database instance.|
|projectId|Unique identifier for the Firebase project.|
|storageBucket|URL for Firebase Cloud Storage associated with the project.|
|messagingSenderId|Sender ID for Firebase Cloud Messaging.|
|appId|Unique identifier for the Firebase app instance.|
|measurementId|Identifier for Firebase Analytics. Optional for older SDK versions.|

-----
### **Firebase Initialization**
#### *initializeApp(firebaseConfig)*
- Initializes the Firebase app with the provided configuration.
- Returns a Firebase app instance that can be used to interact with Firebase services.
#### *getAnalytics(app)*
- Retrieves the Analytics instance for the initialized Firebase app.
- Used for collecting and analyzing user interaction data.
#### *getDatabase(app)*
- Connects to the Firebase Realtime Database.
- Provides methods for reading from and writing to the database in real time.
-----
### **Firebase Realtime Database Integration**
#### *Import Statements*

|**Import**|**Description**|
| :-: | :-: |
|getDatabase|Initializes the database instance for interactions.|
|ref|Creates references to specific paths in the database.|
|set|Writes data to a specific database reference.|
|update|Partially updates a database record.|
|remove|Deletes data at a specific path in the database.|
|get, child|Fetches data from specific database nodes.|
#### *Database Initialization*
The module initializes the Firebase Realtime Database using the Firebase app instance imported from firebaseConfig:

### **Exports**

|**Export Name**|**Description**|
| :-: | :-: |
|database|Firebase Realtime Database instance for use in the application.|
|app|The initialized Firebase app instance.|

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
