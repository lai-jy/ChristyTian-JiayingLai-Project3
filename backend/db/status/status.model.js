const mongoose = require('mongoose');
const StatusSchema = require('./status.schema').StatusSchema;

const StatusModel = mongoose.model('Status', StatusSchema);

async function createStatus(status) {
  try {
    const newStatus = new StatusModel(status);
    await newStatus.save();
    return newStatus;
  } catch (e) {
    throw e;
  }
}

async function findStatusById(id) {
  return await StatusModel.findById(id);
}

async function findStatusesByUsername(username) {
  return await StatusModel.find({ username }).sort({ createdAt: -1 });
}

async function getAllStatuses() {
  return await StatusModel.find().sort({ createdAt: -1 });
}

async function deleteStatus(id) {
  try {
    await StatusModel.deleteOne({ _id: id });
  } catch (e) {
    throw e;
  }
}

async function updateStatus(id, newContent) {
  try {
    const updatedStatus = await StatusModel.findByIdAndUpdate(
        id,
        { content: newContent },
        { new: true }
    );
    return updatedStatus;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createStatus,
  findStatusById,
  findStatusesByUsername,
  getAllStatuses,
  deleteStatus,
  updateStatus
};