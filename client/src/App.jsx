import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigDetail from './pages/GigDetail';
import CreateGig from './pages/CreateGig';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

// Pages WITH navbar
const WithNav = ({ children }) => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>{children}</main>
  </div>
);

// Pages WITHOUT navbar — auth pages
const WithoutNav = ({ children }) => (
  <div className="min-h-screen bg-white">
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#111827',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          {/* No navbar — auth pages */}
          <Route path="/login" element={
            <WithoutNav><Login /></WithoutNav>
          }/>
          <Route path="/register" element={
            <WithoutNav><Register /></WithoutNav>
          }/>

          {/* With navbar — all other pages */}
          <Route path="/" element={
            <WithNav><Home /></WithNav>
          }/>
          <Route path="/gigs/:id" element={
            <WithNav><GigDetail /></WithNav>
          }/>
          <Route path="/orders" element={
            <WithNav><ProtectedRoute><Orders /></ProtectedRoute></WithNav>
          }/>
          <Route path="/chat/:orderId" element={
            <WithNav><ProtectedRoute><Chat /></ProtectedRoute></WithNav>
          }/>
          <Route path="/dashboard" element={
            <WithNav><ProtectedRoute><Dashboard /></ProtectedRoute></WithNav>
          }/>
          <Route path="/gigs/create" element={
            <WithNav><ProtectedRoute role="freelancer"><CreateGig /></ProtectedRoute></WithNav>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;