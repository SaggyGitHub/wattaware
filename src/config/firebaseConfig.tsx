// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA-5cK4Y8i8h3OeX15JYwe8UmKJC8OC6hc",
    authDomain: "wattaware-6521c.firebaseapp.com",
    databaseURL: "https://wattaware-6521c-default-rtdb.firebaseio.com",
    projectId: "wattaware-6521c",
    storageBucket: "wattaware-6521c.firebasestorage.app",
    messagingSenderId: "785229068492",
    appId: "1:785229068492:web:3c96af68d7da90a097ea69",
    measurementId: "G-41KFDNL73Q"
  };
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 