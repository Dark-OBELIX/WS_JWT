const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require("../models/user.model");
const User_DB = [];



exports.register = (req, res) => {
  var newUser = new User(req.body.username, bcrypt.hashSync(req.body.password, 10));
  User_DB.push(newUser);
  return res.status(201).json({
    "msg": "New User created !"
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = User_DB.find((u) => u.username === username && bcrypt.compareSync(password, u.password));
  if (user) {
    const accessToken = jwt.sign({ username: user.username, exp: Math.floor(Date.now() / 1000) + 120 }, process.env.ACCESS_JWT_KEY);

    console.log("accessToken : ", accessToken)
    return res.status(200).json({message : "You are now connected !"});
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.authenticate = (req, res) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

jwt.verify(token, process.env.ACCESS_JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    // TO-DO : Vérification si l’utilisateur décodé existe
    const user = User_DB.find(u => u.username === decoded.username);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // TO-DO : Renvoyer une réponse adaptée en fonction de son état 
    return res.status(200).json({ message: "Authentification réussie", user: user.username });
  });

}
