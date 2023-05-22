import passport from "passport";
import LocalStrategy from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHashB, isValidPassword, cookieExtractor } from "../utils.js";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

const jwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initialzedPassport = () => {
  passport.use(
    "signupStrategy",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          } else {
            let role;
            if (username.endsWith("@coder.com")) {
              role = "admin";
            }
            const newUser = {
              first_name: first_name,
              last_name: last_name,
              email: username,
              password: createHashB(password),
              role: role,
            };
            const userCreated = await userModel.create(newUser);
            return done(null, userCreated);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "signupGithub",
    new GitHubStrategy(
      {
        clientID: "Iv1.c36a35e8dbe1d548",
        clientSecret: "28335403f217daea60f909e9a8a9a194a7b17403",
        callbackURL: "http://localhost:8080/sessions/github-callback",
      },
      async (accessToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile.username });
          if (user) {
            return done(null, user);
          } else {
            const newUser = {
              name: profile.displayName,
              surname: null,
              email: profile.username,
              password: createHashB(profile.id),
              rol: "usuario",
            };
            const userCreated = await userModel.create(newUser);
            return done(null, userCreated);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "loginStrategy",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new jwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "tokenSecretKey",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

};



export { initialzedPassport };
