const server = require("./app");

const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";

server.listen(port, ip, () => {
  console.log(`Server listening at ${port}`);
});
