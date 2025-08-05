const express = require("express");
const songRoutes = require("./routes/song.routes");
const cors = require("cors");

const allowedOrigins = [
  "https://moody-player-topaz.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const app = express();
app.use(express.json());

app.use("/", songRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
