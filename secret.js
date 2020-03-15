require('dotenv').config();
module.exports.PORT = process.env.PORT || 3000;
module.exports.JWT_SECRET = process.env.JWT_SECRET || 'secret key';
module.exports.CODE = process.env.NODE_ENV !== 'production';

