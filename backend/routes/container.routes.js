const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.js');
const upload = require('../middleware/uploadMiddleware');

const { createContainer, getContainers, shareContainer,updateContainer,deleteContainer,addInventoryItem,deleteInventoryItem,updateInventoryItem , UnshareContainer,getAvailableContainersForUser,getUserContainers } = require('../controllers/container.controller.js');

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
router.delete("/:id", verifyToken, deleteContainer);
router.post('/:id/inventory',verifyToken, addInventoryItem) 
router.put("/:id/inventory/:itemId", verifyToken, updateInventoryItem);
router.delete("/:id/inventory/:itemId", verifyToken, deleteInventoryItem);


module.exports = router;