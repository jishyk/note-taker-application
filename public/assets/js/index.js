document.addEventListener('DOMContentLoaded', () => {
  let noteTitle;
  let noteText;
  let noteList;
  let saveNoteBtn;
  let newNoteBtn;

  if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    noteList = document.querySelector('.list-group');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
  }

  
  let activeNote = {};

  
  const show = (elem) => {
    elem.style.display = 'inline';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  const handleNewNoteView = () => {
    noteTitle.value = ''; 
    noteText.value = ''; 
    activeNote = {}; 
    renderActiveNote(); 
  };

  const getAndRenderNotes = () => {
    fetch('/api/notes')
      .then((response) => response.json())
      .then((notes) => {
        renderNoteList(notes);
      });
  };

  const renderNoteList = (notes) => {
    noteList.innerHTML = ''; 

    notes.forEach((note) => {
      const listItem = createLi(note.title, note.id);
      noteList.appendChild(listItem);
    });
  };

  const createLi = (text, id) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', () => handleNoteView(id));

    liEl.appendChild(spanEl);

    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add(
      'fas',
      'fa-trash-alt',
      'float-right',
      'text-danger',
      'delete-note'
    );
    delBtnEl.setAttribute('data-id', id);
    delBtnEl.addEventListener('click', () => handleNoteDelete(id));

    liEl.appendChild(delBtnEl);

    return liEl;
  };

  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };

    saveNote(newNote);
  };

  const handleNoteDelete = (id) => {
    deleteNote(id);
  };

  const handleNoteView = (id) => {
    fetch(`/api/notes/${id}`)
      .then((response) => response.json())
      .then((note) => {
        activeNote = note;
        renderActiveNote();
      });
  };

  const renderActiveNote = () => {
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

  const saveNote = (note) => {
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    }).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const deleteNote = (id) => {
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    }).then(() => {
      getAndRenderNotes();
      if (activeNote.id === id) {
        activeNote = {};
        renderActiveNote();
      }
    });
  };

  // Handle navigation to notes page
  document.addEventListener('DOMContentLoaded', () => {
    const btnPrimary = document.querySelector('.btn-primary');
    if (btnPrimary) {
      btnPrimary.addEventListener('click', (event) => {
        // Your click event handling code here
      });
    }
  });
  
  document.querySelector('.btn-primary').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/notes';
  });

  // Handle navigation back to home page
  document.querySelector('.navbar-brand').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/';
  });

  // Initial render of notes
  getAndRenderNotes();

  if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
  }

  function handleRenderSaveBtn() {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  }
});
