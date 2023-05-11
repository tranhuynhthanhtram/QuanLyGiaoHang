import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProfileUser from './components/ProfileUser';
import RecoveryPassword from './components/RecoveryPassword';
import { createContext, useReducer } from 'react';
import myReducer from './Reducers/myReducer';
import cookies from "react-cookies";
import Header from './layouts/Header/Header';
import Footer from "./layouts/Footer/Footer";
import logoBrand from "./Images/logo.jpg";
import Login from './components/LogIn';
import Register from './components/Register';
import Home from './components/Home';
import PostDetails from './components/PostDetails';
import Auction from './components/Auction';
import 'moment/locale/vi';
import moment from 'moment'
import Order from './components/Order';
import PostOwn from './components/PostOwn';

export const UserContext = createContext();
moment().local("vi")
function App() {
  const [user, dispatch] = useReducer(myReducer, cookies.load("current_user")||null);
  return (
    <BrowserRouter>
    <UserContext.Provider value={[user, dispatch]}>
       <Header logo={logoBrand} />
       <Routes>
          <Route path="/posts/" element={<Home />} />
          <Route path="/posts/:postId" element={<PostDetails />} />
          {/* <Route path="/posts/" element={<PostOwn />} /> */}
          <Route path="/order/" element={<Order />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/recovery/" element={<RecoveryPassword />} />
          <Route path="/profile/:userId" element={<ProfileUser />} />
       </Routes>
       <Footer logo={logoBrand} />
    </UserContext.Provider>
 </BrowserRouter>
  );
}

export default App;
