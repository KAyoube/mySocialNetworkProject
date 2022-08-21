const fetch = require("node-fetch");
const LocalStorage = require("node-localstorage").LocalStorage;
let localStorage = new LocalStorage("./storageToken");
require("dotenv").config();

exports.getAllPosts = async (req, res) => {
  // recupere la list des post
  const posts = await fetch(`http://${process.env.API_HOST}/api/posts/all/`, {
    headers: {
      Authorization: localStorage.getItem("token"), // Token à récupérer
    },
  });
  const userPost = await posts.json();

  res.render("feed", userPost);
};

exports.newPost = async (req, res) => {
  await fetch(`http://${process.env.API_HOST}/api/posts/new/`, {
    // Adding method type
    method: "POST",

    // Adding headers to the request
    headers: {
      Authorization: localStorage.getItem("token"),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",

    // Adding body or contents to send
    body: JSON.stringify({
      title: req.body.title,
      text: req.body.text,
    }),
  })
    // Converting to JSON
    .then((res) => {
      return res.json();
    })

    // Displaying results to console
    .then((json) => {
      if (json) {
        res.redirect("/feed");
      } else {
        res.redirect("/login");
      }
    })

    .catch((err) => {
      console.log("ERR ----", err);
    });
};

exports.getPostById = async (req, res) => {
  const userInfo = await fetch(
    `http://${process.env.API_HOST}/api/users/getPostByID/${req.params.id}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );
  const post = await userInfo.json();

  res.render("postInfo", post);
};

exports.deletePost = async (req, res) => {
  await fetch(`http://${process.env.API_HOST}/api/posts/new/`, {
    // Adding method type
    method: "POST",

    // Adding headers to the request
    headers: {
      Authorization: localStorage.getItem("token"),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",

    // Adding body or contents to send
    body: JSON.stringify({
      title: req.body.title,
      text: req.body.text,
    }),
  })
    // Converting to JSON
    .then((res) => {
      return res.json();
    })

    // Displaying results to console
    .then((json) => {
      if (json) {
        res.redirect("/feed");
      } else {
        res.redirect("/login");
      }
    })

    .catch((err) => {
      console.log("ERR ----", err);
    });
};
