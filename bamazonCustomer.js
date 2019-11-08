

var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "matt", 
    password: "Gator12!", 
    database: "bamazon"
});

connection.query('SELECT * FROM products', 
	function(err, res) {
  	if (err) throw err;
  	
  	console.log("Item \t Product \t Department \t Price \t Stock");
  	console.log("-----------------------------------------------");
  	for (var i = 0; i < res.length; i++) {
  		console.log(res[i].ItemID + "   " + res[i].ProductName + " \t " + res[i].DepartmentName + " \t " + res[i].Price + " \t " + res[i].StockQuantity);
    }
    console.log("-----------------------------------");
   
    inquirer.prompt([{
        name: "product",
        message: "What Product would you like to buy? [Quit with Q]"
 
    }]).then(function(ansProd) {
       
          if (ansProd.product.toUpperCase() == "Q") {
            connection.end();
          } else {
            inquirer.prompt([{
                name: "qty",
                message: "How many would you like to buy?"
            }]).then(function(ansQty) {
               console.log(ansProd.product);
             
              connection.query('SELECT * FROM products WHERE ItemID=?', [ansProd.product], function(err, res) {
                if (err) throw err;
             
                
                  if (res[0].StockQuantity > ansQty.qty) {
                   
                    var cost = res[0].Price * ansQty.qty
                    var newQty= res[0].StockQuantity - ansQty.qty
                    console.log("-----------------------------------");
                    console.log("Your order has been placed! \nThe total cost is $" + cost.toFixed(2) + "\nThank you!")
                   
                      var newQty = res[0].StockQuantity - ansQty.qty
                      connection.query("UPDATE products SET StockQuantity =? WHERE ItemID=?", 
                      [newQty, ansProd.product ],
                     
                      function(err, res) {});
                  
                  } else {
                    console.log("-----------------------------------");
                    console.log("Sorry, we do not have enough in stock. \nWe only have " + res[0].StockQuantity + " units of " + ansProd.product + ". \nPlease retry your order. \nThank you!")
                  }
                   
              })
              
              
            })
          }
    })
   
        
}); 





