QuickNotes Relational Data Model

1. Requirements and relationships
   The production design uses four relational tables:
   `users`: account identity and password hash.
   `notes`: each note belongs to one user.
   `tags`: each tag belongs to one user.
   `note_tags`: join table for the many-to-many relationship between notes and tags.
   A user can own many notes and many tags. A note can have many tags, and a tag can be attached to many notes. The `note_tags` table implements this many-to-many relationship and prevents duplicate assignments.
2. PostgreSQL schema
   The following SQL is intended for PostgreSQL.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT notes_title_not_blank CHECK (length(trim(title)) > 0)
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT tags_name_not_blank CHECK (length(trim(name)) > 0),
    CONSTRAINT tags_user_name_unique UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (note_id, tag_id)
);
```

`gen_random_uuid()` is available in current PostgreSQL versions. If the target database version does not provide it, enable the appropriate UUID extension or generate UUIDs in the application.
Primary and foreign keys
`users.id`, `notes.id`, and `tags.id` are primary keys.
`notes.user_id` references `users.id`.
`tags.user_id` references `users.id`.
`note_tags.note_id` references `notes.id`.
`note_tags.tag_id` references `tags.id`.
The composite primary key `(note_id, tag_id)` prevents the same tag being attached to a note more than once.
Cascading deletes remove a user's notes/tags and the join rows that depend on them. Deleting a user is a destructive operation and should be guarded by application authorization and any required retention policy.
A further cross-user integrity rule is needed: a note must not be associated with a tag owned by a different user. The API must verify both owners within a transaction before inserting into `note_tags`. If stronger database-enforced isolation is required, use a schema with composite unique keys and composite foreign keys containing `user_id`. 3. Indexes

```sql
-- Supports listing a user's notes newest first.
CREATE INDEX idx_notes_user_updated
    ON notes (user_id, updated_at DESC, id DESC);

-- Supports finding a user's tags.
CREATE INDEX idx_tags_user_name
    ON tags (user_id, name);

-- The join table's primary key supports note -> tags lookups.
-- This additional index supports tag -> notes lookups.
CREATE INDEX idx_note_tags_tag_note
    ON note_tags (tag_id, note_id);
```

The unique constraint on `users.email` automatically creates a unique index, as does the `tags(user_id, name)` constraint. Indexes should follow real query patterns because each additional index consumes storage and adds write overhead. For larger text search needs, evaluate PostgreSQL full-text search and a GIN index instead of repeatedly scanning note bodies. 4. Example queries with JOINs
List a user's notes and tags

```sql
SELECT
    n.id AS note_id,
    n.title,
    n.body,
    n.updated_at,
    t.id AS tag_id,
    t.name AS tag_name
FROM notes AS n
LEFT JOIN note_tags AS nt ON nt.note_id = n.id
LEFT JOIN tags AS t ON t.id = nt.tag_id
WHERE n.user_id = $1
ORDER BY n.updated_at DESC, n.id DESC;
```

`$1` is a parameter supplied by the authenticated server-side request. Do not take a user ID from the request body as proof of identity.
Find notes matching a particular tag

```sql
SELECT n.id, n.title, n.updated_at
FROM notes AS n
JOIN note_tags AS nt ON nt.note_id = n.id
JOIN tags AS t ON t.id = nt.tag_id
WHERE n.user_id = $1
  AND t.user_id = $1
  AND t.id = $2
ORDER BY n.updated_at DESC;
```

The ownership conditions prevent results from crossing user boundaries.
Count notes per tag

```sql
SELECT t.id, t.name, COUNT(nt.note_id) AS note_count
FROM tags AS t
LEFT JOIN note_tags AS nt ON nt.tag_id = t.id
WHERE t.user_id = $1
GROUP BY t.id, t.name
ORDER BY t.name;
```

Create a note and attach tags transactionally

```sql
BEGIN;

INSERT INTO notes (user_id, title, body)
VALUES ($1, $2, $3)
RETURNING id;

-- For each requested tag, the application first confirms that the tag
-- belongs to $1. Then insert the association using the new note ID.
INSERT INTO note_tags (note_id, tag_id)
VALUES ($4, $5)
ON CONFLICT (note_id, tag_id) DO NOTHING;

COMMIT;
```

In actual application code, capture the ID returned by `INSERT ... RETURNING id`; do not hard-code `$4`. If any tag fails ownership validation, roll back the whole transaction so the note is not partially created. 5. SQL versus NoSQL
Recommendation: PostgreSQL (SQL).
Reasons:
Notes and tags have clear relationships, including a many-to-many relationship represented by `note_tags`.
Foreign keys, unique constraints, and transactions protect referential integrity and make note/tag changes reliable.
The API needs joins to retrieve notes with tags and to count notes per tag.
Indexes and read replicas can support growth without abandoning relational guarantees.
PostgreSQL provides flexible text fields, JSON support where needed, and full-text search capabilities.
A document database could store each note with an embedded list of tags, which may simplify reads, but it duplicates tag information and complicates tag renames, shared tag metadata, and consistent updates. A NoSQL option may be reasonable if access patterns or scale later justify it, but it adds complexity before there is evidence that PostgreSQL is a bottleneck. 6. Operational considerations
Use migrations to version schema changes.
Back up the primary database and test restore procedures.
Monitor slow queries, connection pool saturation, replication lag, disk use, and lock contention.
Keep database credentials out of source control.
Use least-privilege database roles and parameterized queries.
Consider soft deletion and retention requirements before production launch; the simple schema above uses hard deletes for clarity.
