# Origin: https://github.com

# 1. POST /api/users/signup

Description:
This route allows a user to sign up for the service by providing their personal details and creating a new account.

Access:
Public

Request Body:
The request body must contain the following fields:
- firstName (string, required, min length 2, max length 50): the user's first name
- lastName (string, required, min length 2, max length 50): the user's last name
- email (string, required, max length 50, unique): the user's email address, which must be unique to create a new account
- phone (string, required, unique): the user's phone number, which must be unique to create a new account
- birthDay (date, required): the user's birth day
- gender (string, required, enum ['male', 'female']): the user's gender, which must be one of the specified enum values
- password (string, required, min length 10, max length 255): the user's chosen password

Response:
- If the request body is invalid, the server will respond with a 400 status code and an error message.
- If the user with the given email already exists, the server will respond with a 400 status code and an error message.
- If the user is successfully created, the server will respond with a 201 status code and a success message. Additionally, a verification code will be sent to the user's email address, which they can use to verify their account.
  - Response Body:
    - message (string): a success message indicating that the verification code was sent successfully
    - email (string): the user's email address
    - verificationCodeExpiration (string): the expiration time for the verification code, which is set to 5 minutes
- If an error occurs while processing the request, the server will respond with an error message and an appropriate status code.

Example Request:
# POST /api/users/signup
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "birthDay": "1990-01-01",
    "gender": "male",
    "password": "secretpassword"
}

Example Response:
HTTP/1.1 201 Created
Content-Type: application/json

{
    "message": "Verification code sent successfully",
    "email": "johndoe@example.com",
    "verificationCodeExpiration": "5 minutes"
}


# 2. POST /api/auth/login

/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: APIs for user authentication
 *
 * /api/auth/login:
 *   post:
 *     summary: Login user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: JSON Web Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JSON Web Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Invalid user input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "email" is not allowed to be empty
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid email or password
 *                 isVerified:
 *                   type: boolean
 *                   description: User verification status
 *                   example: false
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                   example: user@example.com
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server Error
 */

