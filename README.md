# Blogging API Project

API for a blog app built with NodeJS, all blogposts are stored in a MongoDB database, some routes are only accessible by logged in users.

---

## Routes

### User Routes

- POST `/signup`: Creates a new User and logs them in
- POST `/login`: Logs an existing user in
- POST `/logout`: Logs out an existing user

### Blog Routes

- GET `/blog/`: Gets all available blogposts
- GET `/blog/user`: Gets all blogposts by a particulare user
- GET `/blog/:id`: Gets a blogpost
- POST `/blog/`: Creates a new blogpost
- DELETE `/blog/:id`: Deletes a blogpost
- PUT `/blog/:id`: Updates a blogpost

## Requirements

1. Users should have a first name, last name, email, password.
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs.
13. The endpoint should be paginated and filterable by state
14. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1.

---

## Setup

- Install NodeJS, mongodb
- Fork and Pull this repository
- Install dependencies by running `npm install` in the root directory
- Add enviromental variables in the following format:
  - PORT = "PORT"
  - DB_URI = "MongoDB connection URI"
  - JWT_SECRET = "Secret key"
- Run `npm run start`

---

## Models

---

### User

| field     | data_type | constraints           |
| --------- | --------- | --------------------- |
| id        | string    | required              |
| firstName | string    | required              |
| lastName  | string    | required              |
| email     | string    | required              |
| password  | string    | required              |
| blogs     | array     | required              |

### Blog

| field        | data_type | constraints      |
| ------------ | --------- | ---------------- |
| id           | string    | Auto-generated   |
| title        | string    | required, unique |
| state        | string    | default: "draft" |
| description  | string    | required         |
| author       | string    | Auto-generated   |
| reading_time | string    | Auto-generated   |
| read_count   | number    | Auto-generated   |
| tags         | array     | required         |
| body         | atring    | required         |

## Contributor

- [Joseph Taiwo](https://github.com/Teejay128)
