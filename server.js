const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userService = require("./user-service.js");
const passport = require('passport');
const passportJWT = require('passport-jwt');

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromExtractors([
        (req) => {
            let token = null;
            if (req && req.headers && req.headers.authorization) {
                const authHeader = req.headers.authorization;
                if (authHeader.startsWith('JWT ')) {
                    token = authHeader.substring(4);
                }
            }
            return token;
        }
    ]),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    return done(null, jwt_payload);
}));


app.post("/api/user/register", (req, res) => {
    userService.registerUser(req.body)
        .then(msg => res.json({ message: msg }))
        .catch(msg => res.status(422).json({ message: msg }));
});


app.post("/api/user/login", (req, res) => {
    userService.checkUser(req.body)
        .then(user => {
            const jwt = require('jsonwebtoken');
            const payload = {
                _id: user._id,
                userName: user.userName
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({ message: "login successful", token: token });
        })
        .catch(msg => res.status(422).json({ message: msg }));
});


app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getFavourites(req.user._id)
        .then(data => res.json(data))
        .catch(err => res.status(422).json({ message: err }));
});


app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addFavourite(req.user._id, req.params.id)
        .then(data => res.json(data))
        .catch(err => res.status(422).json({ message: err }));
});


app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.removeFavourite(req.user._id, req.params.id)
        .then(data => res.json(data))
        .catch(err => res.status(422).json({ message: err }));
});


userService.connect()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log("API listening on port " + HTTP_PORT));
    })
    .catch(err => {
        console.log("Unable to start server:", err);
        process.exit();
    });
