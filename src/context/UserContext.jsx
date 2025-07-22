// src/contexts/UserContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName || firebaseUser.email || 'User',
                    email: firebaseUser.email,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
