let mysql = require("mysql");
let inquirer = require("inquirer");

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "cloud12s",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
const start = function() {

  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    for(i=0;i<results.length;i++)
    console.log(results[i].item_d, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity);
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is the id of the item you would like to buy?"
      },
      {
        name: "units",
        type: "input",
        message: "How many units you want to buy?"
      }
    ])
    .then(function(answer) {
      connection.query(`SELECT * FROM products where item_d = '${answer.id}'`, function(err, search) {
        if (err) throw err;
        if((search[0].stock_quantity- answer.units) < 0)
        console.log('Insufficient quantity!');
        else
        {
          connection.query( "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: (search[0].stock_quantity - answer.units)
            },
            {
              item_d: answer.id
            }],
            function(error) {
              if (error) throw err;
            console.log(`Total cost of the purchase: ${search[0].price * answer.units}`)
            connection.query("SELECT * FROM products", function(err, results) {
              if (err) throw err;
              for(i=0;i<results.length;i++)
              console.log(results[i].item_d, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity);
            });
            connection.end();
          });
        }
      });
    });
  });
}
