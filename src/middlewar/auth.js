const jwt = require("jsonwebtoken");

exports.authorization =async(req, res, next) => {
    const x_access_token = req.headers["authorization"];
    if (typeof x_access_token !== undefined) {
      req.token = x_access_token;
      verifyJWT(req, res, next);
    } else {
      res.sendStatus(403);
    }
  }
  var verifyJWT = async(req, res, next) =>{
    jwt.verify(req.token, 'task-managmeny-xdfd', async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const _data = await jwt.decode(req.token, {
          complete: true,
          json: true,
        });
        req.user = _data["payload"];
        
        req.userId = req.user.userId;
         req.email = req.user.email;
        next();
      }
    });
  }