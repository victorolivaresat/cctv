const CustomTheme = require("../models/CustomTheme");

getTheme = async (req, res) => {
  try {
    const theme = await CustomTheme.findOne({
      where: { userId: req.params.userId },
    });
    if (!theme) {
      return res.status(404).json({ message: "Tema no encontrado" });
    }
    res.json(theme);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

updateTheme = async (req, res) => {
  try {
    const { darkMode } = req.body;
    const theme = await CustomTheme.findOne({
      where: { userId: req.params.userId },
    });

    if (!theme) {
      return res.status(404).json({ message: "Tema no encontrado" });
    }

    theme.darkMode = darkMode;
    
    await theme.save();
    
    res.json(theme);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTheme,
  updateTheme,
};
