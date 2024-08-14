import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { Toast } from 'primereact/toast';


function Login(props) {
  const router = useRouter();

  const toast = useRef(null);
 
  
  const formik = {
    initialValues: { username: "", password: "" },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = "Field is required";
      }
      if (!values.password) {
        errors.password = "Field is required";
      }
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      router.push("/comments");
      toast.current.show({ 
        severity: 'success', 
        summary: 'Login Success', 
        life: 3000 
    });
      setSubmitting(false);
    },
  };
  return (
    <div className=" w-full h-screen flex justify-center items-center">
       <Toast ref={toast} />
      <div className=" md:w-[538px] w-5/6 h-[504px] bg-white border border-[#D6D6D6] px-[32px] pt-[62px] rounded-[26px]">
        <div className="font-semibold text-[35px]">Login</div>
        <div className="text-[25px] mb-[47px]">to get started</div>
        <Formik {...formik}>
          {({ isSubmitting }) => (
            <Form>
              <div className="relative  mb-3">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="border border-[#EAEAEA] text-[15px] mb-[22px] rounded-[10px] px-[27px] pt-[16px] pb-[14px] w-full shadow-md "
                />
                <ErrorMessage
                className="text-xs text-red-500  absolute bottom-0"
                  name="username"
                  component="div"
                />
              </div>
              <div className="relative  mb-3">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border border-[#EAEAEA] text-[15px] mb-[22px] rounded-[10px] px-[27px] pt-[16px] pb-[14px] w-full shadow-md "
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-xs text-red-500  absolute bottom-0"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className=" w-full bg-[#0016DF] text-center text-white  px-[27px] pt-[16px] pb-[14px] rounded-[10px] "
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
