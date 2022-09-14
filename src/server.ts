import express, { response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient({
  log: ["query"],
});

// List Games e Conta Anuncios Vinculados
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
app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      gameId: true,
      name: true,
      yearsPlaying: true,
      // discord: false, por false ou não trazer tem o mesmo efeito
      weekDays: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
    },

    where: {
      gameId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json([
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
      };
    }),
  ]);
});

// List Discord do Game
app.get("/ads/:id/discord", async (req, res) => {
  const adId = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return res.json({
    discord: ad.discord,
  });
});

app.listen(3333);

//GET -  Listar, Acessar
//POST - Criando Algo
//PUT - Editando Algo, varios campos
//PATCH - Editar informação especifica
//DELETE - Deletar Algo
