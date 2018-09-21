const { promisify } = require("util");

const mongoose = require("mongoose");
const { send } = require("micro");
const authenticate = require("mm-authenticate")(mongoose);
const { Team, Script } = require("mm-schemas")(mongoose);

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

module.exports = authenticate(async (req, res) => {
  const team = req.user;
  if (!team.admin) {
    return send(res, 403, "Forbidden");
  }
  console.log("Getting teams");
  const teams = await Team.find({}).exec();
  const scripts = await Promise.all(
    teams.map(team => Script.findById(team.latestScript).exec())
  );
  const zipped = teams.map(function(team, i) {
    return {
      team: team,
      script: scripts[i]
    };
  });
  return zipped;
});
