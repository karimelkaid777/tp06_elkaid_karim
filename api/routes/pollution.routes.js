module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
    const { validateRequest } = require("zod-express-middleware");
    const {
        createPollutionSchema,
        updatePollutionSchema,
        queryPollutionSchema,
        pollutionIdSchema
    } = require("../validators/pollution.validator.js");

    var router = require("express").Router();

    // GET all pollutions with optional filters
    router.get("/",
        validateRequest({ query: queryPollutionSchema }),
        pollution.get
    );

    // GET pollution by ID
    router.get("/:id",
        validateRequest({ params: pollutionIdSchema }),
        pollution.getById
    );

    // CREATE new pollution
    router.post("/",
        validateRequest({ body: createPollutionSchema }),
        pollution.create
    );

    // UPDATE pollution by ID
    router.put("/:id",
        validateRequest({
            params: pollutionIdSchema,
            body: updatePollutionSchema
        }),
        pollution.update
    );

    // DELETE pollution by ID
    router.delete("/:id",
        validateRequest({ params: pollutionIdSchema }),
        pollution.delete
    );

    app.use('/api/pollution', router);
};
