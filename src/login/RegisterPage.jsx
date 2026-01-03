import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Spin } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { userService } from "../HMS/models/UserService";
import "./RegisterPage.css";
const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // default empty
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !phone || !password || !role) {
            antdMessage.error("Please fill all fields");
            return;
        }

        // Password length validation
        if (password.length < 6) {
            antdMessage.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            const res = await userService.register({ username, email, password, phone, role });
            antdMessage.success(res.data.message || "Registration successful!");
            navigate("/");
        } catch (err) {
            console.error("Register API Error:", err);
            antdMessage.error(err.response?.data?.message || "Registration failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
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

                <form className="login-form" onSubmit={handleRegister}>
                    <h3>CREATE AN ACCOUNT</h3>

                    {/* Username */}
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={username ? "filled" : ""}
                                placeholder="Username"
                            />
                            <label>Username</label>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={email ? "filled" : ""}
                                placeholder="Email"
                            />
                            <label>Email</label>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={phone ? "filled" : ""}
                                placeholder="Phone Number"
                                maxLength={10}
                            />
                            <label>Phone Number</label>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="form-group">
                        <div className="input-wrapper">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className={role ? "filled" : ""}
                            >
                                <option value="" disabled hidden></option>
                                <option value="admin">Admin</option>
                            </select>
                            <label>Role</label>
                            <span className="select-arrow">&#9662;</span>
                        </div>
                    </div>


                
                    {/* Password Input */}
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={password ? "filled" : ""}
                                placeholder="Password"
                            />
                            <label htmlFor="register-password">Password</label>

                            {showPassword ? (
                                <FaEyeSlash
                                    className="input-icon toggle-icon"
                                    onClick={() => setShowPassword(false)}
                                    title="Hide Password"
                                    style={{ right: "6px" }}
                                />
                            ) : (
                                <FaEye
                                    className="input-icon toggle-icon"
                                    onClick={() => setShowPassword(true)}
                                    title="Show Password"
                                    style={{ right: "6px" }}
                                />
                            )}
                        </div>

                        {/* Real-time password length indicator */}
                        <div
                            className="password-indicator"
                            style={{ color: password.length >= 6 ? "green" : "red", fontSize: "12px", marginTop: "4px" }}
                        >
                            {password.length > 0
                                ? password.length >= 6
                                    ? "Password length is sufficient"
                                    : `Password must be at least 6 characters (${password.length}/6)`
                                : "Password must be at least 6 characters"}
                        </div>
                    </div>



                    <button type="submit" className="log-button" disabled={loading}>
                        {loading ? <Spin /> : "REGISTER"}
                    </button>

                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                        <span>Already have an account?</span>
                        <span
                            style={{
                                color: "#3d2c8bff",
                                fontWeight: "bold",
                                marginLeft: "4px",
                            }}
                            onClick={() => navigate("/")}
                        >
                            Login here
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
