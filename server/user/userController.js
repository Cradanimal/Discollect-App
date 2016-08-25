const User = require('./userModel.js');

module.exports = {
  updateTakerRating: (req, res) => {
    User.findOne({
      where: {
        id: req.body.takerId,
      },
    })
    .then((user) => {
      const oldTotal = Number(user.avgRating) * Number(user.ratingCount);
      const newTotal = Number(oldTotal) + Number(req.body.rating);
      const newCounter = 1 + Number(user.ratingCount);
      const newAverage = (Number(newTotal) / Number(newCounter)).toFixed(1);
      user.update({
        avgRating: newAverage,
        ratingCount: newCounter,
      });
      res.send();
    })
    .catch((err) => {
      console.log('updateTakerRating issue');
      res.status(400).send(err);
    });
  },

  updateGiverRating: (req, res) => {
    User.findOne({
      where: {
        id: req.body.giverId,
      },
    })
    .then((user) => {
      const oldTotal = Number(user.avgRating) * Number(user.ratingCount);
      const newTotal = Number(oldTotal) + Number(req.body.rating);
      const newCounter = 1 + Number(user.ratingCount);
      const newAverage = (Number(newTotal) / Number(newCounter)).toFixed(1);
      user.update({
        avgRating: newAverage,
        ratingCount: newCounter,
      });
      res.send();
    })
    .catch((err) => {
      console.log('updateGiverRating issue');
      res.status(400).send(err);
    });
  },

  getUserInfo: (req, res) => {
    const userId = req.user.id || req.query.id;
    if (userId) {
      User.findOne({ where: { id: userId } })
        .then(user => {
          res.json(user);
        });
    } else {
      res.json({ user: null });
    }
  },

  postUser: (req, res) => {
    User.findOrCreate({ where: { username: req.body.username } })
      .spread((user, created) => {
        const message = {
          user,
          created,
        };
        res.json(message);
      });
  },

// login handles login and, if successful, returns zipcode with res.send for our
  login: (req, res) => {
    const message = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      zipcode: req.user.zipcode,
      picReference: req.user.picReference,
    };
    res.json(message);
  },

  signup: (req, res) => {
    User.findOne({
      where: { username: req.body.username },
    })
    .then((user) => {
      if (!user) {
        User.create(req.body)
        .then((user) => {
          const message = {
            id: user.id,
            username: user.username,
            zipcode: user.zipcode,
          };
          res.json(message);
        });
      } else {
        res.status(200).send('That username is already in use.');
      }
    });
  },

  logout: (req, res) => {
    req.logout();
    req.session.destroy(() => {
      res.send();
    });
  },

  userProfile: (req, res) => {
    User.findOne({
      where: {
        id: req.body.userID,
      },
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
    });
  },

  updatePic: (req, res) => {
    User.findOne({
      where: {
        id: req.body.userId,
      },
    })
    .then((user) => (
      user.update({
        picReference: req.body.picReference,
      })
    ))
    .then((user) => {
      user.password = null;
      res.send(user);
    });
  },
};
