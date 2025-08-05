const express = require('express')
const songRoutes = require("./routes/song.routes")
const cors = require('cors')

const allowedOrigins = [
  "https://moody-player-topaz.vercel.app",
  "http://localhost:5173",
];


const app = express()
app.use(express.json())
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use('/',songRoutes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
  

module.exports = app