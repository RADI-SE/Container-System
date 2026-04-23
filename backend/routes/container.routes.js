const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.js');
const upload = require('../middleware/uploadMiddleware');

const { createContainer, getContainers, getContainerById, shareContainer,updateContainer,deleteContainer,addInventoryItem,deleteInventoryItem,updateInventoryItem , UnshareContainer,getAvailableContainersForUser,getUserContainers,getUserInventoryTableData } = require('../controllers/container.controller.js');

router.post(
  '/', 
  verifyToken, 
  upload.fields([
    { name: 'bol', maxCount: 1 },
    { name: 'invoice', maxCount: 1 },
    { name: 'po', maxCount: 1 }
  ]),
  createContainer
);
router.get("/",verifyToken, getContainers);
router.post('/share',verifyToken,shareContainer)
router.put('/unshare',verifyToken,UnshareContainer)
router.get("/available/:userId", verifyToken, getAvailableContainersForUser);
 

router.put("/:id", verifyToken,
  upload.fields([
    { name: 'bol', maxCount: 1 },
    { name: 'invoice', maxCount: 1 },
    { name: 'po', maxCount: 1 }
  ]),
   updateContainer);
   


router.get("/user/:userId",verifyToken, getUserContainers);   
router.get("/inventory/:userId",verifyToken, getUserInventoryTableData);
router.get("/:id", verifyToken, getContainerById);
router.delete("/:id", verifyToken, deleteContainer);


router.post('/:containerId/inventory',verifyToken, addInventoryItem) 
router.put("/:containerId/inventory/:itemId", verifyToken, updateInventoryItem);
router.delete("/:containerId/inventory/:itemId", verifyToken, deleteInventoryItem);


module.exports = router;