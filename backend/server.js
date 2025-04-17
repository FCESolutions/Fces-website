require('dotenv').config();

const express = require('express'); // import the express module
const app = express(); // create a new express app
const cors = require('cors');
const helmet = require('helmet');

// middleware
app.use(express.json())
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.listen(process.env.PORT, () => { // start the server and listen on the specified port
    console.log(`Server started on port`, process.env.PORT); // log a message to the console indicating that the server has started
});
