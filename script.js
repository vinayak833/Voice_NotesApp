let notes =
JSON.parse(localStorage.getItem("notes"))
|| [];

const noteText =
document.getElementById("noteText");

const category =
document.getElementById("category");

const notesContainer =
document.getElementById("notesContainer");

const totalNotes =
document.getElementById("totalNotes");

const search =
document.getElementById("search");

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

document
.getElementById("startBtn")
.addEventListener(
"click",
() => {
    recognition.start();
}
);

document
.getElementById("stopBtn")
.addEventListener(
"click",
() => {
    recognition.stop();
}
);

recognition.onresult =
(event) => {

    let transcript = "";

    for(
        let i = event.resultIndex;
        i < event.results.length;
        i++
    ){

        transcript +=
        event.results[i][0]
        .transcript;
    }

    noteText.value =
    transcript;
};

function saveNotes(){

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
}

function updateDashboard(){

    totalNotes.textContent =
    notes.length;
}

function renderNotes(
list = notes
){

    notesContainer.innerHTML =
    "";

    list.forEach(note => {

        const div =
        document.createElement("div");

        div.classList.add("note");

        div.innerHTML = `
            <h3>${note.category}</h3>
            <p>${note.text}</p>
            <small>${note.date}</small>
            <br>
            <button
                onclick="deleteNote(${note.id})">
                Delete
            </button>
        `;

        notesContainer
        .appendChild(div);
    });

    updateDashboard();
    saveNotes();
}

document
.getElementById("saveBtn")
.addEventListener(
"click",
() => {

    if(
        noteText.value.trim()
        === ""
    ) return;

    notes.push({

        id: Date.now(),

        text:
        noteText.value,

        category:
        category.value,

        date:
        new Date()
        .toLocaleString()
    });

    noteText.value = "";

    renderNotes();
}
);

function deleteNote(id){

    notes =
    notes.filter(
        note =>
        note.id !== id
    );

    renderNotes();
}

search.addEventListener(
"input",
function(){

    const keyword =
    this.value
    .toLowerCase();

    const filtered =
    notes.filter(
        note =>

        note.text
        .toLowerCase()
        .includes(keyword)

        ||

        note.category
        .toLowerCase()
        .includes(keyword)
    );

    renderNotes(
        filtered
    );
}
);

renderNotes();