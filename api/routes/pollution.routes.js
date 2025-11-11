module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");

    var router = require("express").Router();

    router.get("/", pollution.get);
    router.get("/:id", pollution.getById);
    router.post("/", pollution.create);
    router.put("/:id", pollution.update);
    router.delete("/:id", pollution.delete);

    app.use('/api/pollution', router);
  };
