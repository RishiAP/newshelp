import admin from 'firebase-admin';

interface FirebaseAdminConfig {
    projectId: string;
    storageBucket: string;
    privateKey: string;
    clientEmail: string;
}

function formatPrivateKey(privateKey: string) {
    return privateKey.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(config: FirebaseAdminConfig) {
    const privateKey= formatPrivateKey(config.privateKey);
    if(admin.apps.length>0){
        return admin.app();
    }
    const cert= admin.credential.cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey,
    });
    return admin.initializeApp({
        credential: cert,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
    });
}

export async function initAdmin() {
    const firebaseAdminConfig: FirebaseAdminConfig = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
    };
    return createFirebaseAdminApp(firebaseAdminConfig);
}