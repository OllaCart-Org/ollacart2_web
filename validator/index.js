exports.userSignupValidator = (req, res, next) => {
  req
    .check('email', 'Email must be between 4 to 320 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 4,
      max: 320,
    });
  
    const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
