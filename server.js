const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PORT } = require("./config");
const { NotFoundError } = require("./utils/errors");
const security = require("./middleware/security");
const authRoutes = require("./routes/auth");
const maintabsRoutes = require("./routes/mainTabs");
const subtabsRoutes = require("./routes/subtabs");
const tasksRoutes = require("./routes/tasks");
// const notesRoutes = require("./routes/notes");
const calendarsRoutes = require("./routes/calendars");

const app = express();


app.use(cors());
// parse incoming requests with JSON payloads
app.use(express.json());
// log requests info
app.use(morgan("tiny"));

app.use(security.extractUserFromJwt);

app.use("/auth", authRoutes);
app.use("/maintabs", maintabsRoutes);
app.use("/subtabs", subtabsRoutes);
app.use("/tasks", tasksRoutes);
// app.use("/notes", notesRoutes);
app.use("/calendar", calendarsRoutes);


/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
  return next(new NotFoundError())
})

/** Generic error handler; anything unhandled goes here. */
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message

  return res.status(status).json({
    error: { message, status },
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
