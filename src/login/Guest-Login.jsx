import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import company from "../components/assets/Company_logo.png";

export default function GuestLogin() {
    const [step, setStep] = useState("login");
    const [form, setForm] = useState({ otp: "" });
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const navigate = useNavigate(); // ✅ hook for navigation
    const location = useLocation();


    useEffect(() => {

        localStorage.removeItem("guestOrders");
        localStorage.removeItem("guestPlacedItems");
        localStorage.removeItem("guest_table_number");
        localStorage.removeItem("guest_table_id");
        localStorage.removeItem("guest_last_otp");

      

        const params = new URLSearchParams(location.search);
        const tableParam = params.get("table"); 
        const tableId = params.get("id");
        if (tableParam) {
            localStorage.setItem("guest_table_number", tableParam);
        }
        if (tableId) {
            localStorage.setItem("guest_table_id", tableId);
        }
    }, [location.search]);

    // handle input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // request OTP
    const requestOtp = () => {
        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otp);

        // Persist the OTP request so Admin Dashboard can read it
        const table = localStorage.getItem("guest_table_number") || new URLSearchParams(location.search).get("table") || "Unknown";
        const tableId = localStorage.getItem("guest_table_id") || new URLSearchParams(location.search).get("id") || null;

        const entry = {
            code: otp,
            table,
            tableId,
            timestamp: new Date().toISOString(),
        };

        try {
            const existing = JSON.parse(localStorage.getItem("guest_otp_requests") || "[]");
            existing.push(entry);
            localStorage.setItem("guest_otp_requests", JSON.stringify(existing));
            localStorage.setItem("guest_last_otp", otp);
        } catch (e) {
            console.error("Failed to persist OTP request", e);
        }

        toast.success("OTP requested. Please ask the staff for the code.");
        setStep("otp");
    };

    // validate OTP
    const validateOtp = () => {
        if (!form.otp) {
            toast.error("Please enter OTP");
            return;
        }

        const lastOtp = generatedOtp || localStorage.getItem("guest_last_otp");
        if (form.otp !== String(lastOtp)) {
            toast.error("Invalid OTP. Please try again.");
            return;
        }

        toast.success("OTP Verified");

        // ✅ Redirect to HMS menu page
        const params = new URLSearchParams(location.search);
        const table = params.get("table");
        const id = params.get("id");
        const query = [];
        if (table) query.push(`table=${encodeURIComponent(table)}`);
        if (id) query.push(`id=${encodeURIComponent(id)}`);
        const suffix = query.length ? `?${query.join("&")}` : "";
        navigate(`/guest-menu${suffix}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Company Logo */}
            <div className="w-full flex justify-center pt-8">
                <img src={company} alt="Company Logo" className="h-16 object-contain" />
            </div>

            <div className="flex flex-1 items-center justify-center">
                {/* Login Page */}
                {step === "login" && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4 text-center">Guest Login</h2>
                        <button
                            onClick={requestOtp}
                            className="w-full bg-purple-500 text-white py-2 rounded-lg"
                        >
                            Request OTP
                        </button>
                    </div>
                )}

                {/* OTP Page */}
                {step === "otp" && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={form.otp}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border rounded-lg"
                        />
                        <button
                            onClick={validateOtp}
                            className="w-full bg-purple-500 text-white py-2 rounded-lg"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-200 py-2 text-center">
                <div className="flex justify-center items-center space-x-2">
                    <span className="text-sm text-gray-600">Powered by</span>
                    <img src={company} alt="Company Logo" className="h-6" />
                </div>
            </footer>
        </div>
    );
}

// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { useLocation, useNavigate } from "react-router-dom";

// import company from "../components/assets/Company_logo.png";

// export default function GuestLogin() {
//     const [step, setStep] = useState("login");
//     const [form, setForm] = useState({ otp: "" });
//     const [generatedOtp, setGeneratedOtp] = useState(null);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // ✅ Clear previous guest session on every new login
//     useEffect(() => {
//         localStorage.removeItem("guestOrders");
//         localStorage.removeItem("guestPlacedItems");
//         localStorage.removeItem("guest_table_number");
//         localStorage.removeItem("guest_table_id");
//         localStorage.removeItem("guest_last_otp");

//         // Capture table info from QR URL and persist for Guest flow
//         const params = new URLSearchParams(location.search);
//         const tableParam = params.get("table"); 
//         const tableId = params.get("id");
//         if (tableParam) {
//             localStorage.setItem("guest_table_number", tableParam);
//         }
//         if (tableId) {
//             localStorage.setItem("guest_table_id", tableId);
//         }
//     }, [location.search]);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const requestOtp = () => {
//         const otp = Math.floor(1000 + Math.random() * 9000).toString();
//         setGeneratedOtp(otp);

//         const table = localStorage.getItem("guest_table_number") || "Unknown";
//         const tableId = localStorage.getItem("guest_table_id") || null;

//         const entry = {
//             code: otp,
//             table,
//             tableId,
//             timestamp: new Date().toISOString(),
//         };

//         try {
//             const existing = JSON.parse(localStorage.getItem("guest_otp_requests") || "[]");
//             existing.push(entry);
//             localStorage.setItem("guest_otp_requests", JSON.stringify(existing));
//             localStorage.setItem("guest_last_otp", otp);
//         } catch (e) {
//             console.error("Failed to persist OTP request", e);
//         }

//         toast.success("OTP requested. Please ask the staff for the code.");
//         setStep("otp");
//     };

//     const validateOtp = () => {
//         if (!form.otp) return toast.error("Please enter OTP");

//         const lastOtp = generatedOtp || localStorage.getItem("guest_last_otp");
//         if (form.otp !== String(lastOtp)) return toast.error("Invalid OTP. Please try again.");

//         toast.success("OTP Verified");

//         const params = new URLSearchParams(location.search);
//         const table = params.get("table");
//         const id = params.get("id");
//         const query = [];
//         if (table) query.push(`table=${encodeURIComponent(table)}`);
//         if (id) query.push(`id=${encodeURIComponent(id)}`);
//         const suffix = query.length ? `?${query.join("&")}` : "";
//         navigate(`/guest-menu${suffix}`);
//     };

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-100">
//             <div className="w-full flex justify-center pt-8">
//                 <img src={company} alt="Company Logo" className="h-16 object-contain" />
//             </div>

//             <div className="flex flex-1 items-center justify-center">
//                 {step === "login" && (
//                     <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
//                         <h2 className="text-xl font-bold mb-4 text-center">Guest Login</h2>
//                         <button
//                             onClick={requestOtp}
//                             className="w-full bg-purple-500 text-white py-2 rounded-lg"
//                         >
//                             Request OTP
//                         </button>
//                     </div>
//                 )}

//                 {step === "otp" && (
//                     <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
//                         <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
//                         <input
//                             type="text"
//                             name="otp"
//                             placeholder="Enter OTP"
//                             value={form.otp}
//                             onChange={handleChange}
//                             className="w-full p-2 mb-3 border rounded-lg"
//                         />
//                         <button
//                             onClick={validateOtp}
//                             className="w-full bg-purple-500 text-white py-2 rounded-lg"
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <footer className="bg-gray-200 py-2 text-center">
//                 <div className="flex justify-center items-center space-x-2">
//                     <span className="text-sm text-gray-600">Powered by</span>
//                     <img src={company} alt="Company Logo" className="h-6" />
//                 </div>
//             </footer>
//         </div>
//     );
// }

