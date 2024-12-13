const DvrControl = require("../models/DvrControl");
const Sequelize = require("sequelize");

const createDvrControl = async (req, res) => {
  try {
    const {
      store_name,
      company_name,
      dvr_name,
      notification_email_in,
      notification_email_out,
      remote_connection_tool,
      remote_connection_id,
      notifications_status,
      notes,
      supervisor,
    } = req.body;

    const dvrControl = await DvrControl.create({
      store_name,
      company_name,
      dvr_name,
      notification_email_in,
      notification_email_out,
      remote_connection_tool,
      remote_connection_id,
      notifications_status,
      notes,
      supervisor: JSON.stringify(supervisor),
    });

    res.status(201).json({
      message: "DVR Control created successfully",
      id: dvrControl.id,
      store_name: dvrControl.store_name,
      company_name: dvrControl.company_name,
      createdAt: dvrControl.created_at,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating DVR Control", message: error.message });
  }
};

const getDvrControl = async (req, res) => {
  try {
    const dvrControl = await DvrControl.findByPk(req.params.id);

    if (!dvrControl) {
      return res.status(404).json({ error: "DVR Control not found" });
    }

    res.status(200).json(dvrControl);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving DVR Control" });
  }
};

const getAllDvrControls = async (req, res) => {
  try {
    const dvrControls = await DvrControl.findAll();
    res.status(200).json(dvrControls);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving DVR Controls" });
  }
};

const updateDvrControl = async (req, res) => {
  try {
    const dvrControl = await DvrControl.findByPk(req.params.id);
    if (!dvrControl) {
      return res.status(404).json({ error: "DVR Control not found" });
    }

    const {
      store_name,
      company_name,
      dvr_name,
      notification_email_in,
      notification_email_out,
      remote_connection_tool,
      remote_connection_id,
      notifications_status,
      notes,
      supervisor,
    } = req.body;

    // Solo actualiza los campos que fueron proporcionados
    if (store_name !== undefined) dvrControl.store_name = store_name;
    if (company_name !== undefined) dvrControl.company_name = company_name;
    if (dvr_name !== undefined) dvrControl.dvr_name = dvr_name;
    if (notification_email_in !== undefined)
      dvrControl.notification_email_in = notification_email_in;
    if (notification_email_out !== undefined)
      dvrControl.notification_email_out = notification_email_out;
    if (remote_connection_tool !== undefined)
      dvrControl.remote_connection_tool = remote_connection_tool;
    if (remote_connection_id !== undefined)
      dvrControl.remote_connection_id = remote_connection_id;
    if (notifications_status !== undefined)
      dvrControl.notifications_status = notifications_status;
    if (notes !== undefined) dvrControl.notes = notes;
    if (supervisor !== undefined)
      dvrControl.supervisor = JSON.stringify(supervisor);

    // Guardar los cambios
    await dvrControl.save();
    res.status(200).json(dvrControl);
  } catch (error) {
    res.status(500).json({ error: "Error updating DVR Control" });
  }
};

const deleteDvrControl = async (req, res) => {
  try {
    const dvrControl = await DvrControl.findByPk(req.params.id);
    if (!dvrControl) {
      return res.status(404).json({ error: "DVR Control not found" });
    }
    await dvrControl.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting DVR Control" });
  }
};

const updateDvrControlStatus = async (req, res) => {
  const { id } = req.params;
  const { notifications_status } = req.body;

  try {
    const dvrControl = await DvrControl.findByPk(id);

    if (!dvrControl) {
      return res.status(404).json({ message: "DVR Control not found" });
    }

    dvrControl.notifications_status = notifications_status;
    await dvrControl.save();

    return res.status(200).json(dvrControl);
  } catch (error) {
    console.error("Error updating DVR Control status:", error);
    return res.status(500).json({ error: "Error updating DVR Control status" });
  }
};

const getStoreStatusCounts = async (req, res) => {
  try {
    const statusCounts = await DvrControl.findAll({
      attributes: [
        "notifications_status",
        [Sequelize.fn("COUNT", Sequelize.col("notifications_status")), "count"],
      ],
      where: {
        status: 1,
      },
      group: ["notifications_status"],
    });

    const totalStores = await DvrControl.count();
    const operationalCount = await DvrControl.count({ where: { status: 1 } });
    const inoperativeCount = await DvrControl.count({ where: { status: 2 } });
    const closedCount = await DvrControl.count({ where: { status: 3 } });

    const data = statusCounts.map((item) => ({
      status: item.notifications_status ? "Activo" : "Inactivo",
      count: parseInt(item.dataValues.count, 10),
    }));

    res.status(200).json({
      totalStores,
      operational: operationalCount,
      inoperative: inoperativeCount,
      closed: closedCount,
      notificationsStatus: data,
    });
  } catch (error) {
    console.error("Error in getStoreStatusCounts:", error);
    res.status(500).json({
      error: "Error retrieving store status counts",
      message: error.message,
    });
  }
};

module.exports = {
  createDvrControl,
  getDvrControl,
  getAllDvrControls,
  updateDvrControl,
  deleteDvrControl,
  updateDvrControlStatus,
  getStoreStatusCounts,
};
