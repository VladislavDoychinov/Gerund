import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

interface UserInfo {
  username: string;
  email: string;
  joinDate: string;
}

const EXAMPLE_USER: UserInfo = {
  username: "Demo User",
  email: "demo@example.com",
  joinDate: "March 2024",
};

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>(EXAMPLE_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/user");
        setUserInfo(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("Not logged in, showing example user");
        setUserInfo(EXAMPLE_USER);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Profile</h1>
        <Link to="/main" className="border px-3 py-1 rounded">
          Back
        </Link>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

          {!loading && (
            <>
              {!isLoggedIn && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
                  ℹ️ You're not logged in. Showing example user for debugging.
                </div>
              )}

              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-cornflowerblue rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl font-semibold">
                    {userInfo.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{userInfo.username}</h2>
                  <p className="text-gray-600">{userInfo.email}</p>
                  <p className="text-sm text-gray-500">Joined {userInfo.joinDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Account Type</h3>
                  <p className="text-gray-600">Customer</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Member Since</h3>
                  <p className="text-gray-600">{userInfo.joinDate}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Settings</h3>
                <div className="space-y-3">
                  <button className="w-full border p-3 rounded hover:bg-gray-50">
                    Edit Profile
                  </button>
                  <button className="w-full border p-3 rounded hover:bg-gray-50">
                    Change Password
                  </button>
                  <button className="w-full border p-3 rounded hover:bg-gray-50">
                    Privacy Settings
                  </button>
                  <button className="w-full border p-3 rounded text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
