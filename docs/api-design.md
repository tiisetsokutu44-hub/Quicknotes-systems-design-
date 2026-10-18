# QuickNotes API Design

## 1. Overview

QuickNotes is a simple notes application that uses the JSONPlaceholder REST API to practise retrieving, creating and deleting notes. The application uses JavaScript Fetch to communicate with the API.

Base URL:

`https://jsonplaceholder.typicode.com`

## 2. API Endpoints

### GET /posts?_limit=10

Retrieves up to 10 sample posts to display as notes.

**Successful response:** `200 OK`

The response is a JSON array containing objects with fields such as `userId`, `id`, `title` and `body`.

### POST /posts

Creates a note by sending its title, body and user ID.

Example request:

```json
{
  "title": "My first note",
  "body": "This is my first QuickNotes note.",
  "userId": 1
}
```

**Expected response:** `201 Created`

The API returns a simulated created resource with an ID. JSONPlaceholder does not permanently save the new note.

### DELETE /posts/{id}

Requests deletion of a note using its ID.

Example: `DELETE /posts/1`

**Expected response:** commonly `200 OK` with a simulated response body.

The QuickNotes interface removes the note from the displayed list after a successful response. JSONPlaceholder does not permanently delete its sample data.

## 3. Error Handling

The application checks the HTTP response status before processing the response body. Failed HTTP responses produce an error.

The interface displays user-friendly messages when loading, creating or deleting notes fails. Detailed errors are also logged to the browser console for debugging.

Network failures, server errors and invalid requests should be handled without crashing the application.

## 4. Request Format

POST requests use the `Content-Type: application/json` header and send data using `JSON.stringify()`.

GET and DELETE requests do not require a request body in this implementation.

## 5. Future Improvements

- Add a persistent backend and database.
- Add input validation on the server.
- Support updating notes with `PUT` or `PATCH`.
- Add authentication and authorisation.
- Add automated API tests.
