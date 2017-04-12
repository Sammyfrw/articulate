//Script to be run to initialize and prepopulate database
//Module definitions
const mongoose = require('mongoose');
const credentials = require("./credentials.js");

//DB connection
const dbUrl = 'mongodb://' + credentials.host + ':27017/' + credentials.database;
const connection = mongoose.createConnection(dbUrl);

//Clientside model setup
const employeeDb = require('./routes/dbConnection.js');
const Employee = employeeDb.getModel(connection);

//Prepopulating database
connection.on ("open", () => {
  let employee;

  employee = new Employee({
    firstName: 'John',
    lastName: 'Smith'
  });
  employee.save();

  employee = new Employee({
    firstName: 'Jane',
    lastName: 'Smith'
  });
  employee.save();

  employee = new Employee({
    firstName: 'John',
    lastName: 'Doe'
  });
  employee.save((err) => {
    if (err) throw err;
    console.log("Successfully added employees!");
    //Display added employees
    Employee.find({}, 'firstName lastName',
      (err, results) => {
        connection.close();
        if (err) throw err;
        console.log(results);
      }
    );
  });
});
