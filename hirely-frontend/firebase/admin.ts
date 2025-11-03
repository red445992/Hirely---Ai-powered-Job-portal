import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  // Initialization code for Firebase Admin SDK
  const apps = getApps();
  if (!apps.length) {
    // Initialize your Firebase Admin app here
    initializeApp({
        credential: cert({
            projectId: process.env.Firebase_project_id,
            clientEmail: process.env.Firebase_client_email,
            privateKey: process.env.Firebase_private_key?.replace(/\\n/g, "\n"),
        }),
      });
  }
  return {
    auth: getAuth(),
    db: getFirestore(),
  }
}

export const {auth, db} = initFirebaseAdmin();

