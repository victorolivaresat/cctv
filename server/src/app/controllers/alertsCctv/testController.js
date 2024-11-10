const TestSamsung = require("../../models/alertCctv/TestSamsung");
const TestHv = require("../../models/alertCctv/TestHv");
const sequelize = require("../../../config/database");

const getTestHv = async (req, res) => {
  try {
    const tests = await TestHv.findAll();
    res.status(200).json(tests);
  } catch (error) {
    console.error("Error al obtener los datos de Test:", error);
    res.status(500).send("Error al obtener los datos de Test.");
  }
};

const getCountOfTestHv = async (req, res) => {
  try {
    const count = await TestHv.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error al obtener la cantidad de Test:", error);
    res.status(500).send("Error al obtener la cantidad de Test.");
  }
};

const getTestSamsung = async (req, res) => {
  try {
    const tests = await TestSamsung.findAll();
    res.status(200).json(tests);
  } catch (error) {
    console.error("Error al obtener los datos de Test:", error);
    res.status(500).send("Error al obtener los datos de Test.");
  }
};

const getCountOfTestSamsung = async (req, res) => {
  try {
    const count = await TestSamsung.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error al obtener la cantidad de Test:", error);
    res.status(500).send("Error al obtener la cantidad de Test.");
  }
};

const removeDuplicateTestHv = async (req, res) => {
  const io = req.io;

  try {
    const duplicates = await TestHv.findAll({
      attributes: ["name"],
      group: ["name"],
      having: sequelize.literal("COUNT(*) > 1"),
    });

    io.emit("totalDuplicates", { total: duplicates.length });

    if (duplicates.length > 0) {
      await sequelize.query(`
        DELETE t1 FROM TestHv t1
        INNER JOIN TestHv t2 
        WHERE t1.id < t2.id AND t1.name = t2.name
      `);
    }

    io.emit("allDuplicatesRemoved");

    res
      .status(200)
      .json({ message: "Registros duplicados eliminados con éxito" });

  } catch (error) {
    console.error(
      "Error al eliminar registros duplicados de Test Hikvision:",
      error
    );
    res
      .status(500)
      .send("Error al eliminar registros duplicados de Test Hikvision.");
  }
};

const getDistinctNameHvCount = async (req, res) => {
  try {
    const count = await TestHv.count({
      distinct: true,
      col: 'name'
    });

    return res.json(count);
    
  } catch (error) {
    console.error("Error al obtener la cantidad de nombres distintos:", error.message);
    res.status(500).send("Error al obtener la cantidad de nombres distintos");
  }
};

module.exports = {
  getTestHv,
  getTestSamsung,
  getCountOfTestHv,
  getCountOfTestSamsung,
  removeDuplicateTestHv,
  getDistinctNameHvCount
};
