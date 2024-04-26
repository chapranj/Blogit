import React from "react";
import { Link } from "react-router-dom";
import useLogout from "./hooks/useLogout";
import { useAuth } from "./security/AuthContext";
import logo from "../logos/png/logo-no-background.png"


export default function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuth();

    const handleClick = () => {
        logout();
    };

    return (
        <nav className="bg-gray-800 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center text-white text-2xl font-bold">
                    <img src={logo} alt="Logo" className="h-8 w-auto mr-2" /> {/* Include your logo */}
                    Ticketoes
                </Link>
                <ul className="flex space-x-4">
                    <li><Link to="/" className="text-white hover:text-gray-300">

                        Tickets
                    </Link></li>
                    <li><Link to="/blog/new" className="text-white hover:text-gray-300">New Ticket</Link></li>
                </ul>
                <div className="flex space-x-4">
                    {!user && (
                        <div className="login">
                            <Link to="/login" className="text-white hover:text-gray-300 m-5">Login</Link>
                            <Link to="/signup" className="text-white hover:text-gray-300 m-5">Signup</Link>
                        </div>
                    )}
                    {user && (
                        <div className="logout">
                            <span className="text-white m-6">{user.email}</span>
                            <button onClick={handleClick} className="text-white hover:text-gray-300">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}