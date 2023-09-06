const router = require('express').Router();

const fs = require('fs');

const uniqid = require('uniqid');


    router.get('/api/notes', (req, res) => {
      let notes = JSON.parse(fs.readFileSync('./db/db.json'));
        res.json(notes);
    });



    router.post('/api/notes', (req, res) => {
        const { title, text } = req.body;
        console.log(uniqid());
        if (req.body) {
            let oldNotes = JSON.parse(fs.readFileSync('./db/db.json'));
            const newNote = {
                title,
                text,
                id: uniqid()
                
            };
            console.log(oldNotes);
            oldNotes.push(newNote)
          let note = fs.writeFileSync('./db.json', JSON.stringify(oldNotes));
            res.json({ message: 'added new note.'})
            
        }
        console.log(req.body);
    });

    router.delete('/api/notes/:id', (req, res) => {
        const routerID = req.params.id;
        let oldNotes = JSON.parse(fs.readFileSync('./db/db.json'));
        const result = oldNotes.filter((note) => note.id !== routerID);
        note = fs.writeFileSync('./db/db.json', JSON.stringify(result));
        res.json('note has been deleted.')
    })

    

    module.exports = router;