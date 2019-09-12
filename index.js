const { promisify } = require("util");

const mongoose = require("mongoose");
const authenticate = require("mm-authenticate")(mongoose);
const { Team, Script } = require("mm-schemas")(mongoose);

const send = (res, status, data) => (res.statusCode = status, res.end(data));

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

module.exports = authenticate(async (req, res) => {
  const team = req.user;
  if (!team.admin) {
    return send(res, 403, "Forbidden");
  }
  console.log("Getting teams");
  return Team.find({}).populate('latestScript').exec();
});
