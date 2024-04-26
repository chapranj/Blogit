import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './security/AuthContext';
import Details from './Details';
// import renderPriorityIcon from './Details';
import renderPriorityIcon from './hooks/renderPriorityIcon';
import renderCategoryIcon from './hooks/renderCategoryIcon'

export default function Home() {

    const [blogs, setBlogs] = useState([])
    const [filteredBlogs, setFilteredBlogs] = useState([])
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('')
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');



    useEffect(
        () => {
            if (!user) {
                navigate('/login')
            }
            else {
                refreshBlogs();
            }
        }, []
    );

    async function refreshBlogs() {
        try {
            const response = await axios.get(`http://localhost:3000/blogs`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            if (response) {
                setBlogs(response.data)
                setErrorMsg(null)
                setIsLoading(false)
            }
            else {
                setErrorMsg("No Blogs Found!")
                setIsLoading(true)
            }
        }
        catch {
            console.log("error")
        }
    }

    function handleSearch(e) {
        const search = e.target.value.toLowerCase();
        console.log(search)
        setSearchTerm(search);
        const filteredResults = blogs.filter(blog =>
            blog.title.toLowerCase().includes(searchTerm) || // Check if title includes search term
            blog.assignedTo.email.toLowerCase().includes(searchTerm) || // Check if assignedTo email includes search term
            blog.createdBy.email.toLowerCase().includes(searchTerm) // Check if createdBy email includes search term
        )
        setFilteredBlogs(filteredResults);
        console.log(filteredResults)

    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-4">All Tickets</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by title or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="px-4 py-2 border rounded w-full"
                />
            </div>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            {isLoading && <p className="text-black-700">Loading Tickets...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchTerm === '' ? (
                    // Render all tickets when search bar is empty
                    blogs.map(blog => (
                        <div key={blog._id} className="bg-white p-4 rounded-lg shadow">
                            <Link to={`/blog/${blog._id}`} className="block">
                                <div className="flex justify-between">
                                    <h3 className="text-xl font-semibold mb-2 ml-2">{blog.title}</h3>
                                    <div className="flex items-center" >
                                        <span>{renderPriorityIcon(blog.priority)}</span>
                                        <span>{renderCategoryIcon(blog.category)}</span>
                                    </div>

                                </div>
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
                                <span>Assigned To: {blog.assignedTo.email}</span> <br />
                                <span>Assigned By: {blog.createdBy.email}</span>
                            </Link>
                        </div>
                    ))
                ) : (
                    // Render filtered tickets when there is a search term
                    filteredBlogs.map(blog => (
                        <div key={blog._id} className="bg-white p-4 rounded-lg shadow">
                            <Link to={`/blog/${blog._id}`} className="block">
                                <div className="flex items-center">
                                    <span>{renderPriorityIcon(blog.priority)}</span>
                                    <span>{renderCategoryIcon(blog.category)}</span>
                                    <h3 className="text-xl font-semibold mb-2 ml-2">{blog.title}</h3>
                                </div>
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
                                <span>Assigned To: {blog.assignedTo.email}</span> <br />
                                <span>Assigned By: {blog.createdBy.email}</span>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

};


