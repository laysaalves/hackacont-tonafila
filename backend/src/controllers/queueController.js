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

const listQueues = async (req, res) => {
  try {
    const queueRef = db.ref("queues");
    queueRef.once("value", (snapshot) => {
      const queues = snapshot.val();

      if (!queues) {
        return res.status(200).send([]);
      }

      const queueList = Object.entries(queues).map(([key, queue]) => ({
        id: key,
        ...queue,
      }));

      res.status(200).send(queueList);
    });
  } catch (error) {
    console.error("Erro ao listar as filas:", error);
    res.status(500).send({ error: "Erro ao listar as filas." });
  }
};

const deleteQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    if (!queueId) {
      return res.status(400).send({ error: "O ID da fila é obrigatório." });
    }

    const queueRef = db.ref(`queues/${queueId}`);
    const snapshot = await queueRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Fila não encontrada." });
    }

    await queueRef.remove();
    res.status(200).send({ message: "Fila deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar a fila:", error);
    res.status(500).send({ error: "Erro ao deletar a fila." });
  }
};

const getQueueDetails = async (req, res) => {
  try {
    const { queueId } = req.params;

    if (!queueId) {
      return res.status(400).send({ error: "O ID da fila é obrigatório." });
    }

    const queueRef = db.ref(`queues/${queueId}`);
    const snapshot = await queueRef.once("value");
    const queueData = snapshot.val();

    if (!queueData) {
      return res.status(404).send({ error: "Fila não encontrada." });
    }

    const users = queueData.users || {};
    const usersList = Object.entries(users)
      .map(([key, user]) => ({ ...user, key }))
      .sort((a, b) => a.joinedAt - b.joinedAt);

    res.status(200).send({
      queueId,
      userCount: usersList.length,
      users: usersList,
    });
  } catch (error) {
    console.error("Erro ao obter detalhes da fila:", error);
    res.status(500).send({ error: "Erro ao obter detalhes da fila." });
  }
};

module.exports = { createQueue, listQueues, deleteQueue, getQueueDetails };
