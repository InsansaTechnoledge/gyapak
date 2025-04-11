import User from '../../models/user.model.js';
import { APIError } from '../../Utility/ApiError.js';
import { APIResponse } from '../../Utility/ApiResponse.js';
import PasswordResetToken from '../../models/PasswordReset.model.js';
import crypto from 'crypto';

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return new APIError(400,['No user with that email']).send(res);
    else if(user && user.googleId){
      return new APIError(400, ['user is registered with google, please sign in with google']).send(res);
    }

    // Remove any previous tokens
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Create a new secure token
    const token = crypto.randomBytes(32).toString('hex');
    console.log(token);
    // Save the token in the DB with TTL
    await new PasswordResetToken({ userId: user._id, token }).save();

    // Send email
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: 'youremail@gmail.com',
    //     pass: 'yourpassword'
    //   }
    // });

    // const resetURL = `http://localhost:3000/reset-password/${token}`;

    // const mailOptions = {
    //   to: user.email,
    //   from: 'no-reply@example.com',
    //   subject: 'Password Reset',
    //   text: `You requested a password reset. Click the link to reset: ${resetURL}`
    // };

    // await transporter.sendMail(mailOptions);

    return new APIResponse(200, null, "Password reset link sent to email").send(res);
  } catch (err) {
    return new APIError(500, [err.message]).send(res);
  }
};

export const resetPassword = async (req,res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken)
      return new APIError(400,['Token is invalid or has expired']).send(res);

    const user = await User.findById(resetToken.userId);
    if (!user)
      return new APIError(404,['User not found']).send(res);

    user.password = password;
    await user.save();

    // Delete the token after successful reset
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return new APIResponse(200, null, 'Password has been reset successfully.' ).send(res);
  } catch (err) {
    console.error(err);
    return new APIError(500, [err.message, 'internal server error']).send(res);
  }
};