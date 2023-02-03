import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

// create server
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "This is open ai server running on.",
  });
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "",
      temperature: 0,
      max_tokens: 1256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log("Passed", req.body.input);
    res.status(200).send({
      message: "Success",
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log("Failed", req.body.input);
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
