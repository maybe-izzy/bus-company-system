import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, message } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import bussinWelcomeImage from '../assets/img/bussinWelcome.png';
import { Helmet } from 'react-helmet';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Password and Confirm Password must be same');
      return;
    }

    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/auth/create-user', values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/login');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const TogglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="flex flex-wrap min-h-screen">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 bg-black" style={{ backgroundImage: `url(${bussinWelcomeImage})`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
        </div>
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-50 p-5">
          <Form onFinish={onFinish} className="w-full max-w-md">
            <h1 className="text-3xl text-center font-bold mb-6">Register</h1>
            
            {/* Form Fields */}
            <div className="items-center"> 
            <Form.Item name="name" rules={[{ required: true, message: 'Please input your full name!' }]}>
              <input placeholder="Full Name" className="input" />
            </Form.Item>
            </div>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
              <input placeholder="email" className="input" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!', min: 6 }]}>
              <input type={passwordShown ? "text" : "password"} placeholder="Password" className="input" />
            </Form.Item>
            
            <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!', min: 6 }]}>
              <input type={passwordShown ? "text" : "password"} placeholder="Confirm Password" className="input" />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <button type="button" onClick={TogglePassword} className="text-sm text-blue-600 hover:underline">
                {passwordShown ? 'Hide' : 'Show'} Password
              </button>
              <Link to="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Login</Link>
            </div>

            <button type="submit" className="btn btn-primary w-full">Create Account</button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Register;
