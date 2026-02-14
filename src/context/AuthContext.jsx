
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Check if user is admin (for this specific app, we might want to check UID or a field in Firestore)
                // For now, let's assume the first user or a specific email is admin, or we check a 'users' collection
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setIsAdmin(userDoc.data().role === 'admin');
                } else {
                    // Create user profile if it doesn't exist
                    await setDoc(doc(db, 'users', currentUser.uid), {
                        name: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        role: 'user', // Default role
                        createdAt: new Date().toISOString()
                    });
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const loginWithGithub = () => {
        return signInWithPopup(auth, githubProvider);
    };

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loginWithGoogle, loginWithGithub, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
