const dotenv = require('dotenv');
dotenv.config();
module.exports = {

      JWT_SECRET_KEY: process.env.JWT_SECRET,
      SESSION_EXPIRES_IN: process.env.SESSION_EXPIRES_IN,
      DB_STRING : process.env.DB_STRING

}