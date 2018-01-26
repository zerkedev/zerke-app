import firebase from 'firebase';

const config= {
  firebase_config: {
    apiKey: "AIzaSyDoz--xp9Z3N8SEsChAt_7_DHXxHocUL_4",
    authDomain: "zerke-80063.firebaseapp.com",
    databaseURL: "https://zerke-80063.firebaseio.com",
    projectId: "zerke-80063",
    storageBucket: "zerke-80063.appspot.com",
    messagingSenderId: "672827555040"
  },
  firebase_providers: [
    firebase.auth.GoogleAuthProvider,
    firebase.auth.FacebookAuthProvider,
    firebase.auth.TwitterAuthProvider,
    firebase.auth.GithubAuthProvider,
    firebase.auth.EmailAuthProvider,
    firebase.auth.PhoneAuthProvider
  ],

  initial_state: {
    theme: 'light',
    locale: 'en'
  },
  drawer_width: 256,

  
}

export default config;

var stripeTesting = true
var stripePublishableKey 
if (stripeTesting){
  stripePublishableKey = 'pk_test_6cbGwjJQcN3ZBnlIvlIlPIKM'
} else {
  stripePublishableKey = 'pk_live_QKQ7q016JwLHjHzJ0WPw5Khn'
} //

export const STRIPE_PUBLISHABLE_KEY = stripePublishableKey;
//export const STRIPE_SECRET_KEY = stripeSecretKey;
export const API_URL ='https://api.yoursite.com'
