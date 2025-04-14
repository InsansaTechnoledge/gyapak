import { APIResponse } from '../../Utility/ApiResponse.js';
import User from '../../models/user.model.js';
import { APIError } from '../../Utility/ApiError.js';
import passport from 'passport';
import { CLIENT_BASE_URL_LOCAL } from '../../config/env.js';

// function to sign-in user
export const registerUser = async (req, res) => {
  // const {name,email,password} = req.body
  try {
    const user = await User.create(req.body);

    if (user) {
      return new APIResponse(200, user, 'User created successfully').send(res);
    }
  } catch (e) {
    return new APIError(400, [e.message]).send(res);
  }
};

// function to login user with last login details
export const loginUser = async (req, res) => {
  try {
    const lastLogin = Date.now();

    const rememberMeBoolean = req.body.rememberMe;

    if (rememberMeBoolean) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.maxAge = 1 * 24 * 60 * 60 * 1000;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { lastLogin: lastLogin },
      { new: true }
    );

    return new APIResponse(200, { user }, 'user loggedIn successfully').send(res);
  } catch (e) {
    return new APIError(500, [e.message]).send(res);
  }
};

// function to log user out
export const logoutUser = async (req, res) => {
  try {
    req.logout(err => {
      if (err) return new APIError(500, [err.message]).send(res);

      req.session.destroy(err => {
        if (err) return new APIError(500, [err.message]).send(res);

        res.clearCookie('connect.sid');
        return new APIResponse(200, null, 'logged out succcesfully').send(res);
      });
    });
  } catch (e) {
    return new APIError(500, [e.message]).send(res);
  }
};

// function to login with google
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: true,
});

export const googleCallback = passport.authenticate('google', {
  successRedirect: `/api/v1i2/auth/profile`,
  faliureRedirect: `${CLIENT_BASE_URL_LOCAL}`,
  session: true,
});

export const googleProfile = (req, res) => {
  if (!req.user) return new APIError(401, ['unauthorized']).send(res);

  res.redirect(`${CLIENT_BASE_URL_LOCAL}`);
};

// chek auth function , for checking cookies
export const checkAuth = async (req, res) => {
  return new APIResponse(200, { user: req.user }, 'session found').send(res);
};
