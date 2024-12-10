# **Table of Contents**

1. [Getting Started](#Getting-Started)  
2. [Login Page](#Login-Page) 
3. [GPS Page](#GPS-Page)  
4. [Indoor Navigation](#Indoor-Navigation) 
5. [Food Hub](#Food-Hub)
6. [Settings](#Settings)  
7. [About Us](#About-Us)  
8. [Troubleshooting](#Troubleshooting)
9. [Deployment](#Deployment)

---

## **Getting Started**

Welcome to Find'Em Food\! This guide will help you navigate the web app to find free food events happening on campus. We’ve made it easy to sign up, log in, and get directions to food events, both outdoors and indoors.

Whether you're attending events with free food or adding your own, follow the instructions below for an enjoyable experience\!

---

## **Login Page**

### 

### **Sign Up**

* Use your Emory email to sign up for Find'Em Food.  
* Create a username, use your Emory email, and create and confirm your password.  
*  Password Requirements: Must be at least eight characters and include at least one special character.

### **Sign In**

* You can log in using either your Emory email or your username.  
* Enter your password to access your account.


**Note: Only logged-in users can add free food events to the app.**

---

## **GPS Page**

The GPS page helps you navigate to food events on campus. Follow these instructions for outdoor and indoor navigation:

### **Outdoor Navigation**

1. Select Starting Location:  
* Use My Location: Click the “Use My Location” toggle and allow location access.  
* Manual Selection: Select a building you are closest to from the dropdown list.  
2. Select Your Destination:  
* Pick an event from the destination dropdown.  
3. Calculate Route:  
* Click the “Calculate Route” button to generate directions to the event.  
4. Follow Directions:  
* Follow the provided route on the map to reach your chosen building.


### **Indoor Navigation**

1. Once you arrive at the building, click “Switch to Indoor Map” to enable indoor navigation.  
2. Select Starting Point:  
* Choose the closest room or entrance as your starting point.  
3. Select Your Destination:  
* Choose the free food room destination.

---

## **Food Hub**

View all the current food events happening around campus. Here's how to use this page:

### **Fetch Food Entries**

-  Click “Fetch Food Entries from GroupMe” to get the most updated list of free food events.

###  **Add a Free Food Event Manually**

1. Make sure that you are logged in.  
2. Enter the following details:  
- Building: Select the building where the event is happening.  
- Room Information: Specify the room number.  
- Food Items: Mention the food available.  
- Time and Club: Provide the time and the club hosting the event.  
3. Click “Add Food” to add your event to the list.

 **Note: Manually added events will automatically appear on this page.**

---

## **Settings**

The Settings page allows you to personalize the app to your preferences.

### **Dark Mode**

- Activate Dark Mode: Click the “Dark Mode” checkbox to switch between light and dark themes.

###  **Use My Location**

- This option allows the GPS to automatically set your current position as the starting point for navigation.  
- Enable or disable this from the GPS Page for convenience.

---

## **About Us**

Want to learn more about our mission?

* Navigate to the About Us page to learn about the purpose behind Find'Em Food.  
* Slider Feature: Click through the slider to learn why we created Find'Em Food, how it works, and quick links to log in or sign up.  
* Below the slider, you will also find details about our team members\!

---

## **Troubleshooting**

Here are some common issues you might encounter while using Find'Em Food, along with possible solutions:

 I Can't Access My Location

* Solution: Ensure that you’ve allowed location access in your browser settings. If the issue persists, manually select a nearby building.

 I Forgot My Password

* Solution: Click the “Forgot Password” link on the login page and follow the instructions to reset it.

 Events Aren't Showing Up

* Solution: Click "Fetch Food Entries from GroupMe" for the most updated list. 

---

# Deployment
This document outlines the steps required to deploy FindEmFood to the staging and production environments. It also covers prerequisites, environment configurations, and troubleshooting guidelines. The goal is to ensure a smooth, repeatable deployment process.


# Pre-Requisties
---
- React (Frontend framework for building the UI)
- Node.js (JavaScript runtime for development and build processes)
- Google Maps API (Provides location services)

# Environment Variables
---
The application uses environment variables stored in .env files

#### Required variables:
- `REACT_APP_GOOGLE_MAPS_API_KEY`: API key for Google Maps services.
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID for monitoring user engagement.

Clone the project from the repository:
   ```plaintext
   git clone https://github.com/findemoryfood/FindEmFood.git
   cd FindEmFood
  ```

Set up the environment variables in the .env file.

#### Example `.env` file:
```plaintext
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

# Dependencies
```plaintext
npm install
npm install react-icons
npm install axios
npm install react-router-dom
npm install react-scroll-parallax
npm install firebase
```

Test the application locally
```plaintext
npm start
```

# Troubleshooting
---
Build Errors:

- Verify all dependencies are installed: npm install.
- Check .env variables for typos or missing values.
- API Errors:
    Ensure the Google Maps API key is valid and has sufficient quotas.
    Verify network requests to the backend API.
- UI Issues:
    Reload the page.
    Inspect the browser console for errors.
 
