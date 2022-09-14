import express, { response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient({
  log: ["query"],
});

// List Games
app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return res.json(games);
});

// Create Ads
app.post("/ads", (req, res) => {
  return res.status(201).json([]);
});

// List Ads do Game
app.get("/games/:id/ads", (req, res) => {
  return res.json([
    { id: 1, name: "Anuncio 1" },
    { id: 2, name: "Anuncio 2" },
    { id: 3, name: "Anuncio 3" },
    { id: 4, name: "Anuncio 4" },
    { id: 5, name: "Anuncio 5" },
  ]);
});

// List Discord do Game
app.get("/ads/:id/discord", (req, res) => {
  return res.json([]);
});

app.listen(3333);

//GET -  Listar, Acessar
//POST - Criando Algo
//PUT - Editando Algo, varios campos
//PATCH - Editar informação especifica
//DELETE - Deletar Algo
