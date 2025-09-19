
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKj3KdYI-EVeQ49eL9sDjaqC-ChbS5y6w",
  authDomain: "lla-goal.firebaseapp.com",
  projectId: "lla-goal",
  storageBucket: "lla-goal.firebasestorage.app",
  messagingSenderId: "759639730484",
  appId: "1:759639730484:web:9ed52629e03ea068795d61"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)