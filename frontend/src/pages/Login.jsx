import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   
  const { signin, isLoading, errorMessage, isError } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signin(email, password);
      navigate('/'); 
    } catch (err) {
     }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Warehouse Login</h2>
        
        {isError && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
            {errorMessage}
          </p>
        )}

        <input 
          type="email" 
          className="w-full p-2 mb-4 border rounded" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          className="w-full p-2 mb-6 border rounded" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}