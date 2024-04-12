import { createContext, useEffect, useReducer } from "react";
import { useState } from "react";
import { useContext } from "react";

export const AuthContext = createContext();

export const useAuth = ()=> useContext(AuthContext);

export const authReducer = (state, action)=>{
    switch(action.type){
        case 'LOGIN':
            return {user: action.payload, loading: false}
        case 'LOGOUT':
            return {user: null, loading: false}
        default:
            return state
    }
}

export default function AuthProvider({ children }) {

    const [loading, setLoading] = useState(true);
   
    const [state, dispatch] = useReducer(authReducer,{
        user: null,
        loading: true
    })

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'))

        if(user){
            dispatch({type: 'LOGIN', payload: user})
        }
        else{
            dispatch({type: "LOGOUT"});
        }        
        setLoading(false);
    },[])

    console.log('Auth Context state: ', state)

    if(loading){
        return <div>Loading...</div>
    }

    return (
        //we use the spread operator to give direct access to properties inside the current state object to other components
        // otherwise we would send a state object and that would require us to write state.user everywhere we had to 
        // now we can deconstruct user from the useAuth()
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}