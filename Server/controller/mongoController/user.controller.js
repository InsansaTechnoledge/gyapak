import User from '../../models/user.model.js';
import { APIError } from '../../Utility/ApiError.js';
import { APIResponse } from '../../Utility/ApiResponse.js';

export const changePassword = async (req, res) => {
  try {
    const { newpassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      user.password = newpassword;
      const passwordChanged = await user.save();

      if (passwordChanged) {
        return new APIResponse(200, null, 'password changed successfully').send(res);
      }
    }
  } catch (e) {
    return new APIError(500, ['enable to change password', e.message]).send(res);
  }
};