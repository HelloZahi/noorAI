import { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

export default function Login() {
  const [user, setUser] = useState(null);

  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-emerald-700 text-center mb-6">🔒 NoorAI Login</h1>

        {!user ? (
          <button
            onClick={handleLogin}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-700">Welcome, <strong>{user.displayName}</strong></p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
