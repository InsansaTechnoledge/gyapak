import { APIError } from '../Utility/ApiError.js';

export const isLoggedInMiddleware = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return new APIError(400, ['session expired , please login again']).send(
      res
    );
  }
};

export const isInstituteAuthenticated = async (req , res , next) => {
  if(req.isAuthenticated() && req.user?.loginType === 'institute') return next();

  return new APIError(401 , ['Not authorized as institute']).send(res);
}