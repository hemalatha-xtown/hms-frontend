// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { message as antdMessage, Spin } from "antd";
// import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
// import api from "../HMS/services/api";
// import logo from "../components/assets/Company_logo.png";
// import x_logo from "../components/assets/Dark Logo.png";
// import "./Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [isMobileLogin, setIsMobileLogin] = useState(false);
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [mobileError, setMobileError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [loginError, setLoginError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const isValidMobile = (mobile) => /^\d{10}$/.test(mobile);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setEmailError("");
//     setMobileError("");
//     setPasswordError("");
//     setLoginError("");

//     const identifier = isMobileLogin ? mobile : email;
//     let hasError = false;

//     if (!identifier.trim()) {
//       if (isMobileLogin) setMobileError("Mobile number is required");
//       else setEmailError("Email is required");
//       hasError = true;
//     } else if (!isMobileLogin && !isValidEmail(email)) {
//       setEmailError("Please enter a valid email address");
//       hasError = true;
//     } else if (isMobileLogin && !isValidMobile(mobile)) {
//       setMobileError("Please enter a valid 10-digit mobile number");
//       hasError = true;
//     }

//     if (!password.trim()) {
//       setPasswordError("Password is required");
//       hasError = true;
//     }

//     if (hasError) return;

//     setLoading(true);

//     try {
//       const payload = { identifier, password };
//       const response = await api.post("/user/user/login", payload);

//       console.log("Login API Response:", response.data);

//       const { accessToken, refreshToken, user } = response.data;

//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("role", user.role);

//       antdMessage.success({
//         content: response.data.message || "Login successful!",
//         duration: 3,
//       });

//       // Redirect based on role
//       //   if (["superadmin", "admin", "cluster admin", "branch admin"].includes(user.role)) {
//       //     navigate("/admin/dashboard");
//       //   } else {
//       //     navigate("/hms/menus");
//       //   }
//       // }
//       if (user.role === "superadmin") {
//         navigate("/HMS/AdminDashboard"); // or super dashboard if you make one
//       } else if (user.role === "admin") {
//         navigate("/HMS/AdminDashboard");
//       } else if (user.role === "user") {
//         navigate("/HMS/Menus");
//       }
//     } catch (error) {
//       console.error("Login API Error:", error);
//       const errorMessage =
//         error.response?.data?.message || "Login failed! Please try again.";
//       setLoginError(errorMessage);
//       antdMessage.error({
//         content: errorMessage,
//         duration: 5,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);
//   const toggleLoginMode = () => {
//     setIsMobileLogin(!isMobileLogin);
//     setEmail("");
//     setMobile("");
//     setEmailError("");
//     setMobileError("");
//     setLoginError("");
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-container">
//         <div className="login-left">
//           <div className="welcome-container">
//             <h3 className="welcome-heading">
//               Welcome to <img src={x_logo} alt="XTOWN" /> town..!
//             </h3>
//             <span className="welcome-tagline">
//               We’re here to turn your ideas into reality.
//             </span>
//           </div>
//         </div>

//         <div className="login-right">
//           <img src={logo} alt="Company Logo" className="logo" />
//           <form className="login-form" onSubmit={handleSubmit}>
//             <h3>LOGIN TO YOUR ACCOUNT</h3>

//             {loginError && (
//               <div className="login-error-message">{loginError}</div>
//             )}

//             <div
//               className={`form-group ${isMobileLogin ? "mobile" : "email"} ${isMobileLogin
//                   ? mobileError
//                     ? "error"
//                     : ""
//                   : emailError
//                     ? "error"
//                     : ""
//                 } mb-4`}
//             >
//               <div className="input-wrapper">
//                 {isMobileLogin ? (
//                   <>
//                     <input
//                       id="mobile"
//                       type="tel"
//                       value={mobile}
//                       onChange={(e) => setMobile(e.target.value)}
//                       className={mobile ? "filled" : ""}
//                       placeholder="Mobile Number"
//                       maxLength={10}
//                     />
//                     <label htmlFor="mobile">Mobile Number</label>
//                     <FaEnvelope
//                       className="input-icon toggle-icon"
//                       onClick={toggleLoginMode}
//                       title="Use Email instead"
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <input
//                       id="email"
//                       type="text"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className={email ? "filled" : ""}
//                       placeholder="Email"
//                     />
//                     <label htmlFor="email">Email</label>
//                     <FaPhone
//                       className="input-icon toggle-icon"
//                       onClick={toggleLoginMode}
//                       title="Use Mobile Number instead"
//                     />
//                   </>
//                 )}
//               </div>
//               {isMobileLogin && mobileError && (
//                 <div className="login-error-message">{mobileError}</div>
//               )}
//               {!isMobileLogin && emailError && (
//                 <div className="login-error-message">{emailError}</div>
//               )}
//             </div>

//             <div
//               className={`form-group password ${passwordError ? "error" : ""}`}
//             >
//               <div className="input-wrapper">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className={password ? "filled" : ""}
//                   placeholder="Password"
//                 />
//                 <label htmlFor="password">Password</label>
//                 {showPassword ? (
//                   <FaEyeSlash
//                     className="input-icon toggle-icon"
//                     onClick={togglePasswordVisibility}
//                     title="Hide Password"
//                   />
//                 ) : (
//                   <FaEye
//                     className="input-icon toggle-icon"
//                     onClick={togglePasswordVisibility}
//                     title="Show Password"
//                   />
//                 )}
//               </div>
//               {passwordError && (
//                 <div className="login-error-message">{passwordError}</div>
//               )}
//             </div>

//             <button type="submit" className="log-button" disabled={loading}>
//               {loading ? <Spin /> : "LOGIN"}
//             </button>

//                {/* 👇 Added this block */}
//             <div style={{ marginTop: "1rem", textAlign: "center" }}>
//               <span>Don't have an account?</span>
//               <span
//                 style={{
//                   color: "#3d2c8bff",
//                   fontWeight: "bold",
//                   marginLeft: "4px",
//                 }}
//                 onClick={() => navigate("/register")}
//               >
//                 Register here
//               </span>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Spin } from "antd";
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import api from "../HMS/services/api";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isMobileLogin, setIsMobileLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = (mobile) => /^\d{10}$/.test(mobile);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setEmailError("");
  //   setMobileError("");
  //   setPasswordError("");
  //   setLoginError("");

  //   const identifier = isMobileLogin ? mobile : email;
  //   let hasError = false;

  //   if (!identifier.trim()) {
  //     if (isMobileLogin) setMobileError("Mobile number is required");
  //     else setEmailError("Email is required");
  //     hasError = true;
  //   } else if (!isMobileLogin && !isValidEmail(email)) {
  //     setEmailError("Please enter a valid email address");
  //     hasError = true;
  //   } else if (isMobileLogin && !isValidMobile(mobile)) {
  //     setMobileError("Please enter a valid 10-digit mobile number");
  //     hasError = true;
  //   }

  //   if (!password.trim()) {
  //     setPasswordError("Password is required");
  //     hasError = true;
  //   }

  //   if (hasError) return;

  //   setLoading(true);

  //   try {
  //     const payload = { identifier, password };
  //     const response = await api.post("/user/user/login", payload);

  //     console.log("Login API Response:", response.data); // ✅ debug log

  //     const { accessToken, refreshToken, user } = response.data;

  //     // normalize role (prevent case mismatch)
  //     user.role = user.role?.trim().toLowerCase();

  //     // save to storage
  //     localStorage.setItem("token", accessToken);
  //     localStorage.setItem("refreshToken", refreshToken);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     localStorage.setItem("role", user.role);

  //     console.log("Login: stored user:", localStorage.getItem("user")); // ✅ debug log

  //     antdMessage.success({
  //       content: response.data.message || "Login successful!",
  //       duration: 3,
  //     });

  //     // Redirect based on role
  //     if (user.role === "superadmin") {
  //       console.log("Navigating to /HMS/AdminDashboard"); // ✅ debug log
  //       navigate("/HMS/AdminDashboard");
  //     } else if (user.role === "admin") {
  //       console.log("Navigating to /HMS/AdminDashboard"); // ✅ debug log
  //       navigate("/HMS/AdminDashboard");
  //     } else if (user.role === "user") {
  //       console.log("Navigating to /HMS/Menus"); // ✅ debug log
  //       navigate("/HMS/Menus");
  //     }
  //   } catch (error) {
  //     console.error("Login API Error:", error);
  //     const errorMessage =
  //       error.response?.data?.message || "Login failed! Please try again.";
  //     setLoginError(errorMessage);
  //     antdMessage.error({
  //       content: errorMessage,
  //       duration: 5,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setLoginError("");

    const identifier = isMobileLogin ? mobile : email;
    let hasError = false;

    if (!identifier.trim()) {
      if (isMobileLogin) setMobileError("Mobile number is required");
      else setEmailError("Email is required");
      hasError = true;
    } else if (!isMobileLogin && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else if (isMobileLogin && !isValidMobile(mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const payload = { identifier, password };
      const response = await api.post("/user/user/login", payload);

      console.log("Login API Response:", response.data);

      const { accessToken, refreshToken, user } = response.data;

      // ✅ Save login data (no role check)
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      antdMessage.success({
        content: response.data.message || "Login successful!",
        duration: 3,
      });

      // ✅ Navigate to a fixed page after login (no role conditions)
      console.log("Navigating to /HMS/AdminDashboard");
      navigate("/HMS/AdminDashboard");
    } catch (error) {
      console.error("Login API Error:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed! Please try again.";
      setLoginError(errorMessage);
      antdMessage.error({
        content: errorMessage,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleLoginMode = () => {
    setIsMobileLogin(!isMobileLogin);
    setEmail("");
    setMobile("");
    setEmailError("");
    setMobileError("");
    setLoginError("");
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <div className="welcome-container">
            <h3 className="welcome-heading">
              Welcome to <img src={x_logo} alt="XTOWN" /> town..!
            </h3>
            <span className="welcome-tagline">
              We’re here to turn your ideas into reality.
            </span>
          </div>
        </div>

        <div className="login-right">
          <img src={logo} alt="Company Logo" className="logo" />
          <form className="login-form" onSubmit={handleSubmit}>
            <h3>LOGIN TO YOUR ACCOUNT</h3>

            {loginError && (
              <div className="login-error-message">{loginError}</div>
            )}

            <div
              className={`form-group ${isMobileLogin ? "mobile" : "email"} ${
                isMobileLogin
                  ? mobileError
                    ? "error"
                    : ""
                  : emailError
                  ? "error"
                  : ""
              } mb-4`}
            >
              <div className="input-wrapper">
                {isMobileLogin ? (
                  <>
                    <input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className={mobile ? "filled" : ""}
                      placeholder="Mobile Number"
                      maxLength={10}
                    />
                    <label htmlFor="mobile">Mobile Number</label>
                    <FaEnvelope
                      className="input-icon toggle-icon"
                      onClick={toggleLoginMode}
                      title="Use Email instead"
                    />
                  </>
                ) : (
                  <>
                    <input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={email ? "filled" : ""}
                      placeholder="Email"
                    />
                    <label htmlFor="email">Email</label>
                    <FaPhone
                      className="input-icon toggle-icon"
                      onClick={toggleLoginMode}
                      title="Use Mobile Number instead"
                    />
                  </>
                )}
              </div>
              {isMobileLogin && mobileError && (
                <div className="login-error-message">{mobileError}</div>
              )}
              {!isMobileLogin && emailError && (
                <div className="login-error-message">{emailError}</div>
              )}
            </div>

            <div
              className={`form-group password ${passwordError ? "error" : ""}`}
            >
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={password ? "filled" : ""}
                  placeholder="Password"
                />
                <label htmlFor="password">Password</label>
                {showPassword ? (
                  <FaEyeSlash
                    className="input-icon toggle-icon"
                    onClick={togglePasswordVisibility}
                    title="Hide Password"
                  />
                ) : (
                  <FaEye
                    className="input-icon toggle-icon"
                    onClick={togglePasswordVisibility}
                    title="Show Password"
                  />
                )}
              </div>
              {passwordError && (
                <div className="login-error-message">{passwordError}</div>
              )}
            </div>

            <button type="submit" className="log-button" disabled={loading}>
              {loading ? <Spin /> : "LOGIN"}
            </button>

            {/* 👇 Added register link */}
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <span>Don't have an account?</span>
              <span
                style={{
                  color: "#3d2c8bff",
                  fontWeight: "bold",
                  marginLeft: "4px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
