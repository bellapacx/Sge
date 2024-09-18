import {
    Routes,
    Route,
    Navigate,
  } from 'react-router-dom';
  import LoginForm from '../pages/LoginForm';
  
  const LoginLayout = () => {
    return (
      
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          {/* Redirect any other path to login page */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      
    );
  };
  
  export default LoginLayout;
  