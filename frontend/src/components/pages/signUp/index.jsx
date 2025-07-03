import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as GoogleIcon } from "../../../assets/svg/googleIcon.svg";
import { UseAuthContext } from "../../../context/AuthContext";

const Signup = () => {
  const { registerUser } = UseAuthContext();
  const [formData, setFormData] = useState({
    full_name: "",
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
      formData.full_name,
      formData.username,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate("/login");
    } else {
      alert("Signup failed: " + result.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9fb]">
      <h1 className="text-4xl font-bold mb-2">Create An Account</h1>
      <p className="mb-8 text-center text-gray-600 max-w-md">
        ConnectDesk is a platform where you can communicate, collaborate and do
        task management.
      </p>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg py-3 font-medium"
        >
          Sign Up
        </button>
        {/* <button
          type="button"
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg py-3 font-medium"
        >
          <span className="w-5 h-5 inline-block">
           <GoogleIcon className="w-5 h-5" />
          </span>
          Sign up with Google
        </button> */}
        <div className="text-center text-gray-500 text-sm mt-2">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
