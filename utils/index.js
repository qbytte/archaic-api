// Body parser middleware
const bodyParser = (req, res, next) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    req.body = JSON.parse(body);
    next();
  });
};

exports.bodyParser = bodyParser;
