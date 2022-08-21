// IMPORTS
const express = require("express");
const path = require("path");
require('dotenv').config()

// Imports des dossiers
const userCtrl = require("./controllers/userCtrl");
const postCtrl = require("./controllers/postCtrl");
const likeCtrl = require("./controllers/likeCtrl");
const commentCtrl = require("./controllers/commentsCtrl");

// use functions
const appRouter = express.Router()
const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SET VIEW
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set('/img', path.join(__dirname, '/public'));
app.use(express.static(__dirname + '/public'))

// ROUTES

app.post("/register", userCtrl.register);
app.post("/login", userCtrl.login);
//app.post("/feed",postCtrl.);

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/", (req, res) => {
  res.render("home");
})

app.get("/postInfo", (req, res) => {
  res.render("postInfo");
})

app.get("/userInfo/",userCtrl.getAllusers)

appRouter.route("/userInfo/:id").get(userCtrl.getUserById)
appRouter.route("/post/:id").get(postCtrl.getPostById)
appRouter.route("/post/:id").post(likeCtrl.newLike)
appRouter.route("/post/unlike/:id").post(likeCtrl.unLike)
appRouter.route("/comment/:id").post(commentCtrl.newCom)


app.get("/profil",userCtrl.getUserProfile)

app.post("/profil",userCtrl.updateProfile)

app.post("/profil/delete",userCtrl.deleteUser)

app.use(appRouter);

app.get("/feed",postCtrl.getAllPosts)

app.post("/feed",postCtrl.newPost);

app.post("/logout/fromFeed",userCtrl.logOut)
app.post("/logout/fromProfil",userCtrl.logOut)





// LAUNCH SERVER
app.listen(process.env.APP_PORT, () => {
  console.log("EN ECOUTE");
});