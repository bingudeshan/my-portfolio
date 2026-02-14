
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    deleteDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// Users / Portfolios
export const saveUserProfile = async (uid, profileData) => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...profileData, updatedAt: new Date().toISOString() }, { merge: true });
};

export const getUserProfile = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? { ...snap.data(), id: snap.id } : null;
};

export const getProfileByUsername = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
    }
    return null;
};

// Projects
export const getUserProjects = async (uid) => {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const addProject = async (projectData) => {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, { ...projectData, createdAt: new Date().toISOString() });
    return docRef.id;
};

export const updateProject = async (projectId, projectData) => {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, { ...projectData, updatedAt: new Date().toISOString() });
};

export const deleteProject = async (projectId) => {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
};

// Posts / Blog
export const getUserPosts = async (uid) => {
    const postsRef = collection(db, 'posts');
    let q;
    if (uid) {
        q = query(postsRef, where('uid', '==', uid));
    } else {
        q = query(postsRef);
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const addPost = async (postData) => {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, { ...postData, createdAt: new Date().toISOString() });
    return docRef.id;
};

export const getPostById = async (postId) => {
    const cleanId = postId?.trim();
    if (!cleanId) return null;
    const postRef = doc(db, 'posts', cleanId);
    const snap = await getDoc(postRef);
    return snap.exists() ? { ...snap.data(), id: snap.id } : null;
};

export const updatePost = async (postId, postData) => {
    const cleanId = postId?.trim();
    if (!cleanId) throw new Error("Invalid Post ID");
    const postRef = doc(db, 'posts', cleanId);
    await updateDoc(postRef, { ...postData, updatedAt: new Date().toISOString() });
};

export const deletePost = async (postId) => {
    const cleanId = postId?.trim();
    if (!cleanId) throw new Error("Invalid Post ID");
    const postRef = doc(db, 'posts', cleanId);
    await deleteDoc(postRef);
};

// Experience / Education
export const getUserExperience = async (uid) => {
    const expRef = collection(db, 'experience');
    const q = query(expRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const addExperience = async (expData) => {
    const expRef = collection(db, 'experience');
    const docRef = await addDoc(expRef, { ...expData, createdAt: new Date().toISOString() });
    return docRef.id;
};

export const updateExperience = async (expId, expData) => {
    const expRef = doc(db, 'experience', expId);
    await updateDoc(expRef, { ...expData, updatedAt: new Date().toISOString() });
};

export const deleteExperience = async (expId) => {
    const expRef = doc(db, 'experience', expId);
    await deleteDoc(expRef);
};
