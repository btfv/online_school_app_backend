module.exports = function JoiErrorParser(err) {
  if (process.env.NODE_ENV === 'production') {
    return {
      errors: err.details.map((err) => err.message),
    };
  }
  return err;
};
