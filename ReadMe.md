# NodeJS Application Documentation

/*
* This is the documentation for a NodeJS application that uses the following        technologies:


*/

# MongoDB for database storage
# Express for handling HTTP requests and responses
# Mongoose for object modeling with MongoDB
# Cors for Cross-Origin Resource Sharing
# Dotenv for handling environment variables


Dependencies
This application has the following dependencies:

mongoose
cors
express
dotenv
Files and Folders
The application has the following files and folders:

index.js: The main entry point of the application that starts the server
db.js: The file that connects to the MongoDB database and exports the connection
middlewares/errorMiddleware.js: The file that contains custom error handling middleware functions
routes/: The folder that contains all the route files
routes/root.js: The file that handles the root route
routes/question.js: The file that handles the /api/questions route
routes/auth.js: The file that handles the /api/auth route
routes/user.js: The file that handles the /api/users route
routes/assessment.js: The file that handles the /api/assessment route
routes/withdrawal.js: The file that handles the /api/withdrawals route
routes/admin.js: The file that handles the /api/admin route
Entry Point
The index.js file is the main entry point of the application. It does the following:

Imports the required dependencies and files
Sets the strictQuery option of Mongoose to true
Defines a function mongodb that connects to the MongoDB database using the MONGO_URI environment variable and exports it
Defines an instance of the express application and sets up middleware for handling form data and JSON
Defines middleware for Cross-Origin Resource Sharing (CORS)
Defines routes for the application
Defines error handling middleware functions
Calls the mongodb function to connect to the database
Starts the server on the specified port (either the PORT environment variable or port 6001)
Database Connection
The db.js file connects to the MongoDB database using Mongoose. It exports a conn object that represents the connection.

Middleware
Error Handling Middleware
The middlewares/errorMiddleware.js file defines two custom error handling middleware functions:

notFound: This middleware handles 404 errors when a route is not found
errorHandler: This middleware handles all other errors and sends an error response to the client
Routes
The application has the following routes:

Root Route (/)
GET /: Returns a JSON object with a message indicating that the API is running
Question Routes (/api/questions)
GET /: Returns an array of all questions
GET /:id: Returns a question with the specified id
POST /: Creates a new question with the provided data
PUT /:id: Updates a question with the specified id with the provided data
DELETE /:id: Deletes a question with the specified id
Authentication Routes (/api/auth)
POST /register: Registers a new user with the provided data
POST /login: Authenticates a user with the provided data and returns a JSON Web Token (JWT)
User Routes (/api/users)
GET /: Returns an array of all users
GET /:id: Returns a user with the specified id
PUT /:id: Updates a user with the specified id with the provided data
`DELETE

"functions": {
      "controllers/*.js": {
        "maxDuration": 60
      },
      "middleware/**/*.js": {
        "maxDuration": 60
      }
    }