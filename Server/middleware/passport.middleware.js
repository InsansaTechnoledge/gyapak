import passport from 'passport';
import { APIError } from '../Utility/ApiError.js';

export const authenticateMiddleware = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // console.log(info);
    if (err) return new APIError(400, [err.message]).send(res);

    if (!user) {
      // new APIError(info?.message || 'user not found', 400, [info?.message || 'user not found'])
      return new APIError(400, [info?.message || 'user not found']).send(res);
    }

    req.logIn(user, e => {
      if (e) return new APIError(500, [e.message]).send(res);
      return next();
    });
  })(req, res, next);
};
