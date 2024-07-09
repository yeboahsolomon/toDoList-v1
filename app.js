const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

require("dotenv").config();

const session = require("express-session");

const MongoStore = require("connect-mongo");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

mongoose.connect(process.env.MONGODB_URL);

const itemsSchema = ({
  name: String,
  sessionId: String // Store the session ID
})

const Item = mongoose.model("Item", itemsSchema);

const dayName = new Date().toLocaleString('en-US', { weekday: 'long' });
 
app.get("/", async (req, res) => {
    const foundItems = await Item.find({ sessionId: req.sessionID });
    res.render("list", {listTitle: dayName + " ToDoList", newListItems: foundItems});
});

app.post("/", async (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName,
    sessionId: req.sessionID
  });

  await item.save();
  res.redirect("/");

}); 

app.post ("/delete", async (req, res) => {
  const checkedItemId = req.body.checkedbox
  await Item.findByIdAndDelete({ _id: checkedItemId, sessionId: req.sessionID });

  res.redirect("/");
});


app.listen(3000, function(){
  console.log("Server started on port 3000")
});

