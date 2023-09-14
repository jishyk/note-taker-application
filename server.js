const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});
const readNotesFromFile = () => {
  const notesFilePath = path.join(__dirname, 'db', 'db.json');
  const notesData = fs.readFileSync(notesFilePath, 'utf8');
  return JSON.parse(notesData);
};
const saveNotesToFile = (notes) => {
  const notesFilePath = path.join(__dirname, 'db', 'db.json');
  fs.writeFileSync(notesFilePath, JSON.stringify(notes));
};

app.get('/api/notes', (req, res) => {
  const notes = readNotesFromFile();
  res.json(notes);
});
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uniqid(); 
  const notes = readNotesFromFile();
  notes.push(newNote);
  saveNotesToFile(notes);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = readNotesFromFile();
  notes = notes.filter((note) => note.id !== noteId);
  saveNotesToFile(notes);
  res.json({ message: 'Note deleted' });
});

app.get('/public/assets/js/index.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'public/assets/js/index.js'));
});

app.get('/public/assets/css/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'public/assets/css/style.css'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
