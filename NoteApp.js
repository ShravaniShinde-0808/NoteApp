const addBtn = document.querySelector("#AddBtn");
const saveFileBtn = document.querySelector("#SaveFile");
const openFileBtn = document.querySelector("#OpenFile");
const fileInput = document.querySelector("#fileInput");
const container = document.querySelector("#Container");

// Note colors
const colors = ["yellow", "green", "pink", "blue"];
let colorIndex = 0;

// Save all notes to localStorage
const saveNotes = () => {
    const notes = document.querySelectorAll(".note");
    const data = [];

    notes.forEach(note => {
        const title = note.querySelector(".title").value;
        const content = note.querySelector(".content").value;
        const color = [...note.classList].find(c => colors.includes(c));
        if (title.trim() || content.trim()) data.push({ title, content, color });
    });

    localStorage.setItem("notesData", JSON.stringify(data));
};

// Add a single note
const addNote = (content = "", title = "", color = "") => {
    const note = document.createElement("div");
    note.classList.add("note");

    // Assign color
    if (!color) {
        note.classList.add(colors[colorIndex % colors.length]);
        colorIndex++;
    } else {
        note.classList.add(color);
    }

    note.innerHTML = `
        <div class="icons">
            <i class="save fas fa-save" style="color:#00b894" title="Save"></i>
            <i class="trash fas fa-trash" style="color:#d63031" title="Delete"></i>
        </div>
        <div class="title-div">
            <textarea class="title" placeholder="Write title...">${title}</textarea>
        </div>
        <textarea class="content" placeholder="Write your note...">${content}</textarea>
    `;

    // Delete note
    note.querySelector(".trash").addEventListener("click", () => {
        note.remove();
        saveNotes();
    });

    // Save note on save icon click
    note.querySelector(".save").addEventListener("click", () => {
        saveNotes();
        alert("Note saved!");
    });

    // Auto-save on typing
    note.querySelector(".title").addEventListener("input", saveNotes);
    note.querySelector(".content").addEventListener("input", saveNotes);

    container.appendChild(note);
    saveNotes();
};

// Load notes from localStorage on page load
const loadNotes = () => {
    const data = JSON.parse(localStorage.getItem("notesData") || "[]");
    data.forEach(note => addNote(note.content, note.title, note.color));
};
loadNotes();

// Add new note button
addBtn.addEventListener("click", () => addNote());

// Save all notes to JSON file
saveFileBtn.addEventListener("click", () => {
    const data = localStorage.getItem("notesData") || "[]";
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "notes.json";
    a.click();
});

// Open notes from JSON file
openFileBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const data = JSON.parse(evt.target.result);
            localStorage.setItem("notesData", JSON.stringify(data));
            container.innerHTML = ""; // Clear old notes
            data.forEach(note => addNote(note.content, note.title, note.color));
        } catch {
            alert("Invalid JSON file!");
        }
    };
    reader.readAsText(file);
});