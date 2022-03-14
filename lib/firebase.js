import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyC2C2SDxQ8pvvObDtuQK9o3SUgKpSBXQkI',
    authDomain: 'nextfire-52c68.firebaseapp.com',
    projectId: 'nextfire-52c68',
    storageBucket: 'nextfire-52c68.appspot.com',
    messagingSenderId: '372460840919',
    appId: '1:372460840919:web:bc0aedbe778b2d92568d92'
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvide = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();