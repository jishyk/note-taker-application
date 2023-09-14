const fs = require('fs');
const path = require('path');
const router = require('express').Router();

function readNotes() {
  const notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
  return JSON.parse(notesData);
}
function writeNotes(notes) {
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), 'utf8');
}
router.get('/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});
router.post('/notes', (req, res) => {
  const newNote = req.body;
  const notes = readNotes();
  newNote.id = Date.now().toString(); 
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = readNotes();
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  writeNotes(updatedNotes);
  res.json({ message: 'Note deleted successfully' });
});

module.exports = router;
