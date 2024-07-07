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

const item1 = new Item ({
  name: "Welcome to your todolist!"
})

const item2 = new Item ({
  name: "Hit the + button to add a new item."
})

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];

const listsSchema = {
   name: String,
   items: [itemsSchema]
}

const List = mongoose.model("List", listsSchema);
 
app.get("/", async function(req, res){

  try {

    const foundItems = await Item.find({});

    if (foundItems.length === 0) {

      Item.insertMany(defaultItems);

      res.redirect("/");

    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.post ("/delete", async function(req, res){
  const checkedItemId = req.body.checkedbox
  await Item.findByIdAndDelete(checkedItemId);

  res.redirect("/");
});

app.get("/:customListName", async function(req, res){

  const customListName = req.params.customListName;

  const list = new List ({
    name: customListName,
    items: defaultItems
  });

  if (await List.findOne({name: customListName}).exec() === null) {
    list.save();
    res.redirect("/" + customListName);

  } else {
    res.render("list", {listTitle: list.name, newListItems: list.items});
  }
});

app.post("/", async function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");

  } 
});

app.listen(3000, function(){
  console.log("Server started on port 3000")
});

