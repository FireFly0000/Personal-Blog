# Personal-Blog
This is a blog posting application written in Node Express, React using TypeScript
Postgres as the database.

UI/Frontend: React, Axios, react-router-dom.

Technologies used: 
<ul>
  <li>JWT authentication</li> 
  <li>Autherization with access token stored in cookie</li> 
  <li>REST api for CRUD operation</li> 
  <li>Multer for uploading image file</li> 
  <li>Bccrypt to hash password</li>
  <li>React context (useContext) to manage current user as a global state</li>
</ul>

<h1>Main features :</h1>
<ul>
  <li>Category Management (CRUD)</li>
  <li>Post Management (CRUD)</li>
  <li>User Management (authorization with JWT)</li>
  <li>Log in</li>
  <li>Log out</li>
  <li>Register</li>
  <li>Display posts based on category</li>
  <li>Create a post (when the user is autherized)</li>
  <li>View post details (Suggest posts with the same category)</li>
  <li>Delete, update a post (when the user is the owner of the post)</li>
</ul>
