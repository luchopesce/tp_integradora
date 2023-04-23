import passport from "passport";
import LocalStrategy from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHashB, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

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
          const { name, surname } = req.body;
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          } else {
            let rol = "usuario";
            if (username.endsWith("@coder.com")) {
              rol = "admin";
            }
            const newUser = {
              name,
              surname,
              email: username,
              password: createHashB(password),
              rol: rol,
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
      async (accessToken, refreshToken, profile, done) => {
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

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    return done(null, user);
  });
};

export { initialzedPassport };
