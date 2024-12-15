import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();
import configRoutes from "./routes/index.js";

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const s3Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: 'AKIATTSKFO4EXBR56V4X', 
    secretAccessKey: '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'
  }
});

// Credit: AWS Setup Manual
app.get('/generate-presigned-url', async (req, res) => {
  console.log("generating link")
  const command = new PutObjectCommand({
    Bucket: "devx2024",
    Key: req.query.filename,
    ContentType: "image/jpeg",
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log(signedUrl)
    res.send({ signedUrl })
  } catch (error) {
    console.error("Error generating pre-signed URL", error);
  }

});

app.use(express.json());

app.get('/generate-presigned-url', (req, res) => {
  const params = {
    Bucket: 'devx2024',
    Key: `${updatedData.email}`, 
    Expires: 60,
    ContentType: req.query.filetype, 
    ACL: 'public-read', 
  };
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've got an express server");
  console.log("Your routes will be running on http://localhost:3000\n");
});
