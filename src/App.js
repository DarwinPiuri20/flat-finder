import  { Route, Routes } from 'react-router-dom'
import Home  from './pages/Home'
import Login from './pages/Login';
import './App.css';

function App() {
  return (
   <Routes>
    <Route path={'/'} element={<Login/>}/>
<Route path={'/dashboard'} element={<Home/>}/>
   </Routes>
  );
}

export default App;
