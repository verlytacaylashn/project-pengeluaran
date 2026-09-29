import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

//
// GET semua data pengeluaran
//
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.judul,
        p.nominal,
        p.tanggal,
        p.catatan,
        k.nama AS kategori
      FROM pengeluaran p
      LEFT JOIN kategori k
      ON p.id_kategori = k.id
      ORDER BY p.tanggal DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// GET berdasarkan nama/judul
// Contoh:
// GET /pengeluaran/Kopi
// GET /pengeluaran/Verlyta
//
router.get("/:judul", async (req, res) => {
  try {
    const { judul } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.judul,
        p.nominal,
        p.tanggal,
        p.catatan,
        k.nama AS kategori
      FROM pengeluaran p
      LEFT JOIN kategori k
      ON p.id_kategori = k.id
      WHERE p.judul LIKE ?
      `,
      [`%${judul}%`]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// POST
//
router.post("/", async (req, res) => {
  try {
    const { judul, nominal, tanggal, catatan, id_kategori } = req.body;

    const [hasil] = await pool.query(
      `
      INSERT INTO pengeluaran
      (judul, nominal, tanggal, catatan, id_kategori)
      VALUES (?, ?, ?, ?, ?)
      `,
      [judul, nominal, tanggal, catatan, id_kategori]
    );

    res.json({
      message: "Data berhasil ditambahkan",
      id: hasil.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// PUT
// Contoh:
// PUT /pengeluaran/7
//
router.put("/:id", async (req, res) => {
  try {
    const { judul, nominal, tanggal, catatan, id_kategori } = req.body;

    await pool.query(
      `
      UPDATE pengeluaran
      SET
        judul = ?,
        nominal = ?,
        tanggal = ?,
        catatan = ?,
        id_kategori = ?
      WHERE id = ?
      `,
      [
        judul,
        nominal,
        tanggal,
        catatan,
        id_kategori,
        req.params.id
      ]
    );

    res.json({
      message: "Data berhasil diubah"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// DELETE
// Contoh:
// DELETE /pengeluaran/7
//
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM pengeluaran WHERE id = ?",
      [req.params.id]
    );

    res.json({
      message: "Data berhasil dihapus"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;