const { promisify } = require("util");

const mongoose = require("mongoose");
const { send } = require("micro");
const { Team, Script } = require("mm-schemas")(mongoose);

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;


module.exports = async (req, res) => {
  console.log('Getting teams');
  const teams = await Team.find({}).exec();
  let scripts = await Promise.all(
    teams.map(team => Script.findById(team.latestScript).exec())
  );
  var zipped = teams.map(function(team, i) {
    return {
      "team": team,
      "script": scripts[i]
    }
  });
  return zipped;
};
