
module.exports = (app) => {

    const Note = require('./mongoose-Model');

    // create a new note:
    app.post('/routes', (req, res) => {
        // validate request:
        if(!req.body.content) {
            return res.status(400).send({ message: "Note is empty!" });
        } else {
            // Create a Note
            const note = new Note({
                title: req.body.title,
                content: req.body.content
            });
            note.save()
                .then(data => res.send(data))
                .catch((err) => { res.status(500).send({ message: err.message || "Oops! Something went wrong!"})
                });
        }
    });


    // Retrieve all Notes
    app.get('/routes', (req, res) => {
        Note.find()
            .then(notes => res.send(notes))
            .catch(err => {
                res.status(500).send({message: err.message || "Oops! Something went wrong!"});
            })
    });

    // Retrieve a single Note with noteId
    app.get('/routes/:noteId', (req, res) => {
        Note.findById(req.params.noteId).then(note => {
            if(!note) {
                res.status(404).send({message: "Oops! Couldn't find note with id " + req.params.noteId});
            } else { res.send(note); }
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                res.status(404).send({message: "Oops! Couldn't find note with id " + req.params.noteId});
            } else {
                res.status(500).send({message: "Oops! Failed to retrieve your note."});
            }
        });
    });

    // Update a Note with noteId
    app.put('/routes/:noteId',(req, res) => {
        // Validate request
        if(!req.body.content) {
            res.status(400).send({message: "Note is empty!"});
        } else {
            // Find note and update it with the request body
            Note.findByIdAndUpdate(req.params.noteId, {
                title: req.body.title || "Untitled note",
                content: req.body.content
            }, {new: true})              // used to return the modified document to then() instead of the original
                .then(note => {
                    if(!note) {
                        res.status(404).send({message: "Oops! Couldn't find note with id " + req.params.noteId});
                    } else {
                        res.send(note);
                    }
                })
                .catch(err => {
                    if(err.kind === 'ObjectId') {
                        res.status(404).send({message: "Oops! Couldn't find note with id " + req.params.noteId});
                    } else {
                        res.status(500).send({message: "Oops! Couldn't update note with id " + req.params.noteId});
                    }
                });
        }
    });

    // Delete a Note with noteId
    app.delete('/routes/:noteId',(req, res) => {
        Note.findByIdAndRemove(req.params.noteId)
            .then(note => {
            if(!note) {
                res.status(404).send({message: "Oops! Couldn't find note with id " + req.params.noteId});
            } else {
                res.send({message: "Note deleted successfully!"});
            }
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                res.status(404).send({message: "Oops! Couldn't find note with id " + req.params.noteId});
            } else {
                res.status(500).send({message: "Oops! Couldn't delete note with id " + req.params.noteId});
            }
        });
    });
};