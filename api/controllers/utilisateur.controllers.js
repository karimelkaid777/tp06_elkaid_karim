const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

// GET all utilisateurs
exports.getAll = (req, res) => {
    Utilisateurs.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erreur lors de la récupération des utilisateurs"
            });
        });
};

// CREATE new utilisateur
exports.create = (req, res) => {
    // Validation
    if (!req.body.nom || !req.body.prenom || !req.body.login || !req.body.email || !req.body.pass) {
        res.status(400).send({
            message: "Tous les champs sont obligatoires (nom, prenom, login, email, pass)"
        });
        return;
    }

    // Create utilisateur object
    const utilisateur = {
        id: uuidv4(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        login: req.body.login,
        email: req.body.email,
        pass: req.body.pass
    };

    // Save to database
    Utilisateurs.create(utilisateur)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erreur lors de la création de l'utilisateur"
            });
        });
};

// Find a single Utilisateur with an login
exports.login = (req, res) => {
  const utilisateur = {
    login: req.body.login,
    password: req.body.password
  };

  // Test
  let pattern = /^[A-Za-z0-9]{1,20}$/;
  if (pattern.test(utilisateur.login) && pattern.test(utilisateur.password)) {
     Utilisateurs.findOne({ where: { login: utilisateur.login } })
    .then(data => {
      if (data) {
        const user = {
          id: data.id,
          name: data.nom,
          email: data.email
        };

        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with login=${utilisateur.login}.`
        });
      }
    })
    .catch(err => {
      res.status(400).send({
        message: "Error retrieving Utilisateur with login=" + utilisateur.login
      });
    });
  } else {
    res.status(400).send({
      message: "Login ou password incorrect"
    });
  }
};
