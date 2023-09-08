const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
const uniqueID = uniqid(); 

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require('./routes/apiRoutes');
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


// app.get('/api/notes', (req, res) => {
//   const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
//   res.json(notes);
// });

// app.post('/api/notes', (req, res) => {
//   const newNote = req.body;
//   newNote.id = uniqid();
//   const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
//   notes.push(newNote);
//   fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
//   res.json(newNote);
// });

// app.delete('/api/notes/:id', (req, res) => {
//   const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
//   const noteId = req.params.id;
//   const filteredNotes = notes.filter((note) => note.id !== noteId);
//   fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(filteredNotes));
//   res.json({ message: 'Note deleted' });
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
