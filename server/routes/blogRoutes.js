const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')
const multer = require('multer')
const path = require('path')
const requireAuth = require('../middleware/requireAuth')
const requireRole = require('../middleware/requireRole')

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, './public/images')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
        }
    }
)

const upload = multer({
    storage: storage
})

router.use('/blogs', requireAuth)

router.get('/blogs', blogController.blog_index);
router.post('/blogs', upload.array('snippet', 5) ,blogController.blogPost);

router.post('/blogs/ticketPost', blogController.postTicketPost)
router.get('/blogs/ticketPosts/:id', blogController.getTicketPost)
router.get('/blogs/:id', blogController.getBlogById);
router.delete('/blogs/:id', requireRole('admin'), blogController.deleteBlogById);
router.delete('/blogs/ticketPost/:id', requireRole('admin'), blogController.deleteTicketPost)

// router.post('/blogs', upload.single('snippet'), blogController.blogPost);
// router.delete('/blogs/:id', blogController.deleteBlogById);
// // Other routes (not requiring specific roles)
// router.get('/blogs', blogController.blog_index);
// router.post('/blogs/ticketPost', blogController.postTicketPost);
// router.get('/blogs/ticketPosts/:id', blogController.getTicketPost);
// router.get('/blogs/:id', blogController.getBlogById);
// router.delete('/blogs/ticketPost/:id', blogController.deleteTicketPost);
module.exports = router;