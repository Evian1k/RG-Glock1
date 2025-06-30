import React, { useState } from "react";

// Human-friendly authentication form: supports sign up, log in, password confirmation, and mode switching
export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Simulate a user database in localStorage
  const getUsers = () => JSON.parse(localStorage.getItem("users") || "{}")
  const saveUser = (username, password) => {
    const users = getUsers();
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
  };
  const checkUser = (username, password) => {
    const users = getUsers();
    return users[username] && users[username] === password;
  };
  const userExists = (username) => {
    const users = getUsers();
    return !!users[username];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username || !password || (mode === "signup" && !confirmPassword)) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup") {
      if (userExists(username)) {
        setError("Username already exists. Please log in or use another.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      saveUser(username, password);
      setSuccess("Sign up successful! You can now log in.");
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    // login
    if (!userExists(username)) {
      setError("User not found. Please sign up first.");
      return;
    }
    if (!checkUser(username, password)) {
      setError("Incorrect password.");
      return;
    }
    setError("");
    onLogin(username); // pass username to parent
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-xs flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {mode === "login" ? "Sign In" : "Sign Up"}
        </h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
        {mode === "signup" && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          />
        )}
        {error && <div className="text-red-500 text-xs text-center">{error}</div>}
        {success && <div className="text-green-600 text-xs text-center">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 mt-2 transition-colors"
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          {mode === "login" ? (
            <>
              Don't have an account?{' '}
              <button type="button" className="text-blue-600 hover:underline" onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="text-blue-600 hover:underline" onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>
                Log In
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
