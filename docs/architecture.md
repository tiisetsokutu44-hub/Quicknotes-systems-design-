# QuickNotes System Architecture

## 1. Overview

QuickNotes is a browser-based notes application built with HTML, CSS and JavaScript. It uses the JSONPlaceholder REST API to practise retrieving, creating and deleting notes.

## 2. System Components

- HTML provides the structure of the application.
- CSS styles the interface.
- JavaScript handles user interactions, API requests and displaying notes.
- The Fetch API sends HTTP requests to JSONPlaceholder.
- JSONPlaceholder returns sample posts and simulates creating and deleting resources.

## 3. Request Flow

1. The user opens QuickNotes in a browser.
2. JavaScript requests sample notes from JSONPlaceholder.
3. The API returns JSON data.
4. JavaScript displays the notes in the browser.
5. Creating a note sends a POST request.
6. Deleting a note sends a DELETE request.
7. The interface updates and displays status messages.

## 4. Architecture Diagram

    User
      |
      v
    Browser Interface (HTML and CSS)
      |
      v
    JavaScript Application Logic
      |
      v
    Fetch API
      |
      v
    JSONPlaceholder REST API

## 5. Error Handling

The application handles unsuccessful HTTP responses and network errors by displaying appropriate messages.

## 6. Limitations

JSONPlaceholder is a demonstration API. It does not permanently save created notes or delete its sample data.

## 7. Future Improvements

- Add a backend and persistent database.
- Add authentication and authorisation.
- Implement note editing.
- Add automated tests.
- Improve accessibility and mobile responsiveness.
