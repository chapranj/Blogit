import { useState } from "react";
import { useAuth } from "../security/AuthContext";


export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuth();


    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const json = await response.json();
        console.log(json)

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        if (response.ok) {
            // console.log("loggedin")
            // console.log(json)
            // console.log(JSON.stringify(json))
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json })
            setIsLoading(false);
        }
    }
    return { login, isLoading, error };
}