import React, { useState } from "react";
import API from "../api/axios";

export default function LoginRegister({ setIsAuthenticated }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setForm({ username: "", email: "", password: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Submitting form:", form);

        try {
            if (isLogin) {
                const res = await API.post(
                    "/login",
                    new URLSearchParams({
                        username: form.email,
                        password: form.password,
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

                console.log("Login success:", res.data);
                localStorage.setItem("token", res.data.access_token);
                setIsAuthenticated(true);
            } else {
                const res = await API.post("/register", {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                });
                console.log("Registration success:", res.data);
                alert("Registration successful! Please login.");
                toggleForm();
            }
        } catch (err) {
            console.error("Registration/login error:", err);
            alert(
                JSON.stringify(err.response?.data || { error: "Unknown error" }, null)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {isLogin ? "Login to Your Account" : "Create an Account"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
                    >
                        {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? (
                        <>
                            Don't have an account?{" "}
                            <button
                                onClick={toggleForm}
                                className="text-blue-600 hover:underline font-medium"
                                type="button"
                            >
                                Register here
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={toggleForm}
                                className="text-blue-600 hover:underline font-medium"
                                type="button"
                            >
                                Login here
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
