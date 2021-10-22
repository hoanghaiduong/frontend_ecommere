import axios from "axios";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/frontend/auth/Login";
import Register from "./components/frontend/auth/Register";
import Home from "./components/frontend/Home";
import MasterLayout from "./layouts/admin/MasterLayout";

/* const firebaseConfig = {
  apiKey: "AIzaSyDD7Y5eelmdHmAW8xEwEcmMAFdZGVDzbSE",
  authDomain: "thuongmaidientu-1211f.firebaseapp.com",
  projectId: "thuongmaidientu-1211f",
  storageBucket: "thuongmaidientu-1211f.appspot.com",
  messagingSenderId: "1008396240937",
  appId: "1:1008396240937:web:c4f4819834bfbac3e37438",
  measurementId: "G-LJM6J3R796"
};
const app = initializeApp(firebaseConfig);

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
}; */

export default function App() {
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  axios.defaults.baseURL = "http://localhost:8000/";
  axios.defaults.headers.post["Accept"] = "application/json";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use((config) => {
    const token = getCookie('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  })
  const element = document.getElementById("ipl-progress-indicator");
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  useEffect(() => {
    async function authenticate() {
      return new Promise((resolve) => setTimeout(resolve, 500)); // 1 seconds
    }
    authenticate().then(() => {
      //nếu có id ipl-progress-indicator
      if (element) {
        // fade out
        //add class available
        element.classList.add("available");
        setTimeout(() => {
          // remove from DOM
          element.outerHTML = "";
        }, 500);
      }
    });


  }, []);

  return (

    <div className="App">

      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route
            path="/admin/"
            name="Admin"
            render={(props) => <MasterLayout {...props} />}
            component={MasterLayout}
          ></Route>
        </Switch>
      </Router>
    </div>
  );

}
