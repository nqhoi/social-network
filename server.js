require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketServer = require("./SocketServer")
const { ExpressPeerServer } = require("peer")
const path = require("path");


// Routes
const authRouter = require("./src/routes/authRouter");
const userRouter = require("./src/routes/userRouter");
const postRouter = require("./src/routes/postRouter");
const commentRouter = require("./src/routes/commentRouter");
const notifyRouter = require("./src/routes/notifyRouter");
const messageRouter = require("./src/routes/messageRouter");
const { appendFileSync } = require("fs");

//
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// create perer server
ExpressPeerServer(http, { path: "/"})

io.on("connection", (socket) => {
  SocketServer(socket);
});



// ! ================== Connect mongodb with mongoose ================== //
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);

// ! ================== Routes - Api ================== //
app.use("/api/", authRouter);

app.use("/api/", userRouter);

app.use("/api/", postRouter);

app.use("/api/", commentRouter);

app.use("/api/", notifyRouter);

app.use("/api/", messageRouter);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('front-end/build'))
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log("Server is running on port", port);
});
