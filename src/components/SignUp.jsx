import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formKey = "reactForm";

const SignUp = () => {
  const navigate = useNavigate();
  const id = useParams();

  // console.log("editsignupid", id.editId);

  //   async function handleSignUp(value) {
  //     console.log(value);
  //     let result = await fetch("https://ex-5n9q.onrender.com/api/register", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: value,
  //     //   credentials: "include", // Include cookies (e.g., accessToken) in the request
  //     });
  //     result = await result.json();
  //     console.log("result", result);
  //   }

  const [startDate, setStartDate] = useState(new Date());

  const [data, setData] = useState(() => {
    const rawForm = localStorage.getItem(formKey);
    if (!rawForm) return [];
    return JSON.parse(rawForm);
  });

  // const [id, setId] = useState(0);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  localStorage.setItem(formKey, JSON.stringify(data));

  const validationSchema = Yup.object({
    firstname: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Firstname cannot contain numbers")
      .min(3, "firstname contain atleast 3 character")
      .required("Firstname is required"),
    middlename: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Middlename cannot contain numbers")
      .min(3, "middlename contain atleast 3 character")
      .required("Middlename is required"),
    lastname: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Lastname cannot contain number")
      .min(3, "lastname contain atleast 3 character")
      .required("Lastname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.string().required("select a radio button"),
    hobbies: Yup.array()
      .min(1, "select at least one hobbie")
      .required("select at least one hobbie"),
    profession: Yup.string().required("profession is required"),
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
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password")], "passwords must match")
      .required("confirmpassword is required"),
    birthday: Yup.date()
      .max(new Date(), "Future dates are not allowed")
      .required("Date of birth is required"),
    address: Yup.string().required("Address is required"),
  });
  const emptyData = {
    firstname: formData?.firstname || "",
    middlename: formData?.middlename || "",
    lastname: formData?.lastname || "",
    email: formData?.email || "",
    gender: formData?.gender || "",
    hobbies: formData?.hobbies || "",
    profession: formData?.profession || "",
    birthday: formData?.birthday || "",
    password: formData?.password || "",
    confirmpassword: formData?.confirmpassword || "",
    address: formData?.address || "",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://ex-5n9q.onrender.com/api/users/${id.editId}`,
        );
        setFormData(response.data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsEditing(false);
      }
    };

    fetchUserData();
  }, [id.editId]);

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setData((prevData) => prevData.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    setFormData(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col">
      <Formik
        validationSchema={validationSchema}
        initialValues={emptyData}
        enableReinitialize
        onSubmit={async (value, { resetForm }) => {
          if (isEditing) {
            try {
              await axios.put(
                `https://ex-5n9q.onrender.com/api/users/${id.editId}`,
                value,
              ); // Use PUT/PATCH for update
              alert("User updated successfully!");
              navigate(`/users`); // Redirect after successful update
              console.log(value);
            } catch (error) {
              console.error("Error updating user data:", error);
              setIsEditing(false);
            }
          } else {
            try {
              const res = await fetch(
                "https://ex-5n9q.onrender.com/api/register",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(value),
                },
              );

              if (res.ok) {
                console.log("Registration successful");
                resetForm();
                navigate("/users");
              } else {
                alert("Registration failed");
              }
            } catch (error) {
              alert("Error occurred");
            }
          }
          resetForm();
        }}
      >
        <Form className="m-3">
          <h1 className="pl-125 pb-2 text-2xl font-bold">Registration Form</h1>
          <div className="p-3 pl-4 pt-5 w-210 ml-50 rounded-2xl shadow-xl">
            <div className="pl-6 text-blue-500">
              <li>Personal Information</li>
            </div>
            <div className="flex gap-5 pb-5">
              <div className="mb-3">
                <label className="p-3">FirstName: </label>
                <br />
                <Field
                  className="border pl-2 ml-2 rounded w-60 p-1.5 hover:bg-blue-50"
                  type="text"
                  name="firstname"
                  placeholder="Enter Your FirstName"
                  onKeyDown={(e) => {
                    if (/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="firstname" />
                </div>
              </div>
              <div className="mb-3">
                <label className="p-3">MiddleName: </label>
                <br />
                <Field
                  className="border pl-2 ml-2 rounded w-60 p-1.5 hover:bg-blue-50"
                  type="text"
                  name="middlename"
                  placeholder="Enter Your MiddleName"
                  onKeyDown={(e) => {
                    if (/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="middlename" />
                </div>
              </div>
              <div className="mb-3">
                <label className="p-3">LastName: </label>
                <br />
                <Field
                  className="border pl-2 ml-2 rounded w-60 p-1.5 hover:bg-blue-50"
                  type="text"
                  name="lastname"
                  placeholder="Enter Your LastName"
                  onKeyDown={(e) => {
                    if (/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="lastname" />
                </div>
              </div>
            </div>
            <div className="pl-6 text-blue-500">
              <li>Contact Information</li>
            </div>
            <div className="flex gap-5 pb-5">
              <div className="mb-3">
                <label className="p-3">Email: </label>
                <br />
                <Field
                  type="text"
                  name="email"
                  className="border pl-2 ml-2 rounded w-60 p-1.5 hover:bg-blue-50"
                  placeholder="Enter Your Email"
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="email" />
                </div>
              </div>
              <div className="mb-3">
                <label className="p-3">Date Of Birth:</label>
                <br />
                <Field
                  className="border w-60 p-1.5 ml-2 rounded hover:bg-blue-50"
                  type="date"
                  max="2026-03-21"
                  name="birthday"
                  placeholder="Enter Your Birthdate"
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="birthday" />
                </div>
              </div>
              <div className="mb-3">
                <label className="p-3">Address:</label>
                <br />
                <Field
                  className="border w-60 p-1.5 ml-2 rounded hover:bg-blue-50"
                  type="text"
                  name="address"
                  placeholder="Enter Your Address"
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="address" />
                </div>
              </div>
            </div>
            <div className="pl-6 text-blue-500">
              <li>Additional Information</li>
            </div>
            <div className="flex gap-70 ">
              <div className="mb-3">
                <label className="p-3">Gender:</label>
                <br />
                <Field
                  type="radio"
                  name="gender"
                  value="Male"
                  className="ml-3 hover:bg-blue-50"
                />
                Male
                <Field
                  type="radio"
                  name="gender"
                  value="Female"
                  className="ml-5 mt-3 hover:bg-blue-50"
                />
                Female
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="gender" />
                </div>
              </div>
              <div className="mb-3">
                <label className="pl-4">Profession:</label>
                <br />
                <Field
                  name="profession"
                  as="select"
                  className="border ml-3 w-89 p-1.5 rounded hover:bg-blue-50"
                >
                  <option value="select">Select</option>
                  <option value="student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Engineer">Engineer</option>
                </Field>
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="profession" />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label className="p-3">Hobbies: </label>
              <br />
              <label>
                <Field
                  type="checkbox"
                  name="hobbies"
                  value="playing"
                  className="ml-3 mt-3 hover:bg-blue-50"
                />
                Playing
              </label>
              <label>
                <Field
                  type="checkbox"
                  name="hobbies"
                  value="singing"
                  className="ml-10 hover:bg-blue-50"
                />
                Singing
              </label>
              <label>
                <Field
                  type="checkbox"
                  name="hobbies"
                  value="reading"
                  className="ml-10 hover:bg-blue-50"
                />
                Reading
              </label>
              <label>
                <Field
                  type="checkbox"
                  name="hobbies"
                  value="dancing"
                  className="ml-10 hover:bg-blue-50"
                />
                Dancing
              </label>
              <div className="text-red-500 pl-3">
                <ErrorMessage name="hobbies" />
              </div>
            </div>
            <div className="pl-6 text-blue-500">
              <li>Security</li>
            </div>
            <div className="flex gap-5">
              <div className="mb-3">
                <label className="p-3">Password: </label>
                <br />
                <Field
                  className="border pl-2 ml-2 rounded w-95 p-1.5 hover:bg-blue-50"
                  type="password"
                  name="password"
                  placeholder="Enter Your password"
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="password" />
                </div>
              </div>
              <div className="mb-3">
                <label className="p-3">ConfirmPassword: </label>
                <br />
                <Field
                  className="border pl-2 ml-2 rounded w-95 p-1.5 hover:bg-blue-50"
                  type="password"
                  name="confirmpassword"
                  placeholder="Enter Confirm password"
                />
                <div className="text-red-500 pl-3">
                  <ErrorMessage name="confirmpassword" />
                </div>
              </div>
            </div>
            <div className="flex pl-2 gap-2">
              {isEditing ? (
                <button
                  className="w-30 mt-3 p-2 rounded-xl bg-blue-600 shadow-md shadow-blue-600 text-white hover:bg-green-700"
                  type="submit"
                >
                  Update
                </button>
              ) : (
                <button
                  className="w-30 mt-3 p-2 rounded-xl  bg-blue-600 font-bold shadow-md shadow-blue-600 text-white hover:bg-green-700"
                  type="submit"
                  //   onClick={handleSignUp}
                >
                  Submit
                </button>
              )}
              <br />
              <button
                onClick={handleReset}
                className="w-20 mt-3 p-2 rounded-xl bg-gray-400 font-bold shadow-md shadow-gray-400 text-white hover:bg-amber-600"
                type="reset"
              >
                Reset
              </button>
            </div>
          </div>
        </Form>
      </Formik>

      {/* <div className="flex justify-center items-center">
           <h2 className="p-2 text-2xl text-bold">Submitted Data</h2>
         </div>
         {data.length > 0 && (
           <div className="p-4 overflow-x-auto">
             <table className="min-w-full border-collapse border border-gray-300 shadow-xl">
               <thead className="bg-blue-300">
                 <tr>
                   <th className="border border-gray-300 p-2">FirstName</th>
                   <th className="border border-gray-300 p-2">MiddleName</th>
                   <th className="border border-gray-300 p-2">LastName</th>
                   <th className="border border-gray-300 p-2">Email</th>
                   <th className="border border-gray-300 p-2">Gender</th>
                   <th className="border border-gray-300 p-2">Hobbies</th>
                   <th className="border border-gray-300 p-2">Profession</th>
                   <th className="border border-gray-300 p-2">DOB</th>
                   <th className="border border-gray-300 p-2">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {data.map((item, index) => (
                   <tr key={item.id || index} className="hover:bg-gray-50">
                     <td className="border border-gray-300 p-2 text-center">{item.firstname}</td>
                     <td className="border border-gray-300 p-2 text-center">{item.middlename}</td>
                     <td className="border border-gray-300 p-2 text-center">{item.lastname}</td>
                     <td className="border border-gray-300 p-2 text-center">{item.email}</td>
                     <td className="border border-gray-300 p-2 text-center">{item.gender}</td>
                     <td className="border border-gray-300 p-2 text-center">{item.hobbies.join(", ")}</td>
                     <td className="border border-gray-300 p-2 text-center">{item.profession}</td>
                     <td className="border border-gray-300 p-2 text-center">{item.dob}</td>
                     <td className="border border-gray-300 p-2 text-center">
                       <div className="flex gap-2 justify-center">
                         <button
                           onClick={() => {
                             setId(item.id);
                             setFormData(item);
                             setIsEditing(true);
                           }}
                           className="px-3 py-1 rounded-xl bg-blue-500 text-white hover:bg-blue-700 text-sm"
                         >
                           Edit
                         </button>
                         <button
                           className="px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-700 text-sm"
                           onClick={() => handleDelete(index)}
                         >
                           Delete
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )} */}
    </div>
  );
};

export default SignUp;
