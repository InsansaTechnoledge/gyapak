import User from '../models/user.model.js';
import { APIError } from '../Utility/ApiError.js';

export const checkPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    const { newpassword, oldpassword } = req.body;


    const isMatch = await user.comparePassword(oldpassword);
    if (!isMatch) {
      return new APIError(400, ['incorrect password']).send(res);
    }
    if (newpassword === oldpassword) {
      return new APIError(400, ['new password can not be same as old password']).send(
        res
      );
    }
    next();
  } catch (e) {
    return new APIError(500, [e.message]).send(res);
  }
};
