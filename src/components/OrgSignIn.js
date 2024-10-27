// User sign up form, writing userInfo to database
<<<<<<< HEAD
//import functions to write user infromation to the database
//To do: make email a valid entry if ends with emory.edu
import { writeUserInfo} from '../firebaseUtils';
import React, { useState } from 'react';

const UserSignUp = () => {
    const [username, setUsername]= userState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword]= useState('');
=======
import { writeUserInfo } from '../firebaseUtils'; // Import your Firebase function
import React, { useState } from 'react';

const UserSignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
>>>>>>> 8be8b1270211e5efd89c75bbe5f2def6f8913fb1

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check that fields are not empty
    if (!username || !email || !password || !confirmPassword) {
      alert('All fields are required');
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

<<<<<<< HEAD
        //Check that email ends with "emory.edu"
        const emailDomain = email.split('@').pop();
        if (emailDomain != "emory.edu"){
            alert("Email must be an emory email");
            return;
        }
        
        //checking passwords match
        if (password !== confirmPassword){
            alert("Passwords do not match");
        return;
        }
        //Generates random ID
        const userId= Math.random().toString(36).substr(2, 9);
=======
    // Generates random ID
    const userId = Math.random().toString(36).substr(2, 9);
>>>>>>> 8be8b1270211e5efd89c75bbe5f2def6f8913fb1

    // Object with user data
    const userData = { username, email, password };

    // Write user info to Firebase
    writeUserInfo(userId, userData);

    // Reset form fields
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div>
      <h1>User Sign Up</h1>
      {/* Form to sign up users */}
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default UserSignUp;
