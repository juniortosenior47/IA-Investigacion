import path from "path";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // permitir solo tu frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Servir favicon (opcional)
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // sin icono, evita error
});

// API REST
// Endpoint GET para pruebas desde navegador
app.get("/api/translate", (req, res) => {
  const { text, from, to } = req.query;
  res.json({ translated: `[${from}->${to}] ${text}` });
});

// Endpoint GET para pruebas desde postman
app.post("/api/translate", (req, res) => {
  const { text, from, to } = req.body;
  res.json({ translated: `[${from}->${to}] ${text}` });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
