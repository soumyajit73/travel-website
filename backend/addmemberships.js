const mongoose = require("mongoose");
const Membership = require("./models/membership"); // Adjust the path as needed

mongoose.connect(
  "mongodb+srv://soumyajitdatta1234:AX49Q0TjYxXJ1O1J@cluster0.dnzvkff.mongodb.net/yourdbname?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const memberships = [
  { name: "Free", price: 0, benefits: "Basic benefits" },
  { name: "Star", price: 30, benefits: "Star benefits" },
  { name: "Premium", price: 50, benefits: "Premium benefits" },
];

const addMemberships = async () => {
  try {
    await Membership.insertMany(memberships);
    console.log("Memberships added");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

addMemberships();
