import React, { useState } from "react"; // Importing React and useState hook
import { useDispatch, useSelector } from "react-redux"; // Importing useDispatch and useSelector hooks from react-redux
import {
  setName,
  setEmail,
  setPassword,
  setRememberMe,
  resetForm,
  setFeedbackMessage,
  registerUser,
  googleLogin,
} from "./features/signupSlice"; // Importing Redux actions from signupSlice
import logo from "./assets/Logo.png"; // Importing logo image
import google from "./assets/google.png"; // Importing Google logo image
import background from "./assets/Image.png"; // Importing background image
import WebFont from "webfontloader"; // Importing WebFontLoader
import { useGoogleLogin } from "@react-oauth/google"; // Importing useGoogleLogin hook from @react-oauth/google

WebFont.load({
  google: {
    families: ["Bebas Neue", "Urbanist", "Cabin"], // Loading Google fonts
  },
});

const App = () => {
  const dispatch = useDispatch(); // Initializing useDispatch hook
  const { name, email, password, rememberMe, feedbackMessage } = useSelector(
    (state) => state.signup
  ); // Fetching state variables from Redux store
  const [passwordStrength, setPasswordStrength] = useState(""); // Initializing password strength state
  const [passwordError, setPasswordError] = useState(""); // Initializing password error state
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Initializing password focus state

  const handleSubmit = (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    const strength = evaluatePasswordStrength(password); // Evaluating password strength
    const isUnique = checkPasswordUniqueness(password); // Checking password uniqueness
    if (strength === "Weak" || !isUnique) {
      // Validating password strength and uniqueness
      setPasswordError("Please choose a stronger and unique password.");
      return;
    }
    // Dispatching registerUser action with user data
    dispatch(registerUser({ name, email, password, rememberMe }))
      .unwrap()
      .then(() => dispatch(resetForm())) // Resetting form on successful registration
      .catch(
        (error) =>
          dispatch(setFeedbackMessage(error.message || "Registration failed!")) // Setting feedback message on registration failure
      );
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6)
      return "Weak"; // Evaluating password strength based on length
    else if (password.length >= 6 && password.length < 12) return "Moderate";
    else return "Strong";
  };

  const checkPasswordUniqueness = (password) => {
    const commonPasswords = [
      "123456",
      "password",
      "123456789",
      "12345678",
      "12345",
    ]; // Common passwords to check against
    return !commonPasswords.includes(password); // Checking if password is unique
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value; // Getting new password from input
    dispatch(setPassword(newPassword)); // Dispatching setPassword action
    const strength = evaluatePasswordStrength(newPassword); // Evaluating new password strength
    setPasswordStrength(strength); // Updating password strength state
    setPasswordError(""); // Resetting password error
  };

  // Handling Google login using useGoogleLogin hook
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login successful, tokenResponse:", tokenResponse); // Logging token response on successful Google login

      const code = tokenResponse.code; // Getting authorization code from token response
      console.log("Authorization code:", code); // Logging authorization code

      if (!code) {
        console.error(
          "Authorization code is empty, unable to proceed with Google login."
        ); // Logging error if authorization code is empty
        dispatch(
          setFeedbackMessage(
            "Google login failed: Empty authorization code received."
          )
        ); // Setting feedback message on empty authorization code
        return;
      }

      // Dispatching googleLogin action with authorization code
      dispatch(googleLogin({ code }))
        .unwrap()
        .then(() => {
          dispatch(setFeedbackMessage("Google login successful!")); // Setting feedback message on successful Google login
        })
        .catch((error) => {
          console.error("Google login error:", error); // Logging Google login error
          dispatch(setFeedbackMessage(error.message || "Google login failed!")); // Setting feedback message on Google login failure
        });
    },
    onError: (error) => {
      console.error("Google login failed:", error); // Logging Google login failure
      dispatch(setFeedbackMessage("Google login failed!")); // Setting feedback message on Google login failure
    },
    flow: "auth-code", // Google OAuth2 flow type
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="flex flex-col lg:flex-row w-full lg:w-5/6 max-w-5xl bg-white shadow-lg rounded-[40px] overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 bg-white relative">
          <div className="absolute top-8 left-8">
            <img src={logo} alt="Logo" className="w-28 h-auto" />
          </div>
          <div className="mt-24 w-4/5 lg:w-3/4 text-center">
            <h2 className="text-5xl font-normal mb-2 Bebas">SIGN UP</h2>
            <p className="text-gray-600 mb-12 Urbanist">
              Create an account to get started.
            </p>
            <button
              className="flex items-center justify-center w-full py-2 mb-6 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={login}
            >
              <img className="w-5 h-5 mr-2" src={google} alt="Google Logo" />
              <p className="font-cabin text-xs font-extralight">
                Continue With Google
              </p>
            </button>
            <div className="flex items-center justify-center w-full mb-6">
              <hr className="w-1/4 sm:w-1/5 border-t border-gray-300 my-0 mr-2" />
              <span className="px-2 text-gray-400 text-sm">Or</span>
              <hr className="w-1/4 sm:w-1/5 border-t border-gray-300 my-0 ml-2" />
            </div>
            <form className="w-full flex flex-col mb-4" onSubmit={handleSubmit}>
              <input
                id="name"
                name="name"
                autoComplete="name"
                className="px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-cabin"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => dispatch(setName(e.target.value))}
                required
                aria-label="Name"
              />
              <input
                id="email"
                name="email"
                autoComplete="email"
                className="px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-cabin"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
                required
                aria-label="Email"
              />
              <input
                id="password"
                name="password"
                autoComplete="new-password"
                className="px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-cabin"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                aria-label="Password"
              />
              <p className="text-xs text-gray-600 font-cabin mb-3">
                {passwordError ? (
                  <span className="text-red-600">{passwordError}</span>
                ) : isPasswordFocused ? (
                  `Password strength: ${passwordStrength}`
                ) : null}
              </p>
              <div className="flex items-center mb-4">
                <input
                  id="remember-me"
                  name="remember-me"
                  autoComplete="off"
                  className="mr-2"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => dispatch(setRememberMe(e.target.checked))}
                />
                <label
                  className="text-gray-600 text-sm font-cabin"
                  htmlFor="remember-me"
                >
                  Remember Me
                </label>
              </div>
              <button
                className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800"
                type="submit"
              >
                <p className="text-sm m-0">Register</p>
              </button>
            </form>
            <p className="text-xs text-gray-600 font-cabin mb-4">
              {feedbackMessage}
            </p>
            <p className="text-gray-600 mb-12 Urbanist">
              Already have an account?{" "}
              <a
                className="text-yellow-500 hover:underline Urbanist font-bold"
                href="{}"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gray-200 rounded-lg lg:rounded-none">
          <div className="w-full h-full">
            <img
              className="w-full h-full object-cover rounded-lg lg:rounded-none"
              src={background}
              alt="Background"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
