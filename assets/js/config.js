// ------------------ Firebase --------------------------

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js';
import {
	getDatabase,
	set,
	ref,
	child,
	get,
	update,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
	updatePassword,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';

const firebaseConfig = {
	apiKey: 'AIzaSyDoV7Zg2dutjW9Ib0e3LkyEzt6qpzWw8l8',
	authDomain: 'music-app-2420a.firebaseapp.com',
	databaseURL: 'https://music-app-2420a-default-rtdb.firebaseio.com',
	projectId: 'music-app-2420a',
	storageBucket: 'music-app-2420a.appspot.com',
	messagingSenderId: '912383656489',
	appId: '1:912383656489:web:4904d35d7b7ae3e93b9238',
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getDatabase();
