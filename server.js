
const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";

server.listen(port, ip, () => {
  const addr = server.address();
  console.log(`Seerver listening at ${addr.address}:${addr.port}`);
});
