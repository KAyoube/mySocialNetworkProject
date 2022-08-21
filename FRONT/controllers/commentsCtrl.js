const fetch = require("node-fetch");
const LocalStorage = require("node-localstorage").LocalStorage;
let localStorage = new LocalStorage("./storageToken");
require("dotenv").config();

exports.newCom = async (req, res) => {
  await fetch(
    `http://${process.env.API_HOST}/api/posts/${req.params.id}/comments/new/`,
    {
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
        text: req.body.text,
      }),
    }
  )
    // Converting to JSON
    .then((res) => {
      return res.json();
    })

    // Displaying results to console
    .then((json) => {
      res.render("postInfo", json);
    })

    .catch((err) => {
      console.log("ERR ----", err);
    });
};
