import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./security/AuthContext";
import { MdPriorityHigh, MdPriorityMedium, MdPriorityLow, MdOutlineFeaturedPlayList, MdAutoFixHigh } from 'react-icons/md'; // Import icons for different priority levels
import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import { IoBugOutline } from "react-icons/io5";
import { render } from "@testing-library/react";

import renderPriorityIcon from "./hooks/renderPriorityIcon";
import renderCategoryIcon from "./hooks/renderCategoryIcon";



export default function Details() {
    const { blogId } = useParams();

    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);

    const [updatedBlog, setUpdatedBlog] = useState(null);
    const [errorMsg, setErrorMsg] = useState('')
    const [message, setMessage] = useState('');
    const { user } = useAuth();
    const [ticketPosts, setTicketPosts] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false);
    const [changesMade, setChangesMade] = useState(false);

    useEffect(
        () => {
            if (!user) {
                navigate('/login')
            }
            else {
                loadBlog(blogId);
                loadTicketPosts(blogId);
                checkAuthorization()
            }
        }, [blogId]
    );

    useEffect(() => {
        if (blog) {
            setUpdatedBlog({ ...blog });
        }
        console.log(updatedBlog)
        console.log(blog)
    }, [blog]);

    function checkAuthorization() {
        setIsAdmin(user.role === 'admin');
        console.log(isAdmin)
    }


    async function loadTicketPosts(id) {
        try {
            const response = await axios.get(`http://localhost:3000/blogs/ticketPosts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            console.log(response.data);
            setTicketPosts(response.data);
        }
        catch {
            console.log("Did not work");
        }
    }

    async function loadBlog(id) {
        try {
            const response = await axios.get(`http://localhost:3000/blogs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            if (response.data) {
                setBlog(response.data);
                console.log(blog.snippet);

            }
            else {
                setErrorMsg("No Blog Found!")
            }
        }
        catch {
            console.log("Did not work");
        }
    }

    async function handleDelete(id) {
        try {
            await axios.delete(`http://localhost:3000/blogs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            navigate('/');
        }
        catch {
            console.log("Did not work");
        }
    }

    async function handleSubmitMessage() {
        try {
            const response = await axios.post(`http://localhost:3000/blogs/ticketPost`, { ticketId: blogId, content: message, postedBy: user.userId }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            if (response.data) {
                console.log("POsting")
                console.log(response.data);
                setMessage('');
                loadTicketPosts(blogId);
            }

            else {
                console.log("something weird happened")
            }

        }
        catch {
            console.log("ERROR!!")
        }
    }

    async function handleDeletePost(id) {
        try {
            await axios.delete(`http://localhost:3000/blogs/ticketPost/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            loadTicketPosts(blogId);
        }
        catch {
            console.log("Did not work");
        }
    }

    function handleEditModeClick() {
        if (!isEditMode) {
            setIsEditMode(true);
            setUpdatedBlog(blog)
        }
        else {
            setIsEditMode(false);
        }
    }


    useEffect(() => {
        if (JSON.stringify(updatedBlog) !== JSON.stringify(blog)) {
            console.log('different');
            setChangesMade(true);
        }
        else {
            console.log('same');
            setChangesMade(false);
        }
    }, [updatedBlog]);

    function handleChangesMade(property, value) {
        console.log("changes")
        setUpdatedBlog({ ...updatedBlog, [property]: value });

    }

    async function handleSaveChanges() {
        try {
            const response = await axios.put(`http://localhost:3000/blogs/${blogId}`, updatedBlog, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response) {
                console.log(response.data)
                setBlog(updatedBlog);
                setChangesMade(false);
                setIsEditMode(false);
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    function deleteThisSnippet(image) {
        const updatedSnippet = updatedBlog.snippet.filter(snippet => snippet !== image);
        console.log("Image: " + image);
        console.log(updatedSnippet);
        setUpdatedBlog({ ...updatedBlog, snippet: updatedSnippet })
        // console.log(image)

    }

    function handleAddPicture(images) {
        console.log(images)
        console.log(updatedBlog.snippet);
        // const extendedSnippet = [...updatedBlog.snippet, ...images]

        // console.log(extendedSnippet)
        setUpdatedBlog(prevState => ({
            ...prevState,
            snippet: [...prevState.snippet, ...images]
        }));
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-8">

                {blog ? (
                    <>
                        <div>
                            <button onClick={() => { handleEditModeClick() }}>Edit Mode</button>
                        </div>
                        <div>
                            {changesMade && (
                                <button onClick={handleSaveChanges}>Save Changes</button>
                            )}
                        </div>
                        <div className="flex flex-wrap mb-4">
                            <div className="w-1/2 p-1 flex items-center">
                                {isEditMode ? (
                                    <div className="w-1/2 p-1 flex items-center" >
                                        <select
                                            value={updatedBlog.priority}
                                            onChange={(e) => handleChangesMade('priority', e.target.value)}
                                            className="mr-2 text-green-500"
                                        >
                                            <option value="" disabled hidden>
                                                Select Priority
                                            </option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>

                                        <p className="ml-2"><strong>Priority:</strong>
                                            {updatedBlog.priority ? updatedBlog.priority : ''}
                                        </p>

                                    </div>

                                )
                                    :

                                    (
                                        <>
                                            {renderPriorityIcon(blog.priority)}
                                            <p className="ml-2"><strong>Priority:</strong>
                                                {blog.priority}
                                            </p>
                                        </>
                                    )}



                            </div>
                        </div>

                        <div className="flex flex-wrap mb-4">
                            <div className="w-1/2 p-1 flex items-center">
                                {isEditMode ? (
                                    <div className="w-1/2 p-1 flex items-center" >
                                        <select
                                            value={updatedBlog.category}
                                            onChange={(e) => handleChangesMade('category', e.target.value)}
                                            className="mr-2 text-green-500"
                                        >
                                            <option value="" disabled hidden>
                                                Select Category
                                            </option>
                                            <option value="Bug">Bug</option>
                                            <option value="Feature">Feature</option>
                                            <option value="Enhancement">Enhancement</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <p className="ml-2"><strong>Category:</strong>
                                            {updatedBlog.category ? updatedBlog.category : ''}
                                        </p>
                                    </div>
                                )
                                    :

                                    (
                                        <div>
                                            {renderCategoryIcon(blog.category)}
                                            <p className="ml-2"><strong>Category:</strong>
                                                {blog.category}
                                            </p>
                                        </div>
                                    )}



                            </div>
                        </div>

                        <h2 className="text-3xl font-semibold mb-4">
                            {
                                isEditMode ? (
                                    <div>
                                        <input type="text"
                                            onChange={(e) => handleChangesMade('title', e.target.value)}
                                            value={updatedBlog.title}
                                        ></input>
                                    </div>
                                )
                                    :
                                    (
                                        <p className="ml-2">
                                            {blog.title}
                                        </p>
                                    )
                            }



                        </h2>

                        <div className="flex flex-wrap">
                            {isEditMode ? (
                                updatedBlog.snippet.map((image, index) => (
                                    <>
                                        <div key={index} className="w-1/2 p-1">
                                            <img
                                                src={image}
                                                alt={`Image ${index}`}
                                                className="w-full h-auto max-w-sm"
                                            />
                                        </div>
                                        <button onClick={() => { deleteThisSnippet(image) }}>X</button>
                                    </>
                                ))
                            )

                                :
                                (
                                    blog.snippet.map((image, index) => (
                                        <div key={index} className="w-1/2 p-1">
                                            <img
                                                src={image}
                                                alt={`Image ${index}`}
                                                className="w-full h-auto max-w-sm"
                                            />
                                        </div>
                                    ))
                                )
                            }
                            {isEditMode && (
                                <div className="w-full flex justify-center mt-4">
                                    <label htmlFor="snippet">Add Images</label>
                                    <input
                                        id="snippet"
                                        name="snippet"
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            // setPreviews([]);
                                            let imageArray = [];
                                            Array.from(e.target.files).forEach((file) => {
                                                let reader = new FileReader();
                                                reader.onload = () => {
                                                    if (reader.readyState === 2) {
                                                        // setPreviews((prevPreviews) => [...prevPreviews, reader.result]);
                                                        imageArray.push(reader.result);
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            });
                                            // formik.setFieldValue("snippet", imageArray);
                                            handleAddPicture(imageArray);
                                        }}
                                        className="form-input mt-2"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="content text-gray-700">
                            {
                                isEditMode ? (
                                    <textarea
                                        onChange={(e) => handleChangesMade('body', e.target.value)}
                                        rows="8"
                                        className="form-textarea mt-2"
                                        value={updatedBlog.body}
                                    ></textarea>
                                )
                                    :
                                    (
                                        <p>
                                            {blog.body}
                                        </p>
                                    )
                            }

                        </div>
                        {isAdmin && <button className="delete mt-4 bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDelete(blog._id)}>Delete</button>}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                <div className="discussion mt-8">
                    <h3 className="text-xl font-semibold mb-4">Discussion</h3>
                    <ul>
                        {ticketPosts.map((post) => (
                            <li key={post._id} className="mb-4">
                                <div className="message">
                                    <p className="text-gray-700">{post.content}</p>
                                    <p className="text-sm text-gray-500">Created at: {new Date(post.createdAt).toLocaleString()} Posted By:{post.postedBy.email}</p>
                                    {isAdmin && <button className="delete mt-2.5 bg-red-200 text-white font-semibold px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDeletePost(post._id)}>Delete</button>}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="new-message mt-4">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            className="mt-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded hover:bg-indigo-700"
                            onClick={handleSubmitMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}
