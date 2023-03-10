const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validateResetPassword } = require('../validations/settingsValidation');

// @desc User reset password
// @route POST /api/settings/reset-password
// @access Private
const resetPassword = async (req, res, next) => {
  try {
    const { error } = validateResetPassword(req.body);
    if (error) {
      // if it is the regex pattern
      if (error.details[0].context?.regex) {
        return res.status(400).json({
          message:
            'Password must contain at least one uppercase, lowercase, number and special character',
        });
      }

      return res.status(400).json({ message: error.details[0].message });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // check if the password is correct
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).send({ message: 'Current password is invalid' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = resetPassword;
