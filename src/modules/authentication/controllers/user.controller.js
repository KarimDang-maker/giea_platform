const userService = require("../services/user.service");

/**
 * UserController - Only handles HTTP request/response
 * All business logic is delegated to UserService
 */

// ========== PROFILE MANAGEMENT ==========

exports.updateProfile = async (req, res) => {
  try {
    const profileData = req.body;

    const updatedUser = await userService.updateProfile(req.user.userId, profileData);

    res.json({
      message: "Profile updated successfully",
      user: updatedUser.getPublicProfile(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const result = await userService.uploadAvatar(req.user.userId, req.file);

    res.json({
      message: "Avatar uploaded successfully",
      avatar: result.avatar,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const preferences = req.body;

    await userService.updatePreferences(req.user.userId, preferences);

    res.json({
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log("changePassword - userId:", req.user?.userId);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    await userService.changePassword(req.user?.userId, currentPassword, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message, error.stack);
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("getUserById - userId param:", userId, "requestingUserId:", req.user?.userId);

    const publicProfile = await userService.getUserById(userId, req.user?.userId);

    res.json(publicProfile);
  } catch (error) {
    console.error("Get user error:", error.message, error.stack);
    res.status(500).json({ message: error.message || "Server error retrieving user" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q, role, skip = 0, limit = 20 } = req.query;
    console.log("searchUsers - query params:", { q, role, skip, limit });

    const result = await userService.searchUsers({ q, role }, skip, limit);

    res.json(result);
  } catch (error) {
    console.error("Search users error:", error.message, error.stack);
    res.status(500).json({ message: error.message || "Server error searching users" });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    await userService.deactivateAccount(req.user.userId);

    res.clearCookie("token");
    res.json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Deactivate account error:", error);
    res.status(400).json({ message: error.message });
  }
};

// ========== SKILLS MANAGEMENT ==========

exports.addSkill = async (req, res) => {
  try {
    const skillData = req.body;

    const skill = await userService.addSkill(req.user.userId, skillData);

    res.status(201).json({
      message: "Skill added successfully",
      skill,
    });
  } catch (error) {
    console.error("Add skill error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const result = await userService.getSkills(req.user.userId);

    res.json(result);
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const skill = await userService.getSkill(req.user.userId, skillId);

    res.json({ skill });
  } catch (error) {
    console.error("Get skill error:", error);
    res.status(404).json({ message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const skillData = req.body;

    const skill = await userService.updateSkill(req.user.userId, skillId, skillData);

    res.json({
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("Update skill error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.removeSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    await userService.removeSkill(req.user.userId, skillId);

    res.json({
      message: "Skill removed successfully",
    });
  } catch (error) {
    console.error("Remove skill error:", error);
    res.status(400).json({ message: error.message });
  }
};

// ========== DOCUMENTS MANAGEMENT ==========

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { documentType } = req.body;

    const document = await userService.uploadDocument(req.user.userId, req.file, documentType);

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const result = await userService.getDocuments(req.user.userId);

    res.json(result);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.removeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    await userService.removeDocument(req.user.userId, documentId);

    res.json({
      message: "Document removed successfully",
    });
  } catch (error) {
    console.error("Remove document error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateDocumentInfo = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { name, type } = req.body;

    const document = await userService.updateDocumentInfo(req.user.userId, documentId, { name, type });

    res.json({
      message: "Document info updated successfully",
      document,
    });
  } catch (error) {
    console.error("Update document info error:", error);
    res.status(400).json({ message: error.message });
  }
};
