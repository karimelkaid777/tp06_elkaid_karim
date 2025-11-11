const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {
    const { type_pollution, titre } = req.query;

    const whereClause = {};

    if (type_pollution) {
        whereClause.type_pollution = type_pollution;
    }

    if (titre) {
        whereClause.titre = {
            [Op.iLike]: `%${titre}%`
        };
    }

    Pollution.findAll({ where: whereClause })
        .then(data => {res.send(data);})
        .catch(err => {
            res.status(400).send({
                message: err.message
            });
        });
};

// GET pollution by ID
exports.getById = (req, res) => {
    const id = req.params.id;

    Pollution.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Pollution non trouvée avec l'id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Erreur lors de la récupération de la pollution avec l'id=${id}`
            });
        });
};

// CREATE new pollution
exports.create = (req, res) => {
    // Validation
    if (!req.body.titre) {
        res.status(400).send({
            message: "Le titre est obligatoire"
        });
        return;
    }

    // Create pollution object
    const pollution = {
        titre: req.body.titre,
        lieu: req.body.lieu,
        date_observation: req.body.date_observation,
        type_pollution: req.body.type_pollution,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        photo_url: req.body.photo_url
    };

    // Save to database
    Pollution.create(pollution)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erreur lors de la création de la pollution"
            });
        });
};

// UPDATE pollution by ID
exports.update = (req, res) => {
    const id = req.params.id;

    Pollution.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                // Récupérer l'objet mis à jour pour le renvoyer
                Pollution.findByPk(id)
                    .then(data => {
                        res.send(data);
                    });
            } else {
                res.status(404).send({
                    message: `Impossible de mettre à jour la pollution avec l'id=${id}. Pollution non trouvée.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Erreur lors de la mise à jour de la pollution avec l'id=${id}`
            });
        });
};

// DELETE pollution by ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Pollution.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(404).send({
                    message: `Impossible de supprimer la pollution avec l'id=${id}. Pollution non trouvée.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Erreur lors de la suppression de la pollution avec l'id=${id}`
            });
        });
};
