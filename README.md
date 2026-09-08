# To-Do Board

A self-hosted kanban board, built from scratch — no framework, no shortcuts, no Trello subscription.

## Why

I didn't want someone else's opinion of how a task board should work.

So I built my own, one milestone at a time. Every line of backend and frontend code is hand-written on purpose — this is a learning project first, a productivity tool second.

It's single-user and login-protected, running on my own VPS.

## What it does

- Organize work into **boards**, each with customizable **stages**
- Create, edit, and drag-and-drop tasks between stages
- Break tasks down into **subtasks** with roll-up completion counts
- Tag tasks with reusable, autocompleted **tags**
- Set **deadlines**, with overdue/due-soon indicators
- Set up **recurring tasks** on a cron-style schedule
- Filter and sort per-board, or zoom out to an "Everything" view across all boards
- Track progress with a simple **stats dashboard**
- Keep it all private behind session-cookie auth

## Tech stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — API framework
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM
- [Pydantic](https://docs.pydantic.dev/) — request/response validation
- [Alembic](https://alembic.sqlalchemy.org/) — database migrations
- [MySQL](https://www.mysql.com/) — dedicated database, own scoped DB user
- `bcrypt` — password hashing
- `croniter` — recurrence rule parsing for recurring tasks
- systemd — running the app and the recurring-task cron job as services

**Frontend**
- Vanilla JavaScript, plain HTML/CSS — no frameworks
- [SortableJS](https://sortablejs.github.io/Sortable/) — drag-and-drop for stages and tasks

**Infrastructure**
- Hosted on a personal VPS
- nginx — serves the SPA static files and reverse-proxies `/api/*` to FastAPI
- Scheduled `mysqldump` backups for the database

## Milestones

- [x] **Milestone 0: Project Setup** — repo, DB, base FastAPI structure, initial nginx config
- [x] **Milestone 1: Auth** — password hashing, session cookies, protected routes
- [x] **Milestone 2: Boards & Stages** — CRUD, board/stage frontend shell
- [x] **Milestone 3: Tasks** — CRUD, task cards, moving between stages
- [x] **Milestone 4: Creation & Editing UI** — forms, colour pickers, complete toggle, delete confirmation
- [x] **Milestone 5: Tags** — CRUD, many-to-many with tasks, autocomplete, tag UI
- [ ] **Milestone 6: Subtasks** — checklist UI inside parent cards, completion roll-up
- [ ] **Milestone 7: Drag-and-Drop** — SortableJS integration, position persistence
- [ ] **Milestone 8: Filtering & Cross-Board View** — per-board and "Everything" filtering/sorting
- [ ] **Milestone 9: Deadlines** — overdue/due-soon indicators, deadline sort/filter
- [ ] **Milestone 10: Recurring Tasks** — templates, daily spawner cron job
- [ ] **Milestone 11: Stats & Dashboard** — completed-per-week and overdue endpoints, dashboard view
- [ ] **Milestone 12: Polish & Deploy** — final nginx/systemd setup, DB backups, mobile-responsive pass

## Local development

See `RUNNING.md` for setup and local run instructions.
