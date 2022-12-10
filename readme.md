# Project Title

Hospital Managment api

## Description

A simple Api which can be used for  hospitals or administration for managing records of doctors, patients, prescriptions,bills etc.
In the Project
express framework along with mongoose ODM for connection between nodejs and mongoDB is been used.
Swagger has been used for documentation of API.
JsonWebToken (JWT) has been used for authorization and authentication purpose.





### Installing

- Download or fork this project
- Change the name of .env-sample to .env
- In .env file
   - For changing port use PORT variable 
   - The TOKEN keys for doctor and patient are for jwt verification  your can change the key token values for security purpose but for simple executiion the current values a will still work without changes.
- In db.js
  Change the database name from HospitalManagment to your desired 'databaseName'
   e.i mongoose.connect('mongodb://localhost:27017/'databaseName'')
- 

### Executing program

- How to run the program

```
npm i
npm nodemon app.js
```

after running app.js go to http://localhost:{PORT}/api-docs for swagger documentation
