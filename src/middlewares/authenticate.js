import passport from "passport";

export const authenticate = (strategy) => {
  const passportAuthenticate = async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.info = info.toString();
        return next();
      }
      req.user = user;
      next();
    })(req, res, next);
  };
  return passportAuthenticate;
};

export const authorize = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autorizado" });
    } else if (req.user.role !== role) {
      return res.status(403).json({ message: "Usuario sin permisos" });
    }
    next();
  };
};
