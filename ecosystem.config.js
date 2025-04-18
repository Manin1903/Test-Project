module.exports = {
  apps: [
    {
      name: "ccc-project",
      script: "server.js",
      args: "start",
      env: {
        PORT: 8485,
        NODE_ENV: "production",
      },
    },
  ],
};
