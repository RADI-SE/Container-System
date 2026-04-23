const console = require("console");
const Container = require("../models/container.model.js");
const fs = require('fs');

const createContainer = async (req, res) => {
  const {
    containerName,
    containerNumber,
    billOfLading,
    purchaseOrder,
    invoiceNumber,
    receivingBranch,
    region
  } = req.body;

  try {
    const requiredFields = [
      "containerName",
      "containerNumber",
      "billOfLading",
      "purchaseOrder",
      "invoiceNumber",
      "receivingBranch",
      "region"
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    const existingContainer = await Container.findOne({
      $or: [
        { containerNumber },
        { billOfLading }
      ]
    });

    if (existingContainer) {
      return res.status(400).json({
        success: false,
        message: "Container Number or Bill of Lading already exists"
      });
    }

    const files = req.files || {};

    const documents = [null, null, null];

    if (files.bol?.[0]) {
      documents[0] = {
        fileName: files.bol[0].originalname,
        filePath: files.bol[0].path,
        fileType: files.bol[0].mimetype,
        uploadedAt: Date.now()
      };
    }

    if (files.invoice?.[0]) {
      documents[1] = {
        fileName: files.invoice[0].originalname,
        filePath: files.invoice[0].path,
        fileType: files.invoice[0].mimetype,
        uploadedAt: Date.now()
      };
    }

    if (files.po?.[0]) {
      documents[2] = {
        fileName: files.po[0].originalname,
        filePath: files.po[0].path,
        fileType: files.po[0].mimetype,
        uploadedAt: Date.now()
      };
    }

    const newContainer = new Container({
      containerName,
      containerNumber,
      billOfLading,
      purchaseOrder,
      invoiceNumber,
      receivingBranch,
      region,
      owner: req.userId,
      documents
    });

    const savedContainer = await newContainer.save();

    res.status(201).json({
      success: true,
      message: "Container created successfully",
      data: savedContainer
    });

  } catch (error) {
    console.error("Error creating container:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: messages,
        errors: error.errors
      });
    }

    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateKey} already exists`,
        errors: error.keyValue
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating container"
    });
  }
};

const getContainers = async (req, res) => {
  try {
    const containers = await Container.find({
      $or: [
        { owner: req.userId },
        { allowedUsers: req.userId }
      ]
    })
      .populate("owner", "name email")
      .populate("allowedUsers", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: containers.length, data: containers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching containers" });
  }
};

const getContainerById = async (req, res) => {
  const { id } = req.params;

  try {
    const container = await Container.findById(id)
      .populate("owner", "name email")
      .populate("allowedUsers", "name email");

    if (!container) {
      return res.status(404).json({
        success: false,
        message: "Container not found"
      });
    }

    const isOwner = container.owner?._id?.toString() === req.userId;
    const isAllowed = container.allowedUsers?.some(
      (user) => user?._id?.toString() === req.userId
    );

    if (!isOwner && !isAllowed) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    return res.status(200).json({
      success: true,
      data: container
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching container"
    });
  }
};

const shareContainer = async (req, res) => {
  const { containerId, userIdToAllow } = req.body;

  console.log("containerId ,containerId", containerId, userIdToAllow)

  try {
    const container = await Container.findById(containerId);
    if (!container) return res.status(404).json({ message: "Container not found" });

    const ownerId = container.owner.toString();
    console.log("ownerId", ownerId)
    const currentUserId = req.userId;
    console.log("currentUserId", currentUserId)

    if (ownerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this container"
      });
    }
    container.allowedUsers.addToSet(userIdToAllow);
    await container.save();

    res.status(200).json({ success: true, message: "Access shared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const UnshareContainer = async (req, res) => {
  try {
    const { containerId, userIdToRemove } = req.body;

    if (!containerId || !userIdToRemove) {
      return res.status(400).json({
        success: false,
        message: "containerId and userIdToRemove are required",
      });
    }

    const container = await Container.findById(containerId);

    if (!container) {
      return res.status(404).json({
        success: false,
        message: "Container not found",
      });
    }

    if (container.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    container.allowedUsers.pull(userIdToRemove);
    await container.save();

    res.status(200).json({
      success: true,
      message: "User access removed",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error removing access",
    });
  }
};

const getAvailableContainersForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching available containers for userId:", userId);
    const containers = await Container.find({
      $or: [
        { allowedUsers: { $ne: userId } },
        { allowedUsers: { $exists: false } },
        { allowedUsers: { $size: 0 } }
      ]
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
 
    res.status(200).json({
      success: true,
      count: containers.length,
      data: containers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch available containers"
    });
  }
};

const updateContainer = async (req, res) => {
  const { id } = req.params;

  try {
    const container = await Container.findById(id);
    if (!container)
      return res.status(404).json({ message: "Container not found" });

    if (container.owner.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    const updateData = { ...req.body };

    const uploadedFiles = req.files || {};

    const existingDocs = container.documents || [];
    const documents = [...existingDocs];
    while (documents.length < 3) documents.push(null);

    const replaceDoc = (index, file) => {
      if (documents[index]?.filePath && fs.existsSync(documents[index].filePath)) {
        fs.unlinkSync(documents[index].filePath);
      }

      documents[index] = {
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        uploadedAt: Date.now(),
      };
    };

    const replaceBol = req.body.replaceBol === "true";
    const replaceInvoice = req.body.replaceInvoice === "true";
    const replacePo = req.body.replacePo === "true";

    if (replaceBol && uploadedFiles.bol?.[0]) {
      replaceDoc(0, uploadedFiles.bol[0]);
    }

    if (replaceInvoice && uploadedFiles.invoice?.[0]) {
      replaceDoc(1, uploadedFiles.invoice[0]);
    }

    if (replacePo && uploadedFiles.po?.[0]) {
      replaceDoc(2, uploadedFiles.po[0]);
    }

    delete updateData.replaceBol;
    delete updateData.replaceInvoice;
    delete updateData.replacePo;

    if (replaceBol || replaceInvoice || replacePo) {
      updateData.documents = documents;
    }

    const updatedContainer = await Container.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedContainer,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteContainer = async (req, res) => {
  const { id } = req.params;

  try {
    const container = await Container.findById(id);
    if (!container) return res.status(404).json({ message: "Container not found" });

    if (container.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized: Only the owner can delete this" });
    }

    await Container.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Container deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting container" });
  }
};



const addInventoryItem = async (req, res) => {
  const { containerId } = req.params;
  const { itemCode, salCases, salOuters, salPcs, dmgCases, dmgOuters, dmgPcs } = req.body

  try {
    const container = await Container.findById(containerId);
    if (!container) {
      return res.status(404).json({ success: false, message: "Container not found" });
    }

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
        cases: Number(salCases) || 0,
        outers: Number(salOuters) || 0,
        pcs: Number(salPcs) || 0
      },
      dmgQty: {
        cases: Number(dmgCases) || 0,
        outers: Number(dmgOuters) || 0,
        pcs: Number(dmgPcs) || 0
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

  console.log(`Updating inventory item with data:`, { containerId, itemId, itemCode, salCases, salOuters, salPcs, dmgCases, dmgOuters, dmgPcs });
  try {
    const container = await Container.findOneAndUpdate(
      {
        _id: containerId,
        "inventory._id": itemId
      },
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
          },
          "inventory.$.updatedAt": Date.now()
        }
      },
      { new: true, runValidators: true }
    );

    if (!container) {
      return res.status(404).json({ success: false, message: "Container or Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Inventory row updated successfully",
      data: container.inventory
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating inventory row" });
  }
};

const deleteInventoryItem = async (req, res) => {
  const { containerId, itemId } = req.params; // containerId = container, itemId = the row

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
        addedBy: item.addedBy,
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
  createContainer,
  getContainers,
  getContainerById,
  shareContainer,
  UnshareContainer,
  getAvailableContainersForUser,
  updateContainer,
  deleteContainer,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getUserContainers,
  getUserInventoryTableData
  
};