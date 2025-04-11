const cors = require('cors');
const cookieParser = require('cookie-parser');

export default function (app) {

  app.use(cookieParser());

}
