# QuickNotes

QuickNotes is a browser-based notes application built with HTML, CSS and JavaScript. It uses the JSONPlaceholder REST API to practise retrieving, creating and deleting notes.

## Features

- Load sample notes from the API.
- Create notes using a POST request.
- Delete notes using a DELETE request.
- Display status messages and handle request errors.
- Simple browser-based interface.

## Technologies

- HTML
- CSS
- JavaScript
- Fetch API
- JSONPlaceholder REST API

## Getting Started

1. Clone or download the project.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Use the interface to load, create and delete notes.

An internet connection is required to communicate with JSONPlaceholder.

## API Behaviour

JSONPlaceholder simulates creating and deleting notes. These changes are not permanently stored on the server.

## Documentation

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

## Reflection: Key Takeaways

### 1. Designing RESTful APIs

I learned that a production API needs clearly defined endpoints, appropriate HTTP methods, consistent response formats and meaningful error codes. Authentication and authorisation are also important for protecting users and their notes.

### 2. Relational Database Design

I learned how relational tables, primary keys, foreign keys and many-to-many relationships can organise application data. Separating users, notes and tags improves data structure and supports queries across related records.

### 3. Scalability and System Architecture

I learned that supporting a large number of users requires more than a browser interface and an API. Load balancing, caching, database optimisation, background processing and monitoring can help a system handle increased traffic. Capacity estimates and load testing are necessary to guide infrastructure decisions.

## Future Improvements

- Add persistent database storage.
- Implement note editing and complete note management.
- Add authentication and authorisation.
- Add automated tests.
- Implement the proposed production architecture as the project grows.

## Author

QuickNotes project developed as part of web development learning.
