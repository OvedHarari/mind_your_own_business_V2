import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Bcards from "./components/Bcards";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PageNotFound from "./components/PageNotFound";
import UsersManagement from "./components/UsersManagement";
import MyCards from "./components/MyCards";
import Favorites from "./components/Favorites";
import { getUserById } from "./services/usersService";
import About from "./components/About";
import GoogleAuth from "./components/GoogleAuth";

const theme = {
  light: "light",
  dark: "dark",
};
export let SiteTheme = createContext(theme.light);

declare global {
  interface Window {
    google: any;
    initMaps: () => void;
    mapsApiLoaded: boolean;
    mapsApiLoadCallbacks: (() => void)[];
  }
}

window.mapsApiLoaded = false;
window.mapsApiLoadCallbacks = [];

window.initMaps = () => {
  window.mapsApiLoaded = true;
  window.mapsApiLoadCallbacks.forEach(callback => callback());
};

const googleMapsScript = document.createElement("script");
googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMaps`;
document.head.appendChild(googleMapsScript);

function App() {
  let [darkMode, setDarkMode] = useState<boolean>(
    JSON.parse(localStorage.getItem("darkMode")!)
  );
  let [userInfo, setUserInfo] = useState(
    JSON.parse(sessionStorage.getItem("userInfo") as string) == null
      ? { email: false }
      : JSON.parse(sessionStorage.getItem("userInfo") as string)
  );
  let [dataUpdated, setDataUpdated] = useState<boolean>(false);
  let render = () => setDataUpdated(!dataUpdated)
  let [userProfile, setUserProfile] = useState<any>({
    _id: 0,
    name: { firstName: "", middleName: "", lastName: "" },
    phone: "",
    email: "",
    password: "",
    image: { url: "", alt: "" },
    gender: "",
    role: "",
    address: { country: "", state: "", city: "", street: "", houseNumber: "", zipcode: "" },
    picture: "",
    isActive: ""
  })
  let [passwordShown, setPasswordShown] = useState(false);
  let togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    if (userInfo.userId) {
      getUserById(userInfo.userId)
        .then((res) => {
          setUserProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [dataUpdated, userInfo]);

  return (
    <SiteTheme.Provider value={darkMode ? theme.dark : theme.light}>
      <ToastContainer theme={`${darkMode ? "dark" : "light"}`} />
      <div className={`App  ${darkMode && "dark"}`}>
        <Router>
          <Navbar
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            render={render}
            passwordShown={passwordShown}
            togglePassword={togglePassword}
          />
          <Routes>
            <Route path="/google/success" element={<GoogleAuth setUserInfo={setUserInfo} />} />
            <Route path="/" element={<Bcards userInfo={userInfo} />} />
            <Route path="/signin" element={<SignIn setUserInfo={setUserInfo} passwordShown={passwordShown} togglePassword={togglePassword} />} />
            <Route path="/signup" element={<SignUp setUserInfo={setUserInfo} passwordShown={passwordShown}
              togglePassword={togglePassword} />} />
            <Route path="/mycards" element={<MyCards userInfo={userInfo} />} />
            <Route path="/favorites" element={<Favorites userInfo={userInfo} />} />
            <Route path="/about" element={<About userInfo={userInfo} />} />
            <Route path="/usersmanagement" element={<UsersManagement darkMode={darkMode} render={render} userProfile={userProfile} setUserProfile={setUserProfile} passwordShown={passwordShown} togglePassword={togglePassword} userInfo={userInfo} dataUpdated={dataUpdated} />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </div>
    </SiteTheme.Provider>
  );
}

export default App;
