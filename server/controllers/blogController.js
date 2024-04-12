const { BlogObj, TicketPostObj } = require('../models/blog');
const upload = require('../app')

const blog_index = (req, res) => {
    BlogObj.find()
        .populate('createdBy')
        .populate('assignedTo')
        .sort({ createdAt: -1 })
        .then(
            (response) => {
                res.send(response);
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
}

const postTicketPost = (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Missing required field content" })
    }
    const ticketPost = new TicketPostObj(req.body);
    ticketPost.save()
        .then(
            (response) => {
                res.send(response);
            }
        )
        .catch(
            (error) => { console.log(error) }
        )
}

const getTicketPost = (req, res) => {
    TicketPostObj.find({ ticketId: req.params.id })
        .populate('postedBy')
        .then(
            (response) => {
                console.log(req)
                console.log(response)
                res.send(response);
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
}

const deleteTicketPost = (req, res) => {
    TicketPostObj.findByIdAndDelete(req.params.id)
        .then((response) => {
            if (!response) {
                // If response is null, the post with the given id was not found
                return res.status(404).json({ success: false, error: "Ticket post not found" });
            }
            // If the post was successfully deleted, respond with a success message
            res.status(200).json({ success: true, message: "Ticket post deleted successfully" });
        })
        .catch(
            (error) => {
                console.log(error);
            }
        )
}

const blogPost = (req, res) => {
    const { title, snippet, body, assignedTo, createdBy } = req.body;

    console.log(req.body)
    // const snippets = req.files.map(file=>({filename:file.filename, path:file.path}));
    if (!title || !body || !assignedTo || !createdBy) {
        return res.status(400).json({ error: "Missing required fields!" })
    }
    const blog = new BlogObj({
        title: title,
        snippet: snippet,
        body: body,
        assignedTo: assignedTo,
        createdBy: createdBy
    });
    console.log("yes")
    console.log(blog)
    blog.save()
        .then(
            (response) => {
                res.send(response);
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
}

const getBlogById = (req, res) => {
    const id = req.params.id
    BlogObj.findById(id)
        .then(
            (response) => {
                res.send(response);
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
}

const deleteBlogById = async (req, res) => {
    const id = req.params.id;
    try {
        await BlogObj.findByIdAndDelete(id);

        await TicketPostObj.deleteMany({ ticketId: id });

        res.status(200).json({ success: true, message: 'Blog and associated ticket posts deleted successfully! ' });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error!' })
    }
}

module.exports = {
    blog_index,
    blogPost,
    getBlogById,
    deleteBlogById,
    postTicketPost,
    getTicketPost,
    deleteTicketPost
}