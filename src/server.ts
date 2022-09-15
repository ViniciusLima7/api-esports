import express from "express";
import { PrismaClient } from "@prisma/client";
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinutesStringToHours } from "./utils/convert-minutes-string-to-hours";

const app = express();
app.use(express.json());

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
app.post("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const body = req.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(`,`),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  return res.status(201).json(ad);
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
        hourStart: convertMinutesStringToHours(ad.hourStart),
        hourEnd: convertMinutesStringToHours(ad.hourEnd),
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
