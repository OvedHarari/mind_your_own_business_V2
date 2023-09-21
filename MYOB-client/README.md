# Mind Your Own Business v2

This project is a Full stack application that was writen on React-ts with node.js and designed with bootstrap and css .

## Project Description

The project is a second version of a platform that connects businesses with potential customers in a user-friendly way.
The first version is a react-tylescript frontend project taht was converted to a full-stack project by adding node.js express backend.
In this application, users can Sign up to platform as casual users or business users while Admin user can grant Admin permition to other users.

### Users for testing:

1. Casual user - casual1@test.com , password- 1q@W#E$R
2. Business user - business1@test.com , password- 1q@W#E$R
3. Casual user - admin1@test.com , password- 1q@W#E$R
4. Blocked user - blocked1@test.com , password- 1q@W#E$R

### Basic functionality:

1. users can sign up as casual users or business users
2. password validation regex on signup/login
3. client form validation using formik with yup.
4. server data validation using joi.
5. user profile image conditionat renderin acording to gender (in case the user did not add image URL)
6. Dark\Light mode support and responsive display.
7. Google Geocoder service upon new business card creation and\or update.
8. Google Maps service on buliness details card marking business location.
9. Google Auth for Sign-in using passport.
10. Server requests logger to Termenal + Daily log file for errors only.

### Casual users functionality:

1. View existing business cards and details.
2. Mark favorite business cards and view them/remuve them on the main/fav tabs.

### business users functionality:

1. All Casual users functionality is available.
2. Ability to add new business cards including all CRAD functionality.
3. Additional My Cards tab to manage you own cards.

### Admin users functionality:

1. All Business users functionality is available.
2. Update bizNumber (business number)
3. Additional Admin tab - to manage all existing users.
4. Update Users Details
5. Changing users role (casual/ business/ Admin).
6. Block user from accessing the platform.
7. Delete Users.

## Getting Started:

### Installations

#### General information

- Clone the repository, open the code in a code editor and you will find three main folders:

1. myob-server - contains all backend functionality
2. myob-client - contains all frontend functionality
3. MongoDB*Backup - contains all the required collections for MongoDB name *"myob"\_

#### Frontend installation and requirements:

1. On the code editor - open a terminal and navigate to _"myob-client"_ folder root.
2. Run 'npm install' to get all required node_modules for the frontend functionality.

#### Backend installation and requirements:

1. On the code editor - open a terminal and navigate to _"myob-server"_ folder root.
2. Run 'npm install' to get all required node_modules for the backend functionality.
3. DB connection -
   - _a._ DB_LOCAL:
   1. Restore all the collections available in folder _"MongoDB_Backup"_ to a DB named _"myob"_ on your local MongoDB env.
   2. Set the _"MongoDB Connection string"_ in _"myob-server\index.js"_ to use _"process.env.DB_LOCAL"_
   3. Make sure that in _"myob-server\.env"_ _"DB_ATLAS"_ is comment out and _"DB_LOCAL"_ is NOT comment out
   - _"b."_ DB_ATLAS:
   4. Set the _"MongoDB Connection string"_ in _"myob-server\index.js"_ to use _"process.env.DB_ATLAS"_
   5. Make sure that in _"myob-server\.env"_ you update your Atlas connection string of the Atlas db in _"DB_ATLAS"_.

### Frontend environment variables (.env)

1. REACT_APP_API="http://localhost:8000/api"
2. REACT_APP_GOOGLE_MAPS_API_KEY="ADD_YOUR_GOOGLE_API_KEY"
3. GOOGLE_CLIENT_SECRET = "REPLACE YITH YOUR GOOGLE_CLIENT_SECRET"

- If you cannot create your own accounts/keys, contact Oved Harari at [ovedhar@gmail.com] with a request and I will considure providing.

### Backend environment variables (.env)

1. NODE_ENV=development
2. PORT = 8000
3. DB_ATLAS = "REPLACE WITH ATLAS CONNECTION STRING"
4. DB_LOCAL = "mongodb://127.0.0.1:27017/myob"
5. jwtKey = "myobKey"
6. GOOGLE_CLIENT_ID = "REPLACE WITH YOUR GOOGLE_CLIENT_ID"
7. GOOGLE_CLIENT_SECRET = "REPLACE WITH GOOGLE_CLIENT_SECRET"
8. CLIENT_URL = "http://localhost:3000"
9. SERVER_URL = "http://localhost:8000"

- If you cannot create your own accounts/keys, contact Oved Harari at [ovedhar@gmail.com] with a request and I will considure providing.

### Starting the project

To get the project up and running, run the following in different Terminals

1. Terminal One: Navigate to _"myob-server"_ folder root and run _"node index"_ or _"nodemon index"_ (depanding on your intentions)
2. Terminal Two: Navigate to _"myob-client"_ folder root and run _"npm start"_

## Authors

Oved Harari
[ovedhar@gmail.com](https://oved-harari-portfolio.netlify.app)

## Version History

- v2.0
- v1.0
