document.addEventListener('DOMContentLoaded', function () {
  const notesForm: HTMLFormElement | null = document.querySelector("#noteForm");
  const noteInput:HTMLInputElement | null = document.querySelector("#noteInput"); 
  const viewNote: HTMLElement | null = document.querySelector("#viewNotes");

  // add notes
  if (notesForm && noteInput && viewNote) {
      notesForm.addEventListener('submit', function (evt: Event) {
          evt.preventDefault();
          let noteText: string = noteInput.value;
          console.log(noteText);
          noteText.trim() !== "" ? addNoteToLocalStorage(noteText) : alert("Please Enter Something!");
          noteInput.value = "";
      });

      function addNote(noteText: string): void {
          const note: HTMLDivElement = document.createElement('div');
          note.classList.add('note');
          note.innerHTML = `
              <span>${noteText}</span>
              <div class="action-buttons">
                  <button class="edit">✍️</button>
                  <button class="delete">🗑️</button>
              </div>
          `;
          if (viewNote) {
              viewNote.appendChild(note);
              // delete note
              const deleteBtn: HTMLButtonElement | null = note.querySelector('.delete');
              if (deleteBtn) {
                  deleteBtn.addEventListener('click', () => {
                      if (viewNote.contains(note)) {
                          viewNote.removeChild(note);
                          updateLocalStorage();
                      }
                  });
              }
              // edit the note
              const editBtn: HTMLButtonElement | null = note.querySelector(".edit");
              const noteTextElement: HTMLElement | null = note.querySelector('span');
              if (editBtn && noteTextElement) {
                  editBtn.addEventListener('click', () => {
                      const newText: string | null = prompt("Edit text: ", noteTextElement.innerText);
                      if (newText !== null && newText !== "") {
                          noteTextElement.innerText = newText;
                          updateLocalStorage();
                      }
                  });
              }
          }
      }

      function addNoteToLocalStorage(noteText: string): void {
          const notes: string[] = getLocalStorageItem();
          notes.push(noteText);
          localStorage.setItem('notes', JSON.stringify(notes));
          addNote(noteText);
      }

      function getLocalStorageItem(): string[] {
          const storedNotes: string | null = localStorage.getItem('notes');
          return storedNotes ? JSON.parse(storedNotes) : [];
      }

      function updateLocalStorage(): void {
          // noteList is not an array but a DOM nodeList
          const noteList: NodeListOf<HTMLElement> = document.querySelectorAll('.note span');
          // convert noteList to an array and store each span's text content
          // to the notes array
          // 2nd way: use Array.from(notes)
          const notes: string[] = Array.from(noteList).map(note => note.textContent || "");
          localStorage.setItem('notes', JSON.stringify(notes));
      }

      // display local storage items
      function loadLocalStorageItems(): void {
          const notes: string[] = getLocalStorageItem();
          notes.forEach(note => addNote(note));
      }

      loadLocalStorageItems();
  }
});
