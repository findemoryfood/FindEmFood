**FindEmFood**

Find Em Food is a mobile app focused on connecting Emory students with food resources on campus. Utilizing the user’s location, the app would connect hungry students with free food opportunities on campus around them, showing where these events are and how to get there. Information on free food opportunities would be user submitted from Emory-verified accounts, giving a space to connect event organizers (with excess food) and curious students.


**Technical Documentation for FindEmFood** 

**Overview**

App.js is the main component for a React application that uses **React Router** for navigation and **Context API** for managing application-wide settings. 

The GPS component is a comprehensive navigation tool integrated with Google Maps, designed to assist users in finding routes between campus buildings and locations. It supports outdoor and indoor maps, toggles between light and dark themes, and includes features for food event popups.

This module initializes and configures a Firebase application for use in a web app. It includes setup for Firebase Analytics and Firebase Realtime Database. The configuration uses the Firebase JavaScript SDK. It supports operations for writing, updating, deleting, and fetching data for food and user-related records.

This App also facilitates the automation of fetching messages from GroupMe, parsing them using OpenAI, and storing the structured data in Firebase Realtime Database. It includes utilities for message processing, AI-powered parsing, and database population.

**Application documentation**
### **Key Features**
- **Navigation**: Implements a NavBar for dynamic user-based navigation.
- **Routing**: Uses react-router-dom to handle multiple page routes.
- **State Management**: Utilizes useState for local state and SettingsContext for global settings.
- **Dynamic UI**: Adjusts layouts based on user login status and settings (e.g., dark mode).
- **Modular Components**: Integrates several modular components for specific functionality.
-----
**File Dependencies**

- **Assets**:
  - logo\_v2.png: Logo used in the application, imported from ./assets/.
- **Styles**:
  - App.css: CSS file for application-wide styling.
- **Components**:
  - NavBar: Navigation bar, dynamically changes based on user login state.
  - GPS: Displays food item-related information.
  - FoodList: Allows users to manage and view a list of food items.
  - OrgSignIn: Handles organizational user login/logout.
  - AboutUs: Provides information about the organization.
  - Settings: Interface for managing application settings.
- **Contexts**:
  - SettingsProvider: Provides settings (like dark mode) throughout the app.
-----
**Application Structure**

**State Management**

1. **foodItems**:
   1. **Type**: Array
   1. **Description**: Stores a list of food items, shared across multiple components.
   1. **Setter**: setFoodItems
1. **isLoggedIn**:
   1. **Type**: Boolean
   1. **Description**: Tracks user login status.
   1. **Setter**: setIsLoggedIn
1. **user**:
   1. **Type**: Object or null
   1. **Description**: Holds logged-in user information.
   1. **Setter**: setUser

**Context Integration**

- **Settings Context**:
  - Accessed via useSettings().
  - Provides global settings like darkMode.
-----
**Component Description**

**NavBar**

- **Props**:
  - isLoggedIn: Boolean indicating user login status.
  - user: Logged-in user information.
  - onLogout: Callback to log out the user.

**GPS**

- **Props**:
  - foodItems: Array of food items passed to this component for display.

**FoodList**

- **Props**:
  - foodItems: Array of food items to display/manage.
  - setFoodItems: Function to update the list of food items.
  - isLoggedIn: Controls visibility of certain actions based on login status.

**OrgSignIn**

- **Props**:
  - onLogin: Callback to log in a user.
  - isLoggedIn: Indicates login state.
  - user: Currently logged-in user data.
  - onLogout: Callback to log out the user.

**AboutUs**

- Static informational component.

**Settings**

- **Description**: Allows users to modify app settings.
-----
**Routing Table**

|**Path**|**Component**|**Description**|
| :-: | :-: | :-: |
|/|GPS|Default route, displays food items via GPS.|
|/GPS|GPS|Alternate route for GPS.|
|/FoodList|FoodList|Allows users to manage and view food items.|
|/OrgSignIn|OrgSignIn|Login page for organizational users.|
|/AboutUs|AboutUs|Information about the organization.|
|/Settings|Settings|Allows modification of app settings.|

-----
**Functions**

**handleLogin(userData)**

- **Parameters**:
  - userData: Object containing user details.
- **Description**: Logs in the user by updating user and isLoggedIn.

**handleLogout()**

- **Parameters**: None.
- **Description**: Logs out the user by resetting user and isLoggedIn.
-----
## **GPS documentation**
### **Key Functionalities**
1. **Google Maps Integration**
   1. Displays a Google Map with markers for predefined locations.
   1. Supports route calculation using the Google Maps Directions API.
   1. Implements a restriction to keep map navigation within a defined area.
1. **Indoor and Outdoor Maps**
   1. Switch between outdoor Google Maps and custom indoor maps for specific buildings.
   1. Render floor plans dynamically based on user-selected locations.
1. **User Location Tracking**
   1. Enables geolocation to use the user's current location as the starting point.
   1. Offers fallback to manual selection if geolocation fails.
1. **Settings Integration**
   1. Utilizes a settings context to remember preferences like dark mode and geolocation usage.
1. **Food Event Notifications**
   1. Displays a popup if new food events are available on campus, listing event details like location, time, and hosting club.
-----
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


## **Firebase documentation**
### **Key Features**
1. **Firebase Initialization**
   1. Configures and initializes a Firebase app using project-specific credentials.
1. **Firebase Analytics**
   1. Tracks user interactions and events for analytics purposes.
1. **Firebase Realtime Database**
   1. Provides a connection to the Firebase Realtime Database for real-time data synchronization.
   1. Allows the ability to write and fetch data, and query users by username or email
-----
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

## **GroupMe and Firebase Integration Documentation**
### **Key Features**
1. **GroupMe Integration**
   1. Fetch messages from a GroupMe group.
1. **Message Grouping**
   1. Organize messages by user and proximity in time.
1. **AI-Powered Data Parsing**
   1. Use OpenAI's GPT-3.5 Turbo to format unstructured messages into structured JSON.
1. **Firebase Integration**
   1. Save parsed data into the foodInfo node in Firebase.
-----
### **Core Components**
#### *1. GroupMe API Integration*
##### fetchGroupMeMessages()
- **Description**: Fetches the latest messages from a specific GroupMe group.
- **API Used**: https://api.groupme.com/v3/groups/:GROUP\_ID/messages
- **Returns**: An array of messages.
### **2. Message Grouping**
#### *Function: groupMessagesByUser(messages)*
- **Description**: Groups messages by user and clusters them if they are sent within 5 minutes of each other.
- **Returns**: An array of grouped messages.
### **3. AI-Powered Data Parsing**
#### *Function: formatWithOpenAI(messages)*
- **Description**:
  Uses OpenAI's GPT-3.5 Turbo to parse grouped messages into structured JSON. Combines messages from a group into a single entry and extracts fields such as building, food, room, time, and club.
- **Returns**: Structured JSON data.
### **4. Firebase Integration**
#### *Function: populateFirebaseFromGroupMe()*
- **Description**:
  Combines all functionality:
  - Fetches messages from GroupMe.
  - Groups messages by user and proximity.
  - Parses grouped messages into structured JSON using OpenAI.
  - Saves the structured data into the Firebase foodInfo node.
- **Firebase Write Function**: writeFoodInfo(foodId, foodData)

**Environment Variables**

- GROUPME\_TOKEN: API token for GroupMe.
- GROUPME\_GROUP\_ID: ID of the GroupMe group to fetch messages from.
- OPENAI\_API\_KEY: API key for OpenAI GPT-3.5 Turbo.




