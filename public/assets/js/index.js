let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

// Function to save a note
const saveNote = () => {
  const title = noteTitle.value.trim();
  const text = noteText.value.trim();

  if (title && text) {
    const newNote = {
      title,
      text,
    };

    // Use your saveNote function here
    saveNote(newNote).then(() => {
      // Clear the input fields after saving
      noteTitle.value = '';
      noteText.value = '';

      // Refresh the list of notes
      getAndRenderNotes();
    });
  }
};

// Listen for the Enter key press event in both fields
noteTitle.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent adding a newline character
    saveNote();
  }
});

noteText.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent adding a newline character
    saveNote();
  }
});

// ... (Your existing code)

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }

};

// Handle navigation to notes page
document.querySelector(".btn-primary").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/notes";
});

// Handle navigation back to home page
document.querySelector(".navbar-brand").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/";
});

// Handle save note button
document.querySelector(".save-note").addEventListener("click", () => {
  const title = document.querySelector(".note-title").value.trim();
  const text = document.querySelector(".note-textarea").value.trim();
  

  if (title && text) {
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, text }),
    })
    .then(response => response.json())
    .then(data => {
      document.querySelector(".note-title").value = '';
      document.querySelector(".note-textarea").value = '';
      getAndRenderNotes();
    });
  }
});

// Handle delete note button
document.querySelector(".list-group").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-note")) {
    const noteId = event.target.getAttribute('data-id');
    fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      getAndRenderNotes();
    });
  }
});

// Render notes list
const getAndRenderNotes = () => {
  fetch('/api/notes')
  .then(response => response.json())
  .then(notes => {
    const listContainer = document.querySelector('.list-group');
    listContainer.innerHTML = '';

    notes.forEach(note => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.innerHTML = `
        <span>${note.title}</span>
        <i class="fas fa-trash-alt float-right text-danger delete-note" data-id="${note.id}"></i>
      `;
      listContainer.appendChild(listItem);
    });
  });
};
// ... (Your existing code)

// Define an array to store saved notes
let savedNotes = [];

// Function to render the list of saved notes
const renderSavedNotes = () => {
  const noteList = document.querySelector('.list-container .list-group');
  noteList.innerHTML = ''; // Clear the list

  savedNotes.forEach((note, index) => {
    const listItem = createLi(note.title, true, note.id); // Create the list item
    noteList.appendChild(listItem); // Add the list item to the list
  });
};

// Function to create a list item with or without a delete button
const createLi = (text, delBtn = true, id = null) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item');

  const spanEl = document.createElement('span');
  spanEl.classList.add('list-item-title');
  spanEl.innerText = text;
  spanEl.addEventListener('click', handleNoteView);

  liEl.appendChild(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add(
      'fas',
      'fa-trash-alt',
      'float-right',
      'text-danger',
      'delete-note'
    );
    delBtnEl.setAttribute('data-id', id); // Set the data-id attribute for identifying the note
    delBtnEl.addEventListener('click', handleNoteDelete);

    liEl.appendChild(delBtnEl);
  }

  return liEl;
};

// Handle navigation to notes page
document.querySelector(".btn-primary").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/notes";
});

// Handle navigation back to home page
document.querySelector(".navbar-brand").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/";
});

// Handle save note button
document.querySelector(".save-note").addEventListener("click", () => {
  const title = document.querySelector(".note-title").value.trim();
  const text = document.querySelector(".note-textarea").value.trim();
});

// Initial render of notes
getAndRenderNotes();


if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
