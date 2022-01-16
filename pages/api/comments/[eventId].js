import {
  connectDatabase,
  getAllDocuments,
  insertDocument
} from "../../../helpers/db-utils";
import { validateEmail } from "../../../helpers/validation";

async function handler(req, res) {
  const eventId = req.query.eventId;
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).send({ message: "Connecting to database failed." });
    return;
  }
  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(
        client,
        "comments",
        { _id: -1 },
        { eventId }
      );
      res.status(200).send({ comments: documents });
    } catch (error) {
      res.status(500).send({ message: "Unable to fetch comments." });
    }
  }
  if (req.method === "POST") {
    const { email, name, text } = req.body;
    if (
      !email ||
      email.trim() === "" ||
      !validateEmail(email) ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).send({ message: "Incorrect Input." });
      client.close();
      return;
    }
    const newComment = {
      email,
      name,
      text,
      eventId
    };
    let result;
    try {
      result = await insertDocument(client, "comments", newComment);
      newComment._id = result.insertedId;
      res.status(201).send({ message: "Added Comment", comment: newComment });
    } catch (error) {
      res.status(500).send({ message: "Inserting comment failed." });
    }
  }
  client.close();
}

export default handler;
