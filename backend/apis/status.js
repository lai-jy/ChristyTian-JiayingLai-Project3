const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const StatusModel = require('../db/status/status.model');

// Get all statuses
router.get('/all', async function(request, response) {
  try {
    const statuses = await StatusModel.getAllStatuses();
    response.send(statuses);
  } catch (error) {
    console.log('Error getting statuses:', error);
    response.status(500).send(error);
  }
});

// Create new status
router.post('/create', async function(request, response) {
  const username = request.cookies.username;

  if (!username) {
    return response.status(401).send("Must be logged in to create status");
  }

  try {
    const decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD");

    if (!request.body.content) {
      return response.status(400).send("Content is required");
    }

    const newStatus = {
      username: decryptedUsername,
      content: request.body.content
    };

    const status = await StatusModel.createStatus(newStatus);
    console.log('Created status:', status);
    response.send(status);
  } catch (error) {
    console.log('Error creating status:', error);
    response.status(500).send(error.message);
  }
});

// Delete status
router.delete('/:id', async function(request, response) {
  const username = request.cookies.username;

  if (!username) {
    return response.status(401).send("Must be logged in to delete status");
  }

  try {
    const decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD");
    const status = await StatusModel.findStatusById(request.params.id);

    if (!status) {
      return response.status(404).send("Status not found");
    }

    if (status.username !== decryptedUsername) {
      return response.status(403).send("Not authorized to delete this status");
    }

    await StatusModel.deleteStatus(request.params.id);
    response.send({ message: "Status deleted successfully" });
  } catch (error) {
    console.log('Error deleting status:', error);
    response.status(500).send(error.message);
  }
});

// Get user's statuses
router.get('/user/:username', async function(request, response) {
  try {
    const statuses = await StatusModel.findStatusesByUsername(request.params.username);
    response.send(statuses);
  } catch (error) {
    console.log('Error getting user statuses:', error);
    response.status(500).send(error);
  }
});

module.exports = router;