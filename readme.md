# Project Title

Hospital Managment api

## Description

A simple Api which can e used for y hospitals for managment the records of doctors, patients, prescriptions,bills etc.
express framework along with mongoose ODM for connection between nodejs and mongoDB.
Swagger has been used in the project for documentation of API.
JsonWebToken (JWT) has been used for authorization and authentication purpose





### Installing

- download or fork this project
- Change the name of .env-sample to .env
- In .env file
   - for changing port use PORT variable 
   - the TOKEN keys for doctor and patient are for jwt verification  your can change the key token values for security purpose but for simple executiion the current values a will still work without changes.
- In db.js
  change the database name from HospitalManagment to your desired database name
   e.i mongoose.connect('mongodb://localhost:27017/databaseName')
- 

### Executing program

- How to run the program
- Step-by-step bullets

```
npm i
npm nodemon app.js
```

after running app.js go to http://localhost:{PORT}/api-docs for swagger documentation
