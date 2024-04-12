import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./security/AuthContext";


export default function Details() {
    const { blogId } = useParams();

    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [errorMsg, setErrorMsg] = useState('')
    const [message, setMessage] = useState('');
    const { user } = useAuth();
    const [ticketPosts, setTicketPosts] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false)

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


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-8">
                {blog ? (
                    <>
                        <h2 className="text-3xl font-semibold mb-4">
                            {blog.title}
                        </h2>
                        <div className="flex flex-wrap">
                            {blog.snippet.map((image, index) => (
                                <div key={index} className="w-1/2 p-1">
                                    <img
                                        src={image}
                                        alt={`Image ${index}`}
                                        className="w-full h-auto"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="content text-gray-700">
                            <p>
                                {blog.body}
                            </p>
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
