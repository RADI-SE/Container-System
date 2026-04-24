const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.js');
const upload = require('../middleware/uploadMiddleware');

const {addInventoryItem, deleteInventoryItem, updateInventoryItem, getUserInventoryTableData } = require('../controllers/inventory.controller.js');

router.post('/:containerId', verifyToken, addInventoryItem)
router.get("/inventory/:userId", verifyToken, getUserInventoryTableData);
 
router.put("/:containerId/inventory/:itemId", verifyToken, updateInventoryItem);
router.delete("/:containerId/inventory/:itemId", verifyToken, deleteInventoryItem);


module.exports = router;