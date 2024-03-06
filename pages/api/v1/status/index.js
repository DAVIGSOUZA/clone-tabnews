const status = (req, res) => {
  res.status(200).json({ status: "Tudo ok!" });
};

export default status;
