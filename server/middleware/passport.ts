import User from "../models/user.model";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../config/config.json";

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

export default new JwtStrategy(opts, function (jwt_payload, done) {
  User.findById(jwt_payload.id, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});
