# Secret Note API
This is a CRUD API built with NestJS that allows a user to interact with an entity called 'secretNote'. The API allows a user to create, read, update, and delete secret notes.

### Installation
Clone the repository `git clone repo` and run the following commands to install the dependencies and start the application:
```
npm install
npm run start:dev
```
The API will be available at http://localhost:3000.

## Testing
Run the following command to run the test suite:
```
npm run test
&
npm run test:e2e
```
## Use on docker
Make sure Docker works properly on your machine. Then simply run:
```
docker-compose up
```
The API will be available at http://localhost:3000.
###
###
## Usage
The API provides the following endpoints:

**Create a new secret note**
```
POST /secretnotes
```
Create a new secret note with the following parameters:

- ***note*** (required): The content of the secret note.

Returns a `**201 Created** response with the created secret note in the response body.

**Get a list of all secret notes**
```
GET /secretnotes
or
GET /secretnotes/?encrypted=true

```
Returns a **200 OK** response with an array of all the secret notes decrypted or not in the response body, depending on if the `encrypted=true` query parameter is used.

**Get a single secret note**
```
GET /secretnotes/:id
 or
GET /secretnotes/:id?encrypted=true
```
Returns a single secret note decrypted or not, with the given **id** depending on if the `encrypted=true` query parameter is used. Returns a **200 OK** response with the secret note in the response body if it exists, or a **404 Not Found** response if it does not.

**Update a secret note**
```
PATCH /secretnotes/:id
```

Update a secret note with the given `**id** and **note** (optional): The updated content of the secret note.

Returns a **200 OK** response with the updated secret note in the response body if it exists, or a **404 Not Found** response if it does not.

**Delete a secret note**
```
DELETE /secretnotes/:id
```

Delete a secret note with the given id. Returns a **204 No Content** response if the note is successfully deleted, or a **404 Not Found** response if the note does not exist.

## Encryption
The API supports encryption of secret notes using RSA public-key cryptography. When a note is to created or updated, it is first of all encrypted using a public key befor storing it in the database, and when a secrete note is being retrieved,
it is first of all decrypted with the corresponding private-key
then returned to the user.

When a note is retrieved, the encrypted flag can be set to true to return the encrypted note. 

The private key to be used for decryption is stored securely on the server.