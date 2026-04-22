
const jwt = require('jsonwebtoken');
const generatTokenAndSetCookies = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.JWT_SECURE === "production",
    sameSite: "strict",
    maxAge: 7 * 60 * 60 * 24 * 1000,
  });
  return token;
};

module.exports =  generatTokenAndSetCookies