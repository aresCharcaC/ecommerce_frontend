import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      let userData;
      
      if (isRegisterMode) {
        // Registro
        if (formData.password !== formData.password2) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }
  
        const registerResponse = await axios.post('http://localhost:8000/api/register/', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
          first_name: formData.first_name,
          last_name: formData.last_name
        });
  
        if (registerResponse.data) {
          // Auto login después del registro
          const loginResponse = await axios.post('http://localhost:8000/api/login/', {
            username: formData.username,
            password: formData.password
          });
          
          if (loginResponse.data.user) {
            userData = loginResponse.data.user;
          }
        }
      } else {
        // Login normal
        const loginResponse = await axios.post('http://localhost:8000/api/login/', {
          username: formData.username,
          password: formData.password
        });
        
        if (loginResponse.data.user) {
          userData = loginResponse.data.user;
        }
      }
  
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        onLoginSuccess(userData);
      } else {
        setError('Error en la autenticación');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error en la autenticación'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (isRegisterMode ? 'Registrarse' : 'Iniciar Sesión')}
          </button>

          <div className="text-center text-sm text-gray-600">
            {isRegisterMode ? (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Inicia sesión aquí
                </button>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Regístrate aquí
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;