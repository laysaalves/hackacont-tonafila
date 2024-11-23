const db = require("../config/firebase");

const createQueue = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ error: "O campo 'name' é obrigatório." });
    }

    const queuesRef = db.ref("queues");
    const newQueueRef = queuesRef.push();
    const queueData = {
      name,
      createdAt: Date.now(),
      users: {},
    };

    await newQueueRef.set(queueData);

    res.status(201).send({
      message: "Fila criada com sucesso!",
      queueId: newQueueRef.key,
    });
  } catch (error) {
    console.error("Erro ao criar a fila:", error);
    res.status(500).send({ error: "Erro ao criar a fila." });
  }
};

module.exports = { createQueue };
