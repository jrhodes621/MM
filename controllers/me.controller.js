const MeController = {
  GetUser: (req, res) => {
    res.status(200).json(req.currentUser);
  },
};

module.exports = MeController;
