const { promisify } = require("util");

const mongoose = require("mongoose");
const { send } = require("micro");
const { Team } = require("mm-schemas")(mongoose);

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

module.exports = async (req, res) => {
  console.log('Getting teams');
  const teams = await Team.find({}).exec();
  return teams.map(t => t.name);
};
