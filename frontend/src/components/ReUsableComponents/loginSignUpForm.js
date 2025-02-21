import React, { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import Bg from '../../assets/svg/BG.svg';
import { Link } from "react-router-dom";

const LoginForm = ({login}) => {
  const [formData, setFormData] = useState({
    username:"",
    email:"",
    password:""
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
  };
  return (
    <div className="w-full  ">
    <div className="flex   ">
      <div className="flex justify-center items-center h-screen">
        <img
          src={Bg}
          alt="Background"
          className="h-[100vh] w-[90rem] object-cover "
        />
      </div>
      <div className="w-full flex justify-center items-center ">
        <div className="h-[580px] w-[580px]  ">
          <h1 className="text-left font-bold text-[3.3rem] mb-2 ">{ login ? "Sign In" : "Sign Up" }</h1>
          <p className="text-[1.2rem] w-[70%] text-gray-600 mb-2 ">
            ConnectDesk lets you organize tasks, track progress, and
            collaborate effortlessly!
          </p>
          <Box 
          sx={{ 
            margin: "0 auto", 
            display: "flex", 
            flexDirection: "column", 
            gap: 2,
            borderRadius: 2,
          }}
        >
         { !login &&
          <>
          <Typography variant="h6" >
            Username
          </Typography>
          <TextField
            type="text"
            name="username"
            value={formData.username}
            fullWidth
            placeholder="Enter your Username"
            variant="outlined"
            onChange={handleChange}
            required
          />
        </>}
          <Typography variant="h6" >
            Email address
          </Typography>
          <TextField
            type="email"
            name="email"
            value={formData.email}
            fullWidth
            placeholder="Enter your email"
            variant="outlined"
            onChange={handleChange}
            required
          />
    
          <Typography variant="h6" >
            Password
          </Typography>
          <TextField
            type="password"
            name="password"
            value={formData.password}
            fullWidth
            placeholder="Enter your password"
            variant="outlined"
            onChange={handleChange}
            required
          />
    
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
            />
            { login && <Link href="#" underline="hover" sx={{ fontSize: "0.875rem" }}>
              Forgot password?
            </Link>
          }
          </Box>
    
          <Button
          onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ padding: "16px 0", borderRadius: "8px", width:'25%' }}
          >
          {login ? "Login" : "Sign up"}
          </Button>
        </Box>
        {
        login ?  <p className="text-gray-600 mt-2 ">
            Don't have an account ?{" "}
            <Link to="/signup" className="text-blue-600 cursor-pointer ">
              {" "}
              Create an account{" "}
            </Link>{" "}
          </p>
          :
          <p className="text-gray-600 mt-2 ">
          Already have an account ?{" "}
          <Link to="/" className="text-blue-600 cursor-pointer ">
            {" "}
            Sign in{" "}
          </Link>{" "}
        </p>
        }
         
        </div>
      </div>
    </div>
  </div>

  );
};

export default LoginForm;
