module.exports = {
  apps : [{
    name: "app",
    script: "/opt/pepiniere/bin/www",
    cwd: "/opt/pepiniere/",
    env: {
      NODE_ENV: "production",
      PORT: "3000",
    },
  }]
};
