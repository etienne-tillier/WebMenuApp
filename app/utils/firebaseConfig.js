import firebase from 'firebase'


var firebaseConfig = {
  apiKey: "AIzaSyBB8k3pdSWy3qwm0SmsJZLLclAWwfUvI44",
  authDomain: "opinakastyle.firebaseapp.com",
  databaseURL: "https://opinakastyle-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "opinakastyle",
  storageBucket: "opinakastyle.appspot.com",
  messagingSenderId: "583808787989",
  appId: "1:583808787989:web:1ada9d52dceba159d8101c"
};


var dataTable = 'opi-electron-etienne'


firebase.initializeApp(firebaseConfig);


export {
  firebase,
  dataTable
}
