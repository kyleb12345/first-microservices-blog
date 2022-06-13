const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});


app.post('/posts/create', async (req, res) => {
    // 'hex' is for hexidecimal for the key
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

//this is the even that is sent to the event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id, 
            title
        }
    });

//sending the post
    res.status(201).send(posts[id]);
});


//sending events with event bus
app.post('/events', (req, res) => {
    console.log('received event', req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log('v55');
    console.log('Listening on port 4000');
});