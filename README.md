# Form Bot | Form Builder

FormBot is a form builder application designed to help form creators manage forms efficiently. Built using the MERN (MongoDB, Express.js, React, Node.js) stack, FormBot allows creators to create, update, delete, and share forms with others. The application also includes features for user management, form sharing, and folder creation.

# Features

1. **User Authentication**
2. **Form Management**
3. **User Setting**
4. **Folder Creation and Deletion**

# Technologies Used
Form Bot is built using the following technologies:

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens) for authentication and authorization.

# Installation
- Before getting started, ensure you have Node.js and npm installed on your machine.
## Clone the repository:
git clone https://github.com/yashwanth2000/formbot.git
## Navigate to the project directory
cd formbot
## Install the dependencies for both client and server: 
- cd client: npm install
- cd server: npm install
## Set up the environment variables, Create a .env file in the root directory and add the following variables:
  - VITE_SERVER_URL = "http://localhost:3000" 
  - MONGODB_URL = <your_mongodb_url>
  - JWT_SECRET = <your_jwtkey>,
  - VITE_SHARE_URL = http://localhost:5173
## Running the Application, start the client and server:
  - In the client directory, run: npm run dev
  - In the server directory, run: npm run dev

# Usage
- Register as a new form creator or log in with existing credentials. Only logged-in users can create forms.
- Create a new form from the board and assign properties such as name, image, video, and GIF for form creators. For users, you can include text, email, number, date, and more.
- Form creators can efficiently edit, delete, and manage forms.
- Share forms with others to collect form data.
- Update your profile information or delete your account from the settings page.
- Create new folders and manage forms within specific folders.
