// Imports

const models = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const validator = require('validator');

// Routes

module.exports = {
    register: (req, res) => {
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = req.body.password;
        let bio = req.body.bio;
        if (firstname == "" || lastname == "" || email == "" || password == "") {
            return res.status(400).json({ error: "Missing Info" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "invalid email" });   
         }
        models.Users.findOne({
            attributes: ["email"] ,
            where: { email: email }
        })
        .then(function(userFound) {
            if (!userFound) {
                bcrypt.hash(password, 5, function(error, bcryptedPassword) {
                    let newUser = models.Users.create({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0
                    })
                    .then(function(newUser) {
                        return res.status(201).json({ success: "user added", "userId": newUser.id });
                    })
                    .catch(function(error) {
                        return res.status(500).json({ error: "cannot add user" });
                    })
                })
            } else {
                return res.status(409).json({ error: "user already exists" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to verify user" });
        })
    },

    login: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (email == "" || password == "") {
            return res.status(400).json({ error: "one or more fields are empty"});
        }
        models.Users.findOne({
            where: { email: email }
        })
        .then(function(userFound) {
            if (userFound) {
                bcrypt.compare(password, userFound.password, function(errorBcrypt, resBcrypt) {
                    if(resBcrypt) {
                        return res.status(200).json({ success: "successfully logged in", userId: userFound.id, firstname: userFound.firstname, token: jwtUtils.generateTokenForUser(userFound) });
                    } else {
                        return res.status(403).json({ error: "invalid password" });
                    }
                })
            } else {
                return res.status(404).json({ error: "user not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to verify user" });
        })

    },

    update: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let bio = req.body.bio;

        models.Users.findOne({
            attributes: ["id", "firstname", "lastname", "email", "bio"],
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                userFound.update({
                    firstname: (firstname ? firstname : userFound.firstname),
                    lastname: (lastname ? lastname : userFound.lastname),
                    bio: (bio ? bio : userFound.bio)
                })
                return res.status(200).json({ success: userFound });
            } else {
                return res.status(404).json({ error: "user not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({error: "unable to verify user" });
        })
    },

    delete: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.Users.destroy({
                    where: { id : userId }
                })
                return res.status(200).json({ success: "The user has been deleted" });
            } else {
                return res.status(404).json({ error: "user not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to verify user"});
        })
    },

    getUsersAll: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.Users.findAll({
                    attributes: ["id", "email", "firstname", "lastname", "bio"]
                })
                .then(function(usersFound) {
                    return res.status(200).json({success : usersFound});
                })
                .catch(function(error) {
                    return res.status(404).json({ error: "no users found" });
                })
            } else {
                return res.status(403).json({ error: "invalid user" });
            }
        })
         .catch(function(error) {
             return res.status(500).json({ error: "unable to verify user" });
         })
    },

    getUsersByID: (req, res) => {

        let headerAuth = req.headers['authorization'];
        let userLoggedId = jwtUtils.getUserId(headerAuth);

        let userId = req.params.id;

        models.Users.findOne({
            where: { id : userLoggedId }
        })
        .then(function(userLoggedFound) {
            if(userLoggedFound) {               
                models.Users.findOne({
                    attributes: ["id", "email", "firstname", "lastname", "bio"],
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound) {
                        return res.status(200).json({ success: userFound });
                    } else {
                        return res.status(404).json({ error: "user not found" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ error: "cannot fetch user" });
                })
        } else {
            return res.status(403).json({ error: "invalid user" });
        }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "cannot verify user" });
        })    
    },

    getUsersProfile: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ error: "wrong token" });
        }

        models.Users.findOne({
            attributes: ["id", "email", "firstname", "lastname", "bio"],
            where: { id : userId }
        })
        .then(function(user) {
            if (user) {
                return res.status(200).json({success : user});
            } else {
                return res.status(404).json({ error: "user not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "cannot fetch user" });
        })
    }
};