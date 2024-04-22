import React from "react";
import { Form, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import { Helmet } from "react-helmet";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/auth/requestPasswordReset",
        values
      );
      if (response.status === 200) {
        dispatch(HideLoading());
        message.success("Email Sent Successfully Please Check Your Email");
        localStorage.setItem("email", values.email);
        navigate("/email-sent");
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response.data.message);
    }
  };
  return (
    <>
    <Helmet>
      <title>Forgot Password</title>
    </Helmet>
    <Form onFinish={onFinish}>
    <div className="bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-100 h-screen flex items-center justify-center p-12 py-6">
      <div className="flex flex-col px-24 py-12 rounded-2xl bg-black bg-opacity-75">
       
              <div className="flex items-center">
                <div className="mx-auto md:mx-0">
                  <h3 className="text-4xl font-bold text-white">
                    Reset Password
                  </h3>
                  <p className="mt-2 max-w-[20rem] text-lg text-white/80">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>

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
                        className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-blue-500 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="floating_email"
                        className="absolute text-sm text-gray-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Email address
                      </label>
                    </div>
                  </Form.Item>
                  <div className="mt-5">
                    <button className="relative px-10 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Send Reset Code

                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
     
      </Form>
    </>
  );
}

export default ForgotPassword;
