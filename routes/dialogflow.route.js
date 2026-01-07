import express from "express";
import { WebhookClient } from "dialogflow-fulfillment";
import Novel from "../models/Novel.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  async function hoiTruyenTheoTheLoai(agent) {
    const theLoai = agent.parameters.theLoai;

    if (!theLoai) {
      agent.add("Bạn muốn tìm truyện thuộc thể loại nào?");
      return;
    }

    const novel = await Novel.findOne({
      genre: { $regex: theLoai, $options: "i" }
    });

    if (!novel) {
      agent.add(`Hiện chưa có truyện thuộc thể loại ${theLoai}.`);
      return;
    }

    const link = `https://goalless-unoceanic-clarissa.ngrok-free.dev/novel/${novel._id}`;

    agent.add(
      `Có nhé  
      Truyện **${novel.title}** (${novel.genre}) của ${novel.authorName}:  
      ${link}`
    );
  }

  let intentMap = new Map();
  intentMap.set("HoiTruyenTheoTheLoai", hoiTruyenTheoTheLoai);

  agent.handleRequest(intentMap);
});

export default router;
