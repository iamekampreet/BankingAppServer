let config = {};
if (process.env.NODE_ENV === `production`) {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_DATABASE}`;

  config = {
    db: {
      uri: uri,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  };
} else {
  const uri = `mongodb://127.0.0.1:27017/rbc-bank`;
  config = {
    db: {
      uri: uri,
    },
  };
}

module.exports = config;
