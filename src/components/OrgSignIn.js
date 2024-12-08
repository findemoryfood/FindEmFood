import React, { useState } from 'react'; 
import { writeUserInfo, getAllUsers, removeUserInfo } from '../firebaseUtils';
import { useAuth } from '../AuthContext';

const OrgSignIn = () => {
  const { user, isLoggedIn, login, logout } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordChange, setCurrentPasswordChange] = useState(''); // Separate state for Change Password
  const [currentPasswordDelete, setCurrentPasswordDelete] = useState(''); // Separate state for Delete Account
  const [newPassword, setNewPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');

  const toggleForm = () => setShowLogin(!showLogin);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert('All fields are required');
      return;
    }

    if (!email.endsWith('@emory.edu')) {
      alert('Please use an @emory.edu email to sign up.');
      return;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long and include at least one special character.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const allUsers = await getAllUsers();
      const emailExists = Object.values(allUsers).some((user) => user.email === email);

      if (emailExists) {
        alert('An account with this email already exists.');
        return;
      }

      const userId = Math.random().toString(36).substr(2, 9);
      const userData = { username, email, password };
      await writeUserInfo(userId, userData);

      alert('Sign-up successful! Please log in.');
      setShowLogin(true);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('An error occurred during sign-up. Please try again later.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      alert('Both fields are required');
      return;
    }

    try {
      const allUsers = await getAllUsers();
      const userEntry = Object.entries(allUsers).find(
        ([_, user]) => user.email === usernameOrEmail || user.username === usernameOrEmail
      );

      if (userEntry && userEntry[1].password === password) {
        alert('Login successful');
        login({ ...userEntry[1], id: userEntry[0] }); // Include the unique identifier in the user object
        setUsernameOrEmail('');
        setPassword('');
      } else {
        alert('Invalid username/email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPasswordChange || !newPassword) {
      alert('Both current and new passwords are required.');
      return;
    }

    try {
      if (user.password === currentPasswordChange) {
        // Update the existing entry with the new password
        const updatedUserData = { ...user, password: newPassword };

        await writeUserInfo(user.id, updatedUserData); // Use `writeUserInfo` with the existing ID

        alert('Password changed successfully. You will be logged out. Please log in with your new password.');
        logout(); // Log the user out to ensure they re-authenticate
        setCurrentPasswordChange('');
        setNewPassword('');
      } else {
        alert('Current password is incorrect.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing the password. Please try again.');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!currentPasswordDelete) {
      alert('Please enter your current password to delete your account.');
      return;
    }

    try {
      if (user.password === currentPasswordDelete) {
        // Delete the user's entry from Firebase
        await removeUserInfo(user.id);

        logout(); // Log the user out
        alert('Account deleted successfully.');
        setCurrentPasswordDelete('');
      } else {
        alert('Current password is incorrect.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting the account. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    // Reset all input fields
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCurrentPasswordChange('');
    setCurrentPasswordDelete('');
    setNewPassword('');
    setUsernameOrEmail('');
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>User Profile</h1>
          <p>You are logged in as <strong>{user.username}</strong>.</p>
          <form onSubmit={handleChangePassword}>
            <h2>Change Password</h2>
            <input
              type="password"
              value={currentPasswordChange}
              onChange={(e) => setCurrentPasswordChange(e.target.value)}
              placeholder="Current Password"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <button type="submit">Change Password</button>
          </form>
          <form onSubmit={handleDeleteAccount}>
            <h2>Delete Account</h2>
            <input
              type="password"
              value={currentPasswordDelete}
              onChange={(e) => setCurrentPasswordDelete(e.target.value)}
              placeholder="Current Password"
              required
            />
            <button type="submit">Delete Account</button>
          </form>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div>
          <h1>{showLogin ? 'User Login' : 'User Sign Up'}</h1>
          <form onSubmit={showLogin ? handleLogin : handleSignUp}>
            {!showLogin ? (
              <>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (@emory.edu)"
                  required
                />
              </>
            ) : (
              <input
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Email or Username"
                required
              />
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {!showLogin && (
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            )}
            <button type="submit">{showLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <button onClick={toggleForm}>
            {showLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrgSignIn;