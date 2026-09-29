import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET semua kategori
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM kategori"
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ringkasan kategori
router.get("/ringkasan", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        k.nama AS kategori,
        COUNT(p.id) AS jumlah_transaksi,
        COALESCE(SUM(p.nominal),0) AS total
      FROM kategori k
      LEFT JOIN pengeluaran p
      ON p.id_kategori = k.id
      GROUP BY k.id, k.nama
      ORDER BY total DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;