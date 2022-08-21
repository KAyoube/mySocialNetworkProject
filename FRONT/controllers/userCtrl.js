const fetch = require("node-fetch");
const LocalStorage = require("node-localstorage").LocalStorage;
let localStorage = new LocalStorage("./storageToken");
require("dotenv").config();

// MES FONCTIONS USER

// IS LOGED
exports.isLogged = async (req, res, next) => {
  let myToken = localStorage.getItem("token");

  if (myToken != "") {
    next();
  } else {
    res.redirect("/login");
  }
};

exports.register = async (req, res) => {
  let reg = await fetch(`http://${process.env.API_HOST}/api/users/register/`, {
    // Adding method type
    method: "POST",

    // Adding body or contents to send
    body: JSON.stringify({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
      email: req.body.email,
      password: req.body.password,
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json",
    },
  })
    // Converting to JSON
    .then((response) => response.json())

    .then((json) => {
      // SI USER CRER ON RENVOI VERS LOGIN
      if (json.success) {
        res.redirect("/login");
        // SINON ON LUI  RENVOI UN MSG D'ERREUR
      } else {
        res.render("register", json);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.login = async (req, res) => {
  await fetch(`http://${process.env.API_HOST}/api/users/login/`, {
    // Adding method type
    method: "POST",

    // Adding headers to the request
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",

    // Adding body or contents to send
    body: JSON.stringify({
      email: req.body.email,
      password: req.body.password,
    }),
  })
    // Converting to JSON
    .then((res) => {
      return res.json();
    })

    // Displaying results to console
    .then((json) => {
      localStorage.setItem("token", json.token);

      if (json.token) {
        res.redirect("/feed");
      } else {
        res.render("login", json);
      }
    })

    .catch((err) => {
      console.log("ERR ----", err);
    });
};

exports.getUserProfile = async (req, res) => {
  // recupere les infos user
  const userInfo = await fetch(
    `http://${process.env.API_HOST}/api/users/getUsersProfile/`,
    {
      headers: {
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );
  const myProfil = await userInfo.json();

  if (myProfil) {
    res.render("profil", myProfil);
  } else {
    res.redirect("/login");
  }
};

exports.getUserById = async (req, res) => {
  const userInfo = await fetch(
    `http://${process.env.API_HOST}/api/users/getUsersByID/${req.params.id}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );
  const user = await userInfo.json();
  res.render("userInfo", user);
};

exports.getAllusers = async (req, res) => {
  // recupere les infos user
  const userAll = await fetch(
    `http://${process.env.API_HOST}/api/users/getUsersAll/`,
    {
      headers: {
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );
  const userS = await userAll.json();

  if (userS) {
    res.render("userAll", userS);
  } else {
    res.redirect("/login");
  }
};

exports.updateProfile = async (req, res) => {
  fetch(`http://${process.env.API_HOST}/api/users/update/`, {
    // Adding method type
    method: "PUT",

    // Adding body or contents to send
    body: JSON.stringify({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json",
      Authorization: localStorage.getItem("token"), //Token à récupérer
    },
  })
    // Converting to JSON
    .then((response) => response.json())

    // Displaying results to console
    .then((json) => {
      res.render("profil", json);
    });
};

exports.deleteUser = async (req, res) => {
  const response = await fetch(
    `http://${process.env.API_HOST}/api/users/delete/`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );

  const myJson = await response.json();

  res.redirect("/register");
};

exports.logOut = async (req, res, next) => {
  localStorage.clear();

  res.redirect("/login");
};
