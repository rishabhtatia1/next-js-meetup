import { connectDatabase, insertDocument } from "../../helpers/db-utils";
import { validateEmail } from "../../helpers/validation";

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;
    if (!userEmail || !validateEmail(userEmail)) {
      res.status(422).send({ message: "Invalid email AddressIcon." });
      return;
    }
    let client;
    try {
      client = await connectDatabase();
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Connecting to database failed." });
      return;
    }
    try {
      await insertDocument(client, "newsletter", { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).send({ message: "Inserting data failed." });
      return;
    }
    res.status(201).send({ message: "Signed Up!" });
  }
}

export default handler;
