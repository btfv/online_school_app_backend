const JoiErrorParser = require('../utils/joi.error.parser.util');

module.exports = function JoiValidator(schema) {
  return async (req, res, next) => {
    try {
      const body = req.body;
      await schema.validateAsync(body);
    } catch (err) {
      const parsed_err = JoiErrorParser(err);
      return res.status(400).json(parsed_err);
    }
    next();
  };
};
