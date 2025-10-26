import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/auth.css';
import loginBg from '../assets/loginphoto.jpg';
import registerBg from '../assets/loginphoto.jpg';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('Owner');
  // Password visibility toggles
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  
  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('Owner');

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLoginEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      alert('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', loginEmail);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Store user session
    const user = {
      email: loginEmail,
      role: loginRole,
      loggedIn: true
    };
    localStorage.setItem('currentUser', JSON.stringify(user));

    alert(`Login successful!\nEmail: ${loginEmail}\nRole: ${loginRole}`);
    window.location.href = '/';
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fullName || !registerEmail || !registerPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Password validation
    if (registerPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (registerPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Store registered user
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if email already exists
    if (users.some((u: any) => u.email === registerEmail)) {
      alert('An account with this email already exists');
      return;
    }

    const newUser = {
      fullName,
      email: registerEmail,
      password: registerPassword,
      role: registerRole
    };
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    alert('Registration successful! You can now login.');
    
    // Switch to login form and pre-fill email
    setIsLogin(true);
    setLoginEmail(registerEmail);
  };

  const handleForgotPassword = (e: FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      alert('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Simulate password reset
    alert(`Password reset link has been sent to ${forgotEmail}`);
    setShowForgotPassword(false);
    setForgotEmail('');
  };
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/index"); // 👈 Redirect to Index.tsx
};

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div 
        className={`auth-background ${isLogin ? 'login-bg' : 'register-bg'}`}
        style={{
          backgroundImage: `url(${isLogin ? loginBg : registerBg})`
        }}
      ></div>
      
<div className={`auth-overlay ${isLogin ? 'left-to-right' : 'right-to-left'}`}></div>

      <div className={`auth-content ${isLogin ? 'form-left' : 'form-right'}`}>
        {/* Logo */}
        <div className={`auth-logo ${isLogin ? 'logo-left' : 'logo-right'}`}>
          <div className="logo-icon">
            <img className="img-logo" src="/src/assets/HomebaseFinderOfficialLogo.png" alt="Homebase Finder Logo" />
          </div>
          <div className="logo-text">
            <div className="logo-title">HOMEBASE</div>
            <div className="logo-subtitle">FINDER</div>
          </div>
        </div>

        {/* Navigation Arrow */}
        <button 
          className={`nav-arrow ${isLogin ? 'arrow-left' : 'arrow-right'}`}
          onClick={handleNavigation}
          aria-label={isLogin ? 'Go to register' : 'Go to login'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d={isLogin ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Forms Container */}
        <div className="forms-wrapper">
          {/* Login Form */}
          <div className={`auth-form ${isLogin ? 'form-active' : 'form-hidden'}`}>
            <h1 className="form-title">Welcome Back!</h1>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input
                  id="loginEmail"
                  type="email"
                  className="form-input"
                  placeholder=" "
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <label htmlFor="loginEmail" className="floating">Email Address</label>
              </div>

              <div className="form-group">
                <div className="password-wrapper">
                  <input
                    id="loginPassword"
                    type={loginShowPassword ? 'text' : 'password'}
                    className="form-input has-toggle"
                    placeholder=" "
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <label htmlFor="loginPassword" className="floating">Password</label>
                   <button
                     type="button"
                     className="password-toggle"
                     onClick={() => setLoginShowPassword((s) => !s)}
                     aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                   >
                    {loginShowPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-7 0-11-7-11-7a22.9 22.9 0 0 1 5.4-5.94" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <select
                  className="form-select"
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                >
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="form-button">
                LOGIN
              </button>

              <div className="form-switch-text">
                <button type="button" className="form-switch-link" onClick={toggleForm}>
                  Register Instead
                </button>
              </div>
            </form>
          </div>
          {/* Register Form */}
          <div className={`auth-form ${!isLogin ? 'form-active' : 'form-hidden'}`}>
            <h1 className="form-title">Create an Account</h1>
            
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <input
                  id="fullName"
                  type="text"
                  className="form-input"
                  placeholder=" "
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <label htmlFor="fullName" className="floating">Full Name</label>
              </div>

              <div className="form-group">
                <input
                  id="registerEmail"
                  type="email"
                  className="form-input"
                  placeholder=" "
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <label htmlFor="registerEmail" className="floating">Email Address</label>
              </div>

              <div className="form-group">
                <div className="password-wrapper">
                  <input
                    id="registerPassword"
                    type={registerShowPassword ? 'text' : 'password'}
                    className="form-input has-toggle"
                    placeholder=" "
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <label htmlFor="registerPassword" className="floating">Password</label>
                   <button
                     type="button"
                     className="password-toggle"
                     onClick={() => setRegisterShowPassword((s) => !s)}
                     aria-label={registerShowPassword ? 'Hide password' : 'Show password'}
                   >
                    {registerShowPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-7 0-11-7-11-7a22.9 22.9 0 0 1 5.4-5.94" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <div className="password-wrapper">
                  <input
                    id="confirmPassword"
                    type={confirmShowPassword ? 'text' : 'password'}
                    className="form-input has-toggle"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label htmlFor="confirmPassword" className="floating">Confirm Password</label>
                   <button
                     type="button"
                     className="password-toggle"
                     onClick={() => setConfirmShowPassword((s) => !s)}
                     aria-label={confirmShowPassword ? 'Hide confirm password' : 'Show confirm password'}
                   >
                    {confirmShowPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-7 0-11-7-11-7a22.9 22.9 0 0 1 5.4-5.94" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <select
                  className="form-select"
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value)}
                >
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>

              <button type="submit" className="form-button">
                Register
              </button>

              <div className="form-switch-text">
                Already have an Account? 
                <button type="button" className="form-switch-link" onClick={toggleForm}>
                  Login here
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowForgotPassword(false)}
            >
              ×
            </button>
            <h2 className="modal-title">Reset Password</h2>
            <p className="modal-text">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <input
                  id="forgotEmail"
                  type="email"
                  className="form-input"
                  placeholder=" "
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <label htmlFor="forgotEmail" className="floating">Email Address</label>
              </div>
              <button type="submit" className="form-button">
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
