function getSlsOfflinePort() {
  return process.env.PORT || "3001";
}

module.exports = getSlsOfflinePort;