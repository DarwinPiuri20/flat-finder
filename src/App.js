import  { Route, Routes } from 'react-router-dom'
import Home  from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './App.css';
import EditProfile from './pages/EditProfile';
import UserTable from './pages/UserTable';
import Profile from './pages/Profile';
import ViewProfile from './pages/ViewProfile';
import MyFlats from './pages/MyFlats';
import Favorites from './pages/Favorites';

function App() {
  return (
   <Routes>
    <Route path={'/'} element={<Login/>}/>
<Route path={'/dashboard'} element={<Home/>}/>
<Route path={'/register'} element={<Register/>}/>
<Route path={'/forgot-password'} element={<ForgotPasswordPage/>}/>
<Route path={'/profile/edit'} element={<EditProfile/>}/>
<Route path={'/all-users'}element={<UserTable/>}/>
<Route path={'/profile'}element={<Profile/>}/>
<Route path="/view-profile/:userId" element={<ViewProfile />} />
<Route path={'/my-flats'}element={<MyFlats/>}/>
<Route path={'/favorites'}element={<Favorites/>}/>


   </Routes>
  );
}

export default App;
