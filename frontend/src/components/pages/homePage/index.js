import { useState } from "react";
import DashboardImg from "../../../assets/png/dashboard.png";
import { UseAuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { registerUser } = UseAuthContext();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(
      formData.username,
      formData.email,
      formData.password
    );
    if (result.success) {
      navigate("/dashboard");
    } else {
      alert("Signup failed: " + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">ConnectDesk</h1>
        <div className="space-x-4">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-16 px-6">
        <p className="text-sm text-gray-600">
          Collaboration tool, made for everyone
        </p>
        <h2 className="text-4xl font-bold leading-snug mt-2">
          The Ultimate{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-transparent bg-clip-text">
            Workspace
          </span>{" "}
          for your use
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-4">
          Whether you're managing tasks, tracking progress, or communicating
          with your team, everything you need is in one place.
        </p>
        <img
          src={DashboardImg}
          alt="ConnectDesk Dashboard"
          className="mx-auto mt-10 rounded-xl shadow-xl max-w-5xl w-full"
        />
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 px-20">
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="font-semibold text-lg mb-2">Task Management</h3>
          <p className="text-gray-600">
            Easily create, assign, and track tasks across teams. Stay organized
            with due dates, priorities, and progress indicators—all in one
            place.
          </p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="font-semibold text-lg mb-2">
            Instant Team Communication
          </h3>
          <p className="text-gray-600">
            Chat with teammates in real time without switching tools. Share
            ideas, updates, and files instantly to keep everyone in sync.
          </p>
        </div>
      </section>

      {/* 🔧 Sign-Up Section (Integrated) */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-20 px-10 md:px-40 bg-gradient-to-r from-blue-50 to-purple-50 py-16 rounded-2xl">
  <div className="px-4 md:px-20">
    <h2 className="text-4xl leading-[3rem] font-bold mb-4 text-gray-800">
      Sign up to collaborate freely with your team!
    </h2>
    <p className="text-gray-600 text-base max-w-md">
      ConnectDesk provides you with powerful task management and seamless team communication — all in one place.
    </p>
  </div>

  <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-auto">
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="e.g. johndoe"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Create Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        Create Account
      </button>
    </form>
  </div>
</section>


      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-20 mb-6">
        © 2025 ConnectDesk. All rights reserved.
      </footer>
    </div>
  );
}
