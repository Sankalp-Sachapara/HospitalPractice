# Project Title

Hospital Managment api

## Description

A simple Api which can e used for y hospitals for managment the records of doctors, patients, prescriptions,bills etc


### Installing

- download or fork this project
- Change the name of .env-sample to .env
   - for changing port use PORT variable for server
   - your can change the key token values for security purpose as the current values are dummy, althought they will still work wihtout change
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
