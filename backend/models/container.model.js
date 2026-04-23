const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: [true, "Item code is required"],
    trim: true,
    uppercase: true, 
    match: [/^[A-Z0-9-]+$/, "Item code can only contain letters, numbers, and hyphens"]
  },
  salQty: {
    cases: { type: Number, default: 0, min: [0, "Cases cannot be negative"] },
    outers: { type: Number, default: 0, min: [0, "Outers cannot be negative"] },
    pcs: { type: Number, default: 0, min: [0, "Pieces cannot be negative"] }
  },
  dmgQty: {
    cases: { type: Number, default: 0, min: [0, "Damaged cases cannot be negative"] },
    outers: { type: Number, default: 0, min: [0, "Damaged outers cannot be negative"] },
    pcs: { type: Number, default: 0, min: [0, "Damaged pieces cannot be negative"] }
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});


inventorySchema.pre('validate', function(next) {
  const totalQty = 
    this.salQty.cases + this.salQty.outers + this.salQty.pcs +
    this.dmgQty.cases + this.dmgQty.outers + this.dmgQty.pcs;

  if (totalQty <= 0) {
    this.invalidate('salQty.cases', 'You must provide at least one quantity (SAL or DMG)');
  }
  next();
});

inventorySchema.virtual('totalSalPcs').get(function() {
   return (this.salQty.cases || 0) + (this.salQty.outers || 0) + (this.salQty.pcs || 0);
});

 inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });
const containerSchema = new mongoose.Schema({
  containerName: {
    type: String,
    required: [true, "Container Name is required"],
    trim: true,
    minlength: [2, "Container name must be at least 2 characters"]
  },
  containerNumber: {
    type: String,
    required: [true, "Container Number is required"],
    unique: true,
    trim: true,
    uppercase: true
  },
  billOfLading: {
    type: String,
    required: [true, "Bill of Lading is required"],
    unique: true,
    trim: true
  },
  purchaseOrder: {
    type: String,
    required: [true, "Purchase Order is required"],
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

  inventory: [inventorySchema]
}, {
  timestamps: true
});

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;

