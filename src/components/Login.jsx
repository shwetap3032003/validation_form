import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { Mail } from "lucide-react";
import { LogIn } from "lucide-react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required")
      .matches(
        /[!#$%^&*(),.?":{}|<>]/,
        "password must contain at least one symbol",
      )
      .matches(/[0-9]/, "password must contain at least one number")
      .matches(/[A-Z]/, "password must contain at least one uppercase letter")
      .matches(/[a-z]/, "password must contain at least one lowercase letter"),
  });

  return (
    <div className="pl-110 pt-15">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log(values);

          try {
            const res = await fetch("https://ex-5n9q.onrender.com/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: values.email,
                password: values.password,
                // expiresInMins: 30,
              }),
              // credentials: "include",
            });
            const result = await res.json();

            console.log(result.token);
            localStorage.setItem("authtoken", result.token);

            function authentication() {
              const token = localStorage.getItem("authtoken");
              if (token) {
                navigate("/users");
                console.log("token found");
              } else {
                console.log("no token found");
              }
            }

            if (res.ok) {
              authentication();
              console.log("login successfull");
              resetForm();
            } else {
              alert("login failed");
            }
            resetForm();
          } catch (error) {
            alert("Error occurred");
          }
        }}
      >
        <Form className="flex flex-col gap-5 shadow-xl w-100 p-5 rounded-2xl">
          <LogIn className="ml-35 size-10" />
          <h1 className="pl-20 text-2xl font-bold">Login With email</h1>
          <div className="pl-10">
            <label className="pl-1">Email:</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-gray-400" />
              <Field
                type="text"
                name="email"
                className="border rounded-2xl p-2 pl-10 w-70"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="text-red-500 pl-2">
              <ErrorMessage name="email" />
            </div>
          </div>
          <div className="pl-10">
            <label className="pl-1">Password:</label>
            <div className="relative flex items-center">
              <LockKeyhole className="absolute left-3 text-gray-400" />
              <Field
                className="border rounded-2xl p-2 pl-10 w-70"
                type="password"
                name="password"
                placeholder="Enter Your password"
              />
            </div>
            <div className="text-red-500 pl-2">
              <ErrorMessage name="password" />
            </div>
            <h2 className="pl-40">Forget Password?</h2>
          </div>
          <div className="flex pl-10 gap-5">
            <button
              type="submit"
              className="border rounded-2xl p-2 pl-30 pr-30 bg-blue-500 text-white"
            >
              Login
            </button>
          </div>
          <Link to="/signup" className="pl-38 text-blue-400">
            SignUp
          </Link>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;

// <button
//   onClick={() => {
//     setId(item.id);
//     setFormData(item, id);
//     setIsEditing(true);
//   }}
//   className="w-20 p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-700"
// >
//   Edit
// </button>
// <button
//   className="w-20 p-2 rounded-xl bg-red-500 text-white hover:bg-red-700"
//   key={index}
//   onClick={() => handleDelete(index)}
// >
//   Delete
// </button>

// login par api call karvani 6e
// response ma token ave te
// local storge ma store karavani
// token hoy to j taru pelu form dekhavu joye
