import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'import.proccess.env.Google',
  authDomain: 'real-state-a4848.firebaseapp.com',
  projectId: 'real-state-a4848',
  storageBucket: 'real-state-a4848.appspot.com',
  messagingSenderId: '142597866443',
  appId: '1:142597866443:web:483ae49d017847e9af6c4e'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
