module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");

    var router = require("express").Router();

    // GET all utilisateurs
    router.get("/", utilisateur.getAll);

    // CREATE new utilisateur
    router.post("/", utilisateur.create);

    // LOGIN utilisateur
    router.post("/login", utilisateur.login);

    app.use('/api/utilisateur', router);
};
