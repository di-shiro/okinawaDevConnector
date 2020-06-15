const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// @route    Post api/users
// @desc     Register route
// @access   Public
router.post(
  '/',
  [
    check('name', '😓 ( T_T)＼(^-^ ) Name is required').not().isEmpty(),
    check('email', '😓 ( T_T)＼(^-^ ) Please include a valid email').isEmail(),
    check(
      'password',
      '😓 ヾ(๑╹◡╹)ﾉ" Please enter password with 6 or more character'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get user Gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return Jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // res.send('User registar 😁 ヾ(๑╹◡╹)ﾉ" 😁');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error 😓 ( T_T)＼(^-^ )');
    }
  }
);

module.exports = router;
