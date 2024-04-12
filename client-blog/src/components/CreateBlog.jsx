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
    assignedTo: Yup.string().required('Assign this ticket to someone!')
  });


  const formik = useFormik({
    initialValues: {
      title: '',
      snippet: [],
      assignedTo: '',
      body: ''
    },

    validationSchema: ticketUploadValidation,

    onSubmit: async (values) => {
      console.log('submitting')
      console.log(values)
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("body", values.body);
      values.snippet.forEach((file) => { formData.append("snippet", file) })
      formData.append("assignedTo", values.assignedTo);
      formData.append("createdBy", user.userId)

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
    <div className="container mx-auto m-5">
      <h1 className="text-3xl font-semibold mb-4">Enter Ticket Details</h1>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            id="title"
            {...formik.getFieldProps('title')}
            type="text"
            className="form-input px-4 py-2 rounded border focus:outline-none focus:border-indigo-600"
          />
        </div>
        {formik.errors.title && <div>{formik.errors.title}</div>}
        <div className="mb-4">
          <label htmlFor="snippet" className="block text-sm font-medium text-gray-700 mb-2">Snippet</label>
          <input
            id="snippet"
            name="snippet"
            type="file"
            multiple
            onChange={(e) => {
              setPreviews([])
              let imageArray = []
              Array.from(e.target.files).forEach((file) => {
                let reader = new FileReader();

                reader.onload = () => {
                  if (reader.readyState === 2) {
                    // console.log(reader.result);
                    setPreviews(
                      (prevPreviews) => [...prevPreviews, reader.result]
                    )
                    imageArray.push(reader.result);
                  }
                };
                reader.readAsDataURL(file);
              });
              formik.setFieldValue("snippet", imageArray);
              console.log(imageArray)
            }}
            className="form-input"
          />
        </div>
        {previews.map((preview, index) => (
          <img key={index} src={preview} width="100" height="30" className="mr-4" />
        ))}
        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">Body</label>
          <textarea
            id="body"
            {...formik.getFieldProps('body')}
            rows="8"
            className="form-textarea px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600 text-base"
          ></textarea>
        </div>
        {formik.errors.body && <div>{formik.errors.body}</div>}
        <div>
          <label htmlFor="assignedTo">Assign To</label>
          <select name="assignedTo" 
          id="assignedTo" 
          {...formik.getFieldProps('assignedTo')}>
            <option value="" disabled hidden>
              Select Member
            </option>
            {registeredUsers.map((user, index) => (
              <option key={index} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
          {formik.errors.assignedTo && selectedUser === '' && <div>{formik.errors.assignedTo}</div>}
        </div>
        <div className="mb-4 flex items-center">
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
