const createServer = require("node:http").createServer;
const next = require("next");
const Server = require("socket.io").Server;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("requestNewColor", async () => {
      // Dynamically import node-fetch
      const fetch = (await import("node-fetch")).default;

      try {
        const response = await fetch("http://localhost:3000/api/hello");
        const data = await response.json();
        const newColor = data.color;
        io.emit("newColor", { color: newColor }); // 广播新颜色
      } catch (error) {
        console.error("Error fetching color:", error);
      }
    });
    // 接收來自某個客戶端的顏色並廣播給其他所有客戶端
    socket.on("syncColor", (data) => {
      io.emit("updateColor", data);
    });

    // 接收玩家名稱和顏色，然後廣播這個信息給所有連接的客戶端
    socket.on("syncBlock", (block) => {
      io.emit("newBlock", block); // 廣播新的玩家區塊信息
      console.log("Broadcasting new block:", block);
    });
  });
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
