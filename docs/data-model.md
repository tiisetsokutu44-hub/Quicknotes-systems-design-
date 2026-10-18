# QuickNotes Data Model

## 1. Overview

QuickNotes represents notes using data retrieved from the JSONPlaceholder REST API.

## 2. Note Fields

| Field | Data Type | Description |
|---|---|---|
| id | Number | Unique identifier for the note |
| userId | Number | Identifier of the user associated with the note |
| title | String | Title of the note |
| body | String | Main content of the note |

## 3. Example Note

    {
      "userId": 1,
      "id": 1,
      "title": "My first note",
      "body": "This is an example note."
    }

## 4. Data Relationships

Each note is associated with a user through the userId field. Multiple notes can belong to the same user.

## 5. Data Storage

The application retrieves sample notes from JSONPlaceholder. New notes and deletion requests are simulated by the service and are not permanently saved.

## 6. Future Improvements

A production version could use a database with persistent storage, user accounts, timestamps, and validation.
