-- Synthetic regression for workers-sdk #5683. No production data.
PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE pages(id TEXT PRIMARY KEY, revision_id TEXT REFERENCES editor_revisions(id), body TEXT CHECK(length(body)>0));
INSERT INTO pages VALUES('page','revision','fixture;''quoted
value');
CREATE TABLE editor_revisions(id TEXT PRIMARY KEY, page_id TEXT REFERENCES pages(id));
INSERT INTO editor_revisions VALUES('revision','page');
CREATE TABLE events(id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT);
INSERT INTO events VALUES(9,'preserve sequence');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('events',42);
CREATE UNIQUE INDEX idx_pages_revision ON pages(revision_id) WHERE revision_id IS NOT NULL;
CREATE TRIGGER pages_guard BEFORE UPDATE ON pages
BEGIN
 SELECT CASE WHEN NEW.body='' THEN RAISE(ABORT,'empty;body') END;
 SELECT CASE WHEN NEW.id='' THEN RAISE(ABORT,'empty id') END;
END;
