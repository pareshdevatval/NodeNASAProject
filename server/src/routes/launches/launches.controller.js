const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchWithId,
} = require("../../models/launches.models");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const response = await getAllLaunches(skip, limit);
  return res.status(200).json(response);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const { id } = req.params;
  const launch = await existsLaunchWithId(Number(id));
  if (launch) {
    const abortLaunch = await abortLaunchWithId(Number(id));
    if (abortLaunch) {
      return res.status(400).json({ error: "Launch not aborted" });
    } else {
      return res.status(200).json({ ok: true });
    }
  } else {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
