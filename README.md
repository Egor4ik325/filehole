# Filehole

The sense of this project is that it will be REALLy useful to me. I will
self-host it on my own LAN and will be later improving.

The UI will be similar to the OS desktop where files are located, movable and
removable.

File information may include:

- ID
- filename
- filetype/extension
- filepath
- file size
- upload time

## Goal

Be able to upload and download files!

## Technologies

- Lightweight Django API
- React SPA
- CSS styling (single page)

Django without:

- authentication
- admin
- session, CSRF

## API

- `/api/`

## Database

In development sqlite3 will be used (to avoid settings up container environment)
but in production - PostgreSQL.

## Checklist

- [x] Setup django/react

- [x] Work on design

- [x] File model

- [x] Draggable setup

- [x] File upload setup (Uppy)

- [x] Working upload area

- [x] Delete file modal (sweetalert2)

- [x] Fix error

- [x] Purge files functionality

- [ ] Style background

- [ ] Style header

- [ ] Style files

- [ ] Style upload
