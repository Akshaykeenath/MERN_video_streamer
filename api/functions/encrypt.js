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
function generateToken(user) {
  const payload = {
    userId: user._id,
    username: user.uname,
  };

  secretKey = process.env.SESSION_KEY;
  const token = jwt.sign(payload, secretKey, {
    expiresIn: "1h",
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
