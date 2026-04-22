const mongoose = require("mongoose");
const Container = require("../backend/models/container.model"); // adjust path

const data = [
  {
    containerName: "Container A",
    containerNumber: "C-1001",
    billOfLading: "BL-1001",
    purchaseOrder: "PO-1001",
    invoiceNumber: "INV-1001",
    receivingBranch: "Jeddah Branch",
    region: "Northern",
    owner: "69e783282ff4de5664ca6fb4",
    allowedUsers: ["69e763a72ff4de5664ca6fae"]
  },
  {
    containerName: "Container B",
    containerNumber: "C-1002",
    billOfLading: "BL-1002",
    purchaseOrder: "PO-1002",
    invoiceNumber: "INV-1002",
    receivingBranch: "Jeddah Branch",
    region: "Northern",
    owner: "69e783282ff4de5664ca6fb4",
    allowedUsers: ["69e763a72ff4de5664ca6fae"]
  }
];
async function seed() {
  try {

    await mongoose.connect("mongodb://user873:27558@cluster0-shard-00-00.rccyh.mongodb.net:27017,cluster0-shard-00-01.rccyh.mongodb.net:27017,cluster0-shard-00-02.rccyh.mongodb.net:27017/container_system?ssl=true&authSource=admin&retryWrites=true&w=majority");
    const result = await Container.insertMany(data);

    console.log("✅ Inserted:", result.length, "containers");

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seed();