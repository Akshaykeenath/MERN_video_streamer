const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error in hashPassword:", error);
    throw error;
  }
}

async function verifyPassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error in verifyPassword:", error);
    throw error;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
};
