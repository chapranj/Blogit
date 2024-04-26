import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

import * as Yup from 'yup';

export default function CreateBlog() {
  const [previews, setPreviews] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [selectedUser, setselectedUser] = useState('')
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    else {
      getRegisteredUsers()
    }
  }, [user])



  const getRegisteredUsers = async () => {
    try {
      const userEmails = await axios.get(`http://localhost:3000/user/allUsers`)
      console.log(userEmails.data.users)
      setRegisteredUsers(userEmails.data.users)
    }
    catch (error) {
      console.log(error)
    }
  }

  const ticketUploadValidation = Yup.object().shape({
    title: Yup.string().required('Title is required!'),
    body: Yup.string().required('Please give a description!'),
    assignedTo: Yup.string().required('Assign this ticket to someone!'),
    category: Yup.string().required('Select a category for the ticket!'),
    priority: Yup.string().required('Select a priority for this ticket!')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      snippet: [],
      assignedTo: '',
      body: '',
      category: '',
      priority: ''
    },

    validationSchema: ticketUploadValidation,

    onSubmit: async (values) => {
      console.log('submitting')
      console.log(values)
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("body", values.body);
      values.snippet.forEach((file) => { formData.append("snippet", file) });
      formData.append("assignedTo", values.assignedTo);
      formData.append("createdBy", user.userId);
      formData.append("category", values.category);
      formData.append("priority", values.priority);

      try {
        const response = await axios.post(`http://localhost:3000/blogs`, formData, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (response) {
          console.log(response.data)
        }
        navigate('/');
      } catch (errors) {
        console.log(errors);
      }
    }
  });

  useEffect(() => {
    console.log(formik.errors);
  }, [formik.errors]);

  return (
    <div className="container mx-auto my-5 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-8">Enter Blog Details</h1>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            {...formik.getFieldProps("title")}
            type="text"
            className="form-input mt-2"
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500">{formik.errors.title}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="snippet" className="block text-sm font-medium text-gray-700">
            Snippet
          </label>
          <input
            id="snippet"
            name="snippet"
            type="file"
            multiple
            onChange={(e) => {
              setPreviews([]);
              let imageArray = [];
              Array.from(e.target.files).forEach((file) => {
                let reader = new FileReader();
                reader.onload = () => {
                  if (reader.readyState === 2) {
                    setPreviews((prevPreviews) => [...prevPreviews, reader.result]);
                    imageArray.push(reader.result);
                  }
                };
                reader.readAsDataURL(file);
              });
              formik.setFieldValue("snippet", imageArray);
            }}
            className="form-input mt-2"
          />
        </div>
        {previews.map((preview, index) => (
          <img key={index} src={preview} width="100" height="30" className="mr-4" alt={`Preview ${index}`} />
        ))}
        {/* <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Body
          </label>
          
          {formik.touched.body && formik.errors.body ? (
            <div className="text-red-500">{formik.errors.body}</div>
          ) : null}
        </div> */}

        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">Body</label>
          <textarea
            id="body"
            {...formik.getFieldProps('body')}
            rows="8"
            className="form-textarea px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600 text-base"
          ></textarea>
        </div>
        {formik.touched.body && formik.errors.body ? (
          <div className="text-red-500">{formik.errors.body}</div>
        ) : null}

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Select Category
          </label>
          <select name="category" id="category"
            {...formik.getFieldProps("category")}
            className="form-select mt-2"
          >
            <option value="" disabled hidden>
              Select Category
            </option>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
            <option value="Enhancement">Enhancement</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.category && formik.errors.category ? (
            <div className="text-red-500">{formik.errors.assignedTo}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Select Priority
          </label>
          <select name="priority" id="priority"
            {...formik.getFieldProps("priority")}
            className="form-select mt-2"
          >
            <option value="" disabled hidden>
              Select Priority
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {formik.touched.priority && formik.errors.priority ? (
            <div className="text-red-500">{formik.errors.priority}</div>
          ) : null}
        </div>


        <div className="mb-4">
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
            Assign To
          </label>
          <select
            id="assignedTo"
            {...formik.getFieldProps("assignedTo")}
            className="form-select mt-2"
          >
            <option value="" disabled hidden>
              Select Member
            </option>
            {registeredUsers.map((user, index) => (
              <option key={index} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
          {formik.touched.assignedTo && formik.errors.assignedTo ? (
            <div className="text-red-500">{formik.errors.assignedTo}</div>
          ) : null}
        </div>

        <div className="flex items-center">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700 transition duration-300 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
