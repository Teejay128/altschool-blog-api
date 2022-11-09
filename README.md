# Blogging API Project

This is an api for a blog app. This API has a general endpoint that shows a list of articles that have been created by different people, and anybody that calls this endpoint, should be able to read a blog created by them or other users.

The get routes are not paginated due to time constraints :smile:

---

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
- pull this repo
- install dependencies with "npm install"
- add enviromental variables inthe following format:
    - PORT = "PORT"
    - DB_URI = "MongoDB connection URI"
    - JWT_SECRET = "secret"
- run `npm run start`

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

### Blog

| field        | data_type | constraints                                   |
| ------------ | --------- | --------------------------------------------- |
| id           | string    | required                                      |
| title        | string    | required , unique                             |
| state        | string    | default: "draft" enum: ['draft', 'published'] |
| description  | string    | optional                                      |
| author       | string    | required                                      |
| reading_time | string    | required                                      |
| read_count   | number    | required                                      |
| tags         | array     | required                                      |
| body         | atring    | required                                      |


## Contributor

- Joseph Taiwo
- Peace 🤞