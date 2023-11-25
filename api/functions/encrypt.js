const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// Generate JWT
function generateToken(user, rememberMe = false) {
  const payload = {
    userId: user._id,
    username: user.uname,
    rememberMe: rememberMe,
  };

  secretKey = process.env.SESSION_KEY;
  const expiresIn = rememberMe ? "7d" : "1min"; // Set expiration based on rememberMe value

  const token = jwt.sign(payload, secretKey, {
    expiresIn,
  });

  return token;
}

function verifyToken(token) {
  secretKey = process.env.SESSION_KEY;
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
};
