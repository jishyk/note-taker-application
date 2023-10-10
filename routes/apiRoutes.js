const fs = require('fs').promises; // Use promise version
const path = require('path');
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const apiRoutes = require('./routes/apiRoutes');

const readNotes = async () => {
  try {
    const notesData = await fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8');
    return JSON.parse(notesData);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeNotes = async (notes) => {
  try {
    await fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), 'utf8');
  } catch (error) {
    console.error(error);
  }
};


router.get('/notes', async (req, res) => {
  const notes = await readNotes();
  res.json(notes);
});

router.get('/notes/', async (req, res) => {
  const noteId = req.params.id;
  console.log(`Trying to retrieve note with ID: ${noteId}`);
  const notes = await readNotes();
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    res.json(foundNote);
  } else {
    res.status(404).send('Note not found');
  }
});

router.post('/notes', async (req, res) => {
  const newNote = req.body;
  console.log('POST /notes:', req.body);
  
  // Validation
  if (!newNote.title || !newNote.text) {
    return res.status(400).send('Title and text are required');
  }
  
  const notes = await readNotes();
  newNote.id = uuidv4();
  notes.push(newNote);
  await writeNotes(notes);
  res.json(newNote);
});

router.delete('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  const notes = await readNotes();
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  await writeNotes(updatedNotes);
  res.json({ message: 'Note deleted successfully' });
});

module.exports = router;
