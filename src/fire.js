import firebase from 'firebase';
var firebaseConfig = {
  apiKey: "AIzaSyAB93gvj4AlCMvtzSs7ob5IM9r3aelM-1Q",
  authDomain: "cryptocurrencyapp-139e0.firebaseapp.com",
  projectId: "cryptocurrencyapp-139e0",
  storageBucket: "cryptocurrencyapp-139e0.appspot.com",
  messagingSenderId: "669245069351",
  appId: "1:669245069351:web:1e133c40c6892399411602"
};
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth()
export const db = firebase.firestore()
export default firebase