const db = require("../config/firebase");

const addUserToQueue = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { uid, name, joinedAt } = req.body;

    if (!queueId || !uid || !name) {
      return res
        .status(400)
        .send({ error: "Fila e dados do usuário são obrigatórios." });
    }

    const usersRef = db.ref(`queues/${queueId}/users`);
    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    if (users) {
      const userExists = Object.values(users).some((user) => user.uid === uid);
      if (userExists) {
        const usersList = Object.entries(users)
          .map(([key, user]) => ({ ...user, key }))
          .sort((a, b) => a.joinedAt - b.joinedAt);
        const position = usersList.findIndex((user) => user.uid === uid) + 1;
        return res.status(200).send({
          message: "Usuário já está na fila.",
          position,
        });
      }
    }

    // Adiciona o usuário à fila
    const newUserRef = usersRef.push();
    await newUserRef.set({
      uid,
      name,
      joinedAt: joinedAt || Date.now(),
    });

    // Obtém a posição atualizada
    const updatedSnapshot = await usersRef.once("value");
    const updatedUsers = updatedSnapshot.val();
    const usersList = Object.entries(updatedUsers)
      .map(([key, user]) => ({ ...user, key }))
      .sort((a, b) => a.joinedAt - b.joinedAt);
    const position = usersList.findIndex((user) => user.uid === uid) + 1;

    res.status(201).send({
      message: "Usuário adicionado à fila!",
      position,
    });
  } catch (error) {
    console.error("Erro ao adicionar usuário à fila:", error);
    res.status(500).send({ error: "Erro ao adicionar usuário à fila." });
  }
};

const removeUserFromQueue = async (req, res) => {
  try {
    const { queueId, uid } = req.params;

    if (!queueId || !uid) {
      return res
        .status(400)
        .send({ error: "ID da fila e UID do usuário são obrigatórios." });
    }

    const usersRef = db.ref(`queues/${queueId}/users`);
    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    if (!users) {
      return res.status(404).send({ error: "A fila está vazia." });
    }

    const userKey = Object.keys(users).find((key) => users[key].uid === uid);
    if (!userKey) {
      return res.status(404).send({ error: "Usuário não encontrado na fila." });
    }

    await usersRef.child(userKey).remove();
    res.status(200).send({ message: "Usuário removido da fila." });
  } catch (error) {
    console.error("Erro ao remover usuário da fila:", error);
    res.status(500).send({ error: "Erro ao remover usuário da fila." });
  }
};

module.exports = {
  addUserToQueue,
  removeUserFromQueue,
};
