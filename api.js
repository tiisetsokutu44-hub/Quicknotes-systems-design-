const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

// Reusable request helper: checks HTTP errors and returns the response.
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // DELETE responses may have no JSON body.
  if (response.status === 204) {
    return { data: null, status: response.status };
  }

  const data = await response.json();
  return { data, status: response.status };
}

function renderNote(note) {
  const item = document.createElement("li");
  item.className = "note";

  const title = document.createElement("h3");
  title.textContent = note.title;

  const body = document.createElement("p");
  body.textContent = note.body;

  item.append(title, body);
  return item;
}

function showEmptyState() {
  const item = document.createElement("li");
  item.textContent = "No notes found. Create a note to get started.";
  item.className = "empty-state";
  notesList.replaceChildren(item);
}

async function loadNotes() {
  loadButton.disabled = true;
  showStatus("Loading notes...", "loading");

  try {
    const result = await request(`${API_URL}?_limit=10`);
    notesList.replaceChildren();

    if (result.data.length === 0) {
      showEmptyState();
      showStatus("No notes found.", "success");
      return;
    }

    result.data.forEach((note) => {
      notesList.appendChild(renderNote(note));
    });

    showStatus(
      `Loaded ${result.data.length} notes from the server.`,
      "success",
    );
  } catch (error) {
    console.error("Unable to load notes:", error);
    showStatus(
      "Sorry, we couldn't load your notes. Please check your connection and try again.",
      "error",
    );
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadNotes);
async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    showStatus("Please enter a title for your note.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    showStatus("The title must be 100 characters or fewer.", "error");
    titleInput.focus();
    return;
  }

  submitButton.disabled = true;
  showStatus("Creating note...", "loading");

  try {
    const result = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
        userId: 1,
      }),
    });

    const newNote = result.data;
    notesList.querySelector(".empty-state")?.remove();
    notesList.prepend(renderNote(newNote));

    showStatus(
      `Note created (status ${result.status}, id ${newNote.id}).`,
      "success",
    );

    noteForm.reset();
  } catch (error) {
    console.error("Unable to create note:", error);
    showStatus(
      "Sorry, we couldn't create your note. Please try again.",
      "error",
    );
  } finally {
    submitButton.disabled = false;
  }
}

noteForm.addEventListener("submit", createNote);
