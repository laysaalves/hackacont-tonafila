const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKeys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tonafila-64a15-default-rtdb.firebaseio.com",
});

const db = admin.database();
module.exports = db;
