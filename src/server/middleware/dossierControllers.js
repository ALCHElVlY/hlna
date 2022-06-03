// Import the dossier model
const Dossier = require('../database/models/dossier');

const getDossier = async (req, res) => {
  try {
    const { creature_name } = req.params;
    Dossier.findOne({ creature_name })
      .then((data) => res.json(data))
      .catch((e) => console.error(e));
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDossier,
};
