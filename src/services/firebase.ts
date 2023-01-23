import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDCShAxYH7MEtaN94Fc17HbUWGIWzzIl2s',
  authDomain: 'corteletti-71409.firebaseapp.com',
  projectId: 'corteletti-71409',
  storageBucket: 'corteletti-71409.appspot.com',
  messagingSenderId: '995802521814',
  appId: '1:995802521814:web:17dcbd34811f95d1c3e977',
  measurementId: 'G-JJY3SER53C'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { app, auth, provider }
