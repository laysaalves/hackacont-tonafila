const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const queueRoutes = require("./routes/queueRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/queue", queueRoutes);
app.use("/queues", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando! 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
