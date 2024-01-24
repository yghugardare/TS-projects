import './style.css'

// hamburger nav icon design
const menuBtn = document.querySelector('.hamburger') as HTMLDivElement;
const navItems = document.querySelector('.navItems') as HTMLDivElement;
// navAnchortag is node list
const navAnchortag = document.querySelectorAll('.navItems>a') as NodeListOf<HTMLAnchorElement> ;
function showNav():void{
    navItems.classList.toggle('show');
}
menuBtn.addEventListener('click',showNav);
// console.log(navAnchortag);
navAnchortag.forEach((aTag:HTMLAnchorElement)=>{
    aTag.addEventListener('click',showNav);
})
/*--------------------------------------------------------------------------------------------------------*/
// hanburger logic ends here
// changing navbar color from section to other.
// using scroll event
// offset height is height of the element
// offset top is height from body to that section
// scroll y tells the current position
const sections:NodeListOf<HTMLElement> = document.querySelectorAll('section');
const nav:HTMLElement|null = document.querySelector('nav');
function activateNav():void{
    sections.forEach((section:HTMLElement)=>{
        let sectionHeight:number = section.offsetHeight;
        let sectionStart:number = section.offsetTop;
        let curPosition:number = window.scrollY;
        
        if (curPosition >= sectionStart && curPosition <= sectionStart + sectionHeight-10){
            let sectionId:string|null = section.getAttribute('id');
            navAnchortag.forEach((aTag:HTMLAnchorElement)=>{
                aTag.classList.remove('active');
                const matchingAnchor:HTMLElement|null = document.querySelector(`.navItems a[href*=${sectionId}]`);
                    if (matchingAnchor) {
                        matchingAnchor.classList.add('active');
                    }
            });
        }
    });
}
window.addEventListener('scroll',activateNav);
// changing navbar color logic ends here
/*--------------------------------------------------------------------------------------------------------*/
// Notes app starts here
// DOMContentLoaded event is commonly used in JavaScript to 
// ensure that your code runs only after the HTML document has
// been fully loaded, which is essential for web applications 
// to prevent JavaScript from trying to access elements that don't yet exist 
// in the DOM. 
document.addEventListener("DOMContentLoaded",function(){
  const notesForm:HTMLFormElement|null = document.querySelector("#noteForm");
  const noteInput:HTMLInputElement | null = document.querySelector("#noteInput"); 
  const viewNote: HTMLDivElement | null = document.querySelector("#viewNotes");
  // add notes
  if(noteInput && notesForm && viewNote){
    notesForm.addEventListener("submit",function(evt:Event){
      evt.preventDefault();
      let noteText:string = noteInput.value;
      noteText.trim()!==""? addNoteToLocalStorage(noteText):alert("Please enter something!");
      noteInput.value = "";
    });
    function addNote(noteText:string):void{
      const note:HTMLDivElement = document.createElement("div");
      note.classList.add("note");
      note.innerHTML = `
      <span>${noteText}</span>
      <div class="action-buttons">
          <button class="edit">✍️</button>
          <button class="delete">🗑️</button>
      </div>
  `;
      if(viewNote){
        viewNote.appendChild(note);
        // delete button
        const deleteBtn:HTMLButtonElement | null = note.querySelector(".delete");
        if(deleteBtn){
          deleteBtn.addEventListener("click",()=>{
            if(viewNote.contains(note)){
              viewNote.removeChild(note);
              // update it in our local stroge
              updateLocalStorage()
            }
          })
        }
        // edit button
        const editBtn:HTMLButtonElement|null = note.querySelector(".edit");
        const noteTextElement: HTMLSpanElement | null = note.querySelector('span');
        if(editBtn && noteTextElement){
          editBtn.addEventListener("click",()=>{
            const newText:string|null = prompt("Edit Text: ",noteTextElement.innerText);
            if (newText !== null && newText.trim() !== "") {
              noteTextElement.innerText = newText;
              updateLocalStorage();
          }
          })
        }

      }

    }
    function updateLocalStorage():void{
      // noteList is not an array but a DOM nodeList
      const noteList:NodeListOf<HTMLSpanElement> = document.querySelectorAll(".note span")
      // convert noteList to an array and store each span's text content
      // to the notes array
      // 2nd way: use Array.from(notes)
      const notes:string[] = [...noteList].map(note=> note.textContent || "")
      localStorage.setItem("notes",JSON.stringify(notes))
    }
    function addNoteToLocalStorage(noteText:string):void{
        // notes array
        // if it is already there then we will fetch it 
        // from local storage API
        const notes:string[] = getLocalStorageItem();
        notes.push(noteText);
        // set key
        localStorage.setItem('notes',JSON.stringify(notes));
        addNote(noteText)

    }
    function getLocalStorageItem():string[]{
      // stroing into local strage with key 'notes'
      const storedNotes:string | null = localStorage.getItem('notes')
      return storedNotes?JSON.parse(storedNotes) : []
    }
    function loadLocalStorageItems():void {
      const notes:string[] = getLocalStorageItem();
      notes.forEach(note=>addNote(note))

    }
    loadLocalStorageItems()
  }
})