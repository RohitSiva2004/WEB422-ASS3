const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoDBConnectionString = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

let Schema = mongoose.Schema;

let userSchema = new Schema({
    userName: { type: String, unique: true },
    password: String,
    favourites: [String]
});

let User;

module.exports.connect = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(mongoDBConnectionString);
        db.on('error', err => reject(err));
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            return reject("Passwords do not match");
        }

        bcrypt.hash(userData.password, 10).then(hash => {
            userData.password = hash;
            let newUser = new User(userData);
            newUser.save()
                .then(() => resolve("User " + userData.userName + " successfully registered"))
                .catch(err => {
                    if (err.code === 11000) reject("User Name already taken");
                    else reject("Error creating user: " + err);
                });
        }).catch(err => reject(err));
    });
};

module.exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName }).exec()
            .then(user => {
                if (!user) return reject("User not found");
                bcrypt.compare(userData.password, user.password)
                    .then(res => {
                        if (!res) return reject("Incorrect password");
                        resolve(user);
                    });
            }).catch(err => reject("Unable to find user: " + err));
    });
};

module.exports.verifyToken = function (token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return reject("Invalid token");
            resolve(decoded._id);
        });
    });
};

module.exports.getFavourites = function (id) {
    return new Promise((resolve, reject) => {
        User.findById(id).exec()
            .then(user => resolve(user.favourites))
            .catch(err => reject("Unable to get favourites: " + err));
    });
};

module.exports.addFavourite = function (id, favId) {
    return new Promise((resolve, reject) => {
        User.findById(id).exec().then(user => {
            if (user.favourites.length < 50) {
                User.findByIdAndUpdate(id, { $addToSet: { favourites: favId } }, { new: true }).exec()
                    .then(u => resolve(u.favourites))
                    .catch(err => reject("Unable to update favourites"));
            } else reject("Maximum favourites reached");
        });
    });
};

module.exports.removeFavourite = function (id, favId) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, { $pull: { favourites: favId } }, { new: true }).exec()
            .then(u => resolve(u.favourites))
            .catch(err => reject("Unable to remove favourite"));
    });
};
