const moment = require("moment");


const format = (date) => {
  return  moment(date, "YYYY-MM-DD").startOf("day").format("YYYY-MM-DD HH:mm:ss");
};

module.exports = {
    format
};
