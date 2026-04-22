const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemCode: { type: String, required: true },
  salQty: {
    cases: { type: Number, default: 0 },
    outers: { type: Number, default: 0 },
    pcs: { type: Number, default: 0 }
  },
  dmgQty: {
    cases: { type: Number, default: 0 },
    outers: { type: Number, default: 0 },
    pcs: { type: Number, default: 0 }
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const containerSchema = new mongoose.Schema({
  containerName: {
    type: String,
    required: [true, "Container Name is required"],
    trim: true
  },
  containerNumber: {
    type: String,
    required: [true, "Container Number is required"],
    unique: true,
    trim: true
  },
  billOfLading: {
    type: String,
    required: [true, "Bill of Lading is required"],
    unique: true,
    trim: true
  },
  purchaseOrder: {
    type: String,
    required: [true, "Purchase Order number is required"],
    trim: true
  },
  invoiceNumber: {
    type: String,
    required: [true, "Invoice Number is required"],
    trim: true
  },
  receivingBranch: {
    type: String,
    required: [true, "Receiving Branch is required"],
    trim: true
  },
  region: {
    type: String,
    required: [true, "Region is required"],
    trim: true
  },

  documents: [
    {
      fileName: String,
      filePath: String,
      fileType: String,
      order: Number,
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // INTEGRATED HERE: The inventory table
  inventory: [inventorySchema]
}, {
  timestamps: true
});

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;