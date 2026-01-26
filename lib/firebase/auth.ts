// Firebase Authentication utilities

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/lib/types';

export async function registerUser(
    email: string,
    password: string,
    name: string
): Promise<User> {
    try {
        // Create Firebase auth user
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const firebaseUser = userCredential.user;

        // Update profile with name
        await updateProfile(firebaseUser, { displayName: name });

        // Create user document in Firestore
        const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name,
            role: 'customer',
            createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...userData,
            createdAt: new Date().toISOString(),
        });

        return userData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to register user');
        }
        throw new Error('Failed to register user');
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const firebaseUser = userCredential.user;

        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
            throw new Error('User data not found');
        }

        const userData = userDoc.data() as User;
        return {
            ...userData,
            id: firebaseUser.uid,
            createdAt: new Date(userData.createdAt),
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to login');
        }
        throw new Error('Failed to login');
    }
}

export async function logoutUser(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to logout');
        }
        throw new Error('Failed to logout');
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
        return null;
    }

    try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
            return null;
        }

        const userData = userDoc.data() as User;
        return {
            ...userData,
            id: firebaseUser.uid,
            createdAt: new Date(userData.createdAt),
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export function isAdmin(email?: string): boolean {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@ranisaboutique.com';
    return email === adminEmail;
}

export { auth };
