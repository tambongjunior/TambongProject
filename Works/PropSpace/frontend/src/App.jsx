import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Context/AuthContext';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MyListings from './Pages/MyListings';
import CreateListing from './Pages/CreateListing';
import Profile from './Pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main style={{ paddingBottom: '2rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<div className="container"><Login /></div>} />
              <Route path="/register" element={<div className="container"><Register /></div>} />
              
              {/* Protected Routes */}
              <Route path="/my-listings" element={
                <ProtectedRoute>
                  <div className="container"><MyListings /></div>
                </ProtectedRoute>
              } />
              <Route path="/create-listing" element={
                <ProtectedRoute>
                  <div className="container"><CreateListing /></div>
                </ProtectedRoute>
              } />
              <Route path="/edit-listing/:id" element={
                <ProtectedRoute>
                  <div className="container"><CreateListing isEdit={true} /></div>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="container"><Profile /></div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
