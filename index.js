const mongoose = require("mongoose");
const authenticate = require("mm-authenticate")(mongoose);
const { Team, Script } = require("mm-schemas")(mongoose);

const send = (res, status, data) => (res.statusCode = status, res.end(data));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;

module.exports = authenticate(async (req, res) => {
  const team = req.user;
  if (!team.admin) {
    send(res, 403, "Forbidden");
    return;
  }
  console.log("Getting teams");
  send(res, 200, JSON.stringify(await Team.find({}).populate('latestScript').populate('mostRecentPush').exec()));
});
