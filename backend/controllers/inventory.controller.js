const console = require("console");
const Container = require("../models/container.model.js");
const fs = require('fs');


const requiredContainerFields = [
  { key: "itemCode", label: "Item Code", type: "string" },
  { key: "salCases", label: "Sales Cases", type: "number" },
  { key: "salOuters", label: "Sales Outers", type: "number" },
  { key: "salPcs", label: "Sales Pieces", type: "number" },
  { key: "dmgCases", label: "Damaged Cases", type: "number" },
  { key: "dmgOuters", label: "Damaged Outers", type: "number" },
  { key: "dmgPcs", label: "Damaged Pieces", type: "number" }
];

const validateRequiredFields = (body) => {
  for (const field of requiredContainerFields) {
    const value = body[field.key];
    if (value === undefined || value === null || value === "") {
      return `${field.label} is required`;
    }

    if (field.type === "number") {
      if (typeof value !== "number" || isNaN(value)) {
        return `${field.label} must be a number`;
      }

      if (value < 0) {
        return `${field.label} must be a positive number`;
      }
    }

    if (field.type === "string") {
      if (typeof value !== "string" || !value.trim()) {
        return `${field.label} must be a valid string`;
      }
    }
  }
  return null;
};

const numericFields = [
  "salCases",
  "salOuters",
  "salPcs",
  "dmgCases",
  "dmgOuters",
  "dmgPcs"
];

const sanitizeNumbers = (body) => {
  console.log("Before sanitization:", body);
  numericFields.forEach((field) => {
    if (body[field] !== undefined) {
      const num = Number(body[field]);
      body[field] = isNaN(num) ? body[field] : num;
    }
  });
};

const addInventoryItem = async (req, res) => {
  const { containerId } = req.params;

  try {
    const container = await Container.findById(containerId);
    if (!container) {
      return res.status(404).json({ success: false, message: "Container not found" });
    }

    sanitizeNumbers(req.body);

    const missingFieldMessage = validateRequiredFields(req.body);
    if (missingFieldMessage) {
      return res.status(400).json({
        success: false,
        message: missingFieldMessage
      });
    }

    const { itemCode, salCases, salOuters, salPcs, dmgCases, dmgOuters, dmgPcs } = req.body;

    const isOwner = container.owner.toString() === req.userId;
    const isAllowed = container.allowedUsers.some(
      (user) => user.toString() === req.userId
    );

    if (!isOwner && !isAllowed) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not have permission to add items to this container"
      });
    }

    const newItem = {
      itemCode,
      salQty: {
        cases: salCases,
        outers: salOuters,
        pcs: salPcs
      },
      dmgQty: {
        cases: dmgCases,
        outers: dmgOuters,
        pcs: dmgPcs
      },
      addedBy: req.userId
    };

    container.inventory.push(newItem);
    await container.save();

    res.status(201).json({
      success: true,
      message: "Item added to manifest successfully",
      data: container.inventory[container.inventory.length - 1]
    });

  } catch (error) {
    console.error("Add Inventory Error:", error);
    res.status(500).json({ success: false, message: "Server error while adding item" });
  }
};

const updateInventoryItem = async (req, res) => {
  const { containerId, itemId } = req.params;
  const { itemCode, salCases, salOuters, salPcs, dmgCases, dmgOuters, dmgPcs } = req.body;

  try {
    const container = await Container.findById(containerId);
    if (!container) return res.status(404).json({ message: "Container not found" });

    const isOwner = container.owner.toString() === req.userId;
    const isAllowed = container.allowedUsers.some(id => id.toString() === req.userId);

    if (!isOwner && !isAllowed) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    sanitizeNumbers(req.body);
    
    const missingFieldMessage = validateRequiredFields(req.body);
    if (missingFieldMessage) {
      console.log("sanitizeNumbers:", missingFieldMessage);
      return res.status(400).json({
        success: false,
        message: missingFieldMessage
      });
    }

    const updatedContainer = await Container.findOneAndUpdate(
      { _id: containerId, "inventory._id": itemId },
      {
        $set: {
          "inventory.$.itemCode": itemCode,
          "inventory.$.salQty": {
            cases: Number(salCases) || 0,
            outers: Number(salOuters) || 0,
            pcs: Number(salPcs) || 0
          },
          "inventory.$.dmgQty": {
            cases: Number(dmgCases) || 0,
            outers: Number(dmgOuters) || 0,
            pcs: Number(dmgPcs) || 0
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedContainer) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedContainer.inventory
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteInventoryItem = async (req, res) => {
  const { containerId, itemId } = req.params;

  try {
    const container = await Container.findByIdAndUpdate(
      containerId,
      { $pull: { inventory: { _id: itemId } } },
      { new: true }
    );

    if (!container) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ success: true, message: "Row removed from table" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserContainers = async (req, res) => {
  try {
    const { userId } = req.params;

    const containers = await Container.find({
      $or: [
        { owner: userId },
        { allowedUsers: userId }
      ]
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    console.log(`Found ${containers.length} containers for userId ${userId}`);

    res.status(200).json({
      success: true,
      count: containers.length,
      data: containers
    });
    console.log("Response sent for getUserContainers");
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch available containers"
    });
  }
};

const getUserInventoryTableData = async (req, res) => {
  try {
    const { userId } = req.params;

    const containers = await Container.find({
      $or: [{ owner: userId }, { allowedUsers: userId }]
    })
      .populate("owner", "name email")
      .populate("inventory.addedBy", "name email")
      .sort({ createdAt: -1 });

    const containersWithInventory = containers.filter(
      (c) => c.inventory && c.inventory.length > 0
    );

    const tableData = containersWithInventory.flatMap((container) =>
      container.inventory.map((item) => ({

        containerId: container._id,
        containerNumber: container.containerNumber,
        ownerName: container.owner?.name || "—",

        itemId: item._id,
        itemCode: item.itemCode,
        salQty: item.salQty,
        dmgQty: item.dmgQty,
        addedBy: item.addedBy?.name || "—",
        createdAt: item.createdAt,
      }))
    );

    console.log(`Found ${tableData.length} inventory rows for user ${userId}`);

    res.status(200).json({
      success: true,
      count: tableData.length,
      data: tableData,
    });
  } catch (error) {
    console.error("getUserInventoryTableData error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory table data",
    });
  }
};

module.exports = {
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getUserContainers,
  getUserInventoryTableData

};