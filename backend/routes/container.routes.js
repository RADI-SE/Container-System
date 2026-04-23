const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.js');
const upload = require('../middleware/uploadMiddleware');

const { createContainer, getContainers, getContainerById, shareContainer,updateContainer,deleteContainer,addInventoryItem,deleteInventoryItem,updateInventoryItem , UnshareContainer,getAvailableContainersForUser,getUserContainers } = require('../controllers/container.controller.js');

router.post(
  '/', 
  verifyToken, 
  upload.array('documents', 3), 
  createContainer
);
router.get("/",verifyToken, getContainers);
router.post('/share',verifyToken,shareContainer)
router.put('/unshare',verifyToken,UnshareContainer)
router.get("/available/:userId", verifyToken, getAvailableContainersForUser);
 

router.put("/:id", verifyToken,
  upload.array('documents', 3),
   updateContainer);
   


router.get("/user/:userId",verifyToken, getUserContainers);   
router.get("/:id", verifyToken, getContainerById);
router.delete("/:id", verifyToken, deleteContainer);


router.post('/:containerId/inventory',verifyToken, addInventoryItem) 
router.put("/:containerId/inventory/:itemId", verifyToken, updateInventoryItem);
router.delete("/:containerId/inventory/:itemId", verifyToken, deleteInventoryItem);


module.exports = router;