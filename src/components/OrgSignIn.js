// User sign up form, writing userInfo to database
import { writeUserInfo } from '../firebaseUtils'; // Import your Firebase function
import React, { useState } from 'react';

const UserSignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

    // Generates random ID
    const userId = Math.random().toString(36).substr(2, 9);

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
