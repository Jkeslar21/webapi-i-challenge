// implement your API here
const express = require('express');
const db = require('./data/db');

const server = express();

server.use(express.json());


server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    !userInfo.name || !userInfo.bio
    ? res
        .status(400).json({ errorMessage: "Please provide name and bio for the user" })
    : db
        .insert(userInfo)
        .then(user => {
            res.status(201).json(user);
    })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
});

server.get('/api/users', (req, res) => {
    db
    .find()
    .then(db => {
        res.status(200).json(db);
    })
    .catch(err => {
        res.status(500).json({ error: "The users information could not be retrieved." });
    })
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db
    .findById(id)
    .then(user => {
        if (user.length === 0) {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        } else {
            res.status(200).json(id);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved." });
});
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    
    db
        .remove(id)
        .then(user => {
            if (user) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed" })
        })

    // !id
    // ? res.status(404).json({ message: "The user with the specified ID does not exist." })
    // : db
    //     .remove(id)
    //     .then(del => {
    //         res.status(204).end();
    //     })
    //     .catch(err => {
    //         res.status(500).json({ error: "The user could not be removed" });
    //     });
});

server.put('/api/users/:id', (req, res) => {
    const id =req.params.id;
    const changes = req.body;
    !changes.name || !changes.bio
    ? res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." })
    : db
        .update(id, changes)
        .then(count => {
            if (count === 0) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
            db
                .findById(id)
                .then(user => {
                    if (user.length === 0) {
                        res
                            .status(404)
                            .json({ message: "The user with the specified ID could not be located." })
                    } else {
                        res
                            .status(200)
                            .json(user)
                    }
                })
                .catch(err => {
                    res
                        .status(500)
                        .json({ message: "An error occured while attempting to locate the user."})
                })
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The user information could not be modified." })
        })
})

server.listen(5000, () => {
    console.log('\n**API up and running on port 5k **')
});