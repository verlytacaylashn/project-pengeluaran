import express from "express";
import cors from "cors";
import "dotenv/config";

import pengeluaranRoute from "./routes/pengeluaran.js";
import kategoriRoute from "./routes/kategori.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pengeluaran", pengeluaranRoute);
app.use("/kategori", kategoriRoute);

app.get("/", (req, res) => {
  res.send("API Pengeluaran Berjalan");
});

app.listen(process.env.PORT, () => {
  console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
});