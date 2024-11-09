import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import firebase_app from "./firebase";

const auth = getAuth(firebase_app);

export async function signUp(email: string, password: string): Promise<{ result: UserCredential | null; error: FirebaseError | null }> {
    let result: UserCredential | null = null;
    let error: FirebaseError | null = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e as FirebaseError;
    }
    return { result, error };
}

export async function signIn(email: string, password: string): Promise<{ result: UserCredential | null; error: FirebaseError | null }> {
    let result: UserCredential | null = null;
    let error: FirebaseError | null = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e as FirebaseError;
    }
    return { result, error };
}

export async function signOutUser(): Promise<{ error: FirebaseError | null }> {
    let error: FirebaseError | null = null;
    try {
        await signOut(auth);
    } catch (e) {
        error = e as FirebaseError;
    }
    return { error };
}

export async function signInWithGoogle(): Promise<{ result: UserCredential | null; error: FirebaseError | null }> {
    let result: UserCredential | null = null;
    let error: FirebaseError | null = null;
    try {
        const provider = new GoogleAuthProvider();
        result = await signInWithPopup(auth, provider);
    } catch (e) {
        error = e as FirebaseError;
    }
    return { result, error };
}