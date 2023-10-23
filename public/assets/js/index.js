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
      // id: uuidv4(), // Use uuidv4() for generating unique IDs
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch note with ID ${id}`);
        }
        return response.json();
      })
      .then((note) => {
        activeNote = note;  
        renderActiveNote();
      })
      .catch((error) => {
        console.error(error);
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

  function deleteNote(id) {
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        getAndRenderNotes(); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

  document.addEventListener, () => {
    const btnPrimary = document.querySelector('.btn-primary');
    if (btnPrimary) {
      btnPrimary.addEventListener('click', (event) => {
        
      });
    }

    document.querySelector('.navbar-brand').addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = '/';
    });
  };
  
    document.querySelector('.btn-primary').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/notes';
  });
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
