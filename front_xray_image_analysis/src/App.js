import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login'
import ImageAnalysis from './Pages/ImageAnalysis';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element= {<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ImageAnalysis" element={<ImageAnalysis />} />
        </Routes>
    </Router>
  );
}

export default App;
