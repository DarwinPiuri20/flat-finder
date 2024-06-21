import  { Route, Routes } from 'react-router-dom'
import Home  from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './App.css';
function App() {
  return (
   <Routes>
    <Route path={'/'} element={<Login/>}/>
<Route path={'/dashboard'} element={<Home/>}/>
<Route path={'/register'} element={<Register/>}/>
<Route path={'/forgot-password'} element={<ForgotPasswordPage/>}/>
   </Routes>
  );
}

export default App;
