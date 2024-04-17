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
    <div class="min-h-screen bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-300">

    <div class="h-screen md:flex">
	  <div class="relative overflow-hidden md:flex w-1/2 i justify-around items-center hidden">
		<div>
			<h1 class="text-white font-bold text-6xl font-sans">Welcome to Bussin'</h1>
			<p class="text-white text-xl mt-1">Make your reservation today!</p>
		</div>
		
	</div>
	<div class="flex md:w-1/2 justify-center items-center  ">
      <Helmet>
        <title>Register</title>
      </Helmet>

        <div className="w-full flex justify-center items-center p-5">
        <Helmet>
        <title>Login</title>
      </Helmet>
      <Form onFinish={onFinish}>
        <h1></h1>
        <div className="flex flex-col px-24 py-12 rounded-2xl bg-black bg-opacity-75 ">
            <h1 className="mb-16 text-5xl text-white text-center font-bold">
              Register
            </h1>
            <Form.Item
                name="name"
                initialValue=""
                rules={[
                  {
                    required: true,
                    message: "Please input your fullname!",
                    validateTrigger: "onSubmit",
                    validateFirst: true,
                  },
                ]}
              >
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    name="floating_fullname"
                    id="floating_fullname"
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-blue-500 dark:focus:border-blue-700 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_fullname"
                    className="absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Full Name
                  </label>
                </div>
              </Form.Item>
              <Form.Item
                name="email"
                initialValue=""
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                    validateTrigger: "onSubmit",
                  },
                ]}
              >
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="email"
                    name="floating_email"
                    className="block py-2.5 px-2.5 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-blue-500 dark:focus:border-blue-700 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_email"
                    className="absolute text-sm text-white dark:text-black duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email address
                  </label>
                </div>
              </Form.Item>
            
            
            <Form.Item
                name="password"
                initialValue=""
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                    min: 6,
                    validateTrigger: "onSubmit",
                  },
                ]}
              >
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type={passwordShown ? "text" : "password"}
                    name="floating_password"
                    className="block py-2.5 px-2.5 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-blue-500 dark:focus:border-blue-700 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_password"
                    className="absolute text-sm text-white dark:text-black duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Password
                  </label>
                  <i
                    className="absolute right-0 top-0 mt-3 mr-4 text-white cursor-pointer"
                    onClick={TogglePassword}
                  >
                    {passwordShown ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </i>
                </div>
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                initialValue=""
                rules={[
                  {
                    required: true,
                    message: "Please input your password again!",
                    min: 6,
                    validateTrigger: "onSubmit",
                  },
                ]}
              >
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type={passwordShown ? "text" : "password"}
                    name="floating_password"
                    className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-blue-500 dark:focus:border-blue-700 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_password"
                    className="absolute text-sm text-white dark:text-black duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Confirm Password
                  </label>
                  <i
                    className="absolute right-0 top-0 mt-3 mr-4 text-white cursor-pointer"
                    onClick={TogglePassword}
                  >
                    {passwordShown ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </i>
                </div>
              </Form.Item>
            <div className="flex justify-center mb-5">
            <button
                type="submit"
                className="relative px-10 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Create Account
              </button>
              </div>
              <p className="text-center text-base text-white mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-bold hover:text-blue-700"
                >
                  Login
                </Link>
              </p>
            </div>
    
      </Form>
    
        </div>
      </div>
	</div>
  </div>

    </>
  );
}

export default Register;
