import WeeklyReport from "../../models/weekly-report.models.js";

const fecthReport = async (req, res) => {
  try {
    const fecthedReport = await WeeklyReport.findOne({
      type: "weekly-expiry-report",
    });
    if (fecthedReport)
      return res
        .status(200)
        .json({ message: "fetched data succfully", data: fecthedReport });
  } catch (err) {
    console.log(err);
  }
};

export default fecthReport;
