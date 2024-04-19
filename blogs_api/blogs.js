const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logToFile = require('log-to-file');
//const logger = require('./logger');
const app = express();
const PORT = 6000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://aishureddy:root321@cluster0.dwoumuu.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schema and model
const blogSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Blog = mongoose.model('Blog', blogSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    const startTime = Date.now(); // Start time when request is received
  
    res.on('finish', () => {
      const elapsedTime = Date.now() - startTime; // Elapsed time between request and response
      const statusCode = res.statusCode; // Status code of the response
      const logMessage = `${req.method} ${req.url} responded with status ${statusCode} in ${elapsedTime} ms`;
      logToFile(logMessage, "blog_logs.txt");
    });
  
    next();
  });
// Routes
app.get('/blogs', (req, res) => {
    Blog.find({})
    .then(foundBlogs => {
        // Log the successful retrieval of blogs
        logToFile("all the blogs", "blog_logs.txt");
        res.send(foundBlogs);
    })
    .catch(err => {
        // Log the error and send a 500 status response
        logToFile("error fetching the blogs: " + err.message, "blog_logs.txt");
        res.status(500).send(err);
    });

});

app.post('/blogs', (req, res) => {
    const { title, content } = req.body;
    const newBlog = new Blog({
        title,
        content
    });

    newBlog.save() 
    .then(result => {
        //logger.log("blog created sussfully");
        logToFile("created the blog","blog_logs.txt");
        res.send("user created sussfully");
    })
    .catch(err => {
        //logger.log("blog not created sussfully");
        logToFile("error creating the blog","blog_logs.txt");
        res.status(500).send(err);
    });

});

app.delete('/blogs', (req, res) => {
    Blog.deleteMany({})
    .then(() => {
        // Log the successful deletion of blogs
        logToFile("deleted all blogs", "blog_logs.txt");
        res.send('Successfully deleted all blogs.');
    })
    .catch(err => {
        // Log the error and send a 500 status response
        logToFile("error deleting blogs: " + err.message, "blog_logs.txt");
        res.status(500).send(err);
    });

});



// Example usage in an Express middleware

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    logToFile(`blogs app listening at http://localhost:${PORT}`, "blog_logs.txt");
});
