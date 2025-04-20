const petModel = require('../models/petModel');
const responseView = require('../views/responseView');

module.exports = {
    /* Retrieves all pet information */
    async getAllPet(req, res) {
        try {
            const petList = await petModel.getPetList();
            responseView.sendSuccess(res, petList);
        } catch (err) {
            responseView.sendError(res, 'Failed to fetch pets', err)
        }
    }
}