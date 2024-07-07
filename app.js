const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://yeboahsolomon2030:wFWIzEjbkBukNe4D@todolist-v1.35sdgsf.mongodb.net/?retryWrites=true&w=majority&appName=toDoList-v1");

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema);

const dayName = new Date().toLocaleString('en-US', { weekday: 'long' });
 
app.get("/", async function(req, res){
    const foundItems = await Item.find({});
    res.render("list", {listTitle: dayName + " ToDoList", newListItems: foundItems});
});

app.post("/", async function(req, res){
  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  });

  item.save();
  res.redirect("/");

}); 

app.post ("/delete", async function(req, res){
  const checkedItemId = req.body.checkedbox
  await Item.findByIdAndDelete(checkedItemId);

  res.redirect("/");
});


app.listen(3000, function(){
  console.log("Server started on port 3000")
});

