const express = require("express");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/referrals", async (req, res) => {
  const { referrerName, refereeName, refereeEmail } = req.body;

  // Validate input
  if (!referrerName || !refereeName || !refereeEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save referral to the database
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        refereeName,
        refereeEmail,
      },
    });

    // Send referral email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rudradas16996@gmail.com",
        pass: "sxiwzwxagxpwxwmy",
      },
    });

    const mailOptions = {
      from: "rudradas16996@gmail.com",
      to: refereeEmail,
      subject: "Course Referral",
      text: `Hi ${refereeName},\n\n${referrerName} has referred you to a course. Check it out!\n\nBest regards,\nAccredian`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ sent: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sent: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
