const VRContent = require('../models/VRContent');
const ARVRInteractionLog = require('../models/ARVRInteractionLogs');

// Fetch all VR content
exports.getAllVRContent = async (req, res) => {
  try {
    const content = await VRContent.find();
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Log user interaction with VR content
exports.logVRInteraction = async (req, res) => {
  try {
    const { userId, contentId, durationSpent } = req.body;
    const log = new ARVRInteractionLog({
      userId,
      contentId,
      contentType: 'VR',
      durationSpent
    });
    await log.save();
    res.status(201).json({ success: true, message: 'Interaction logged successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
