const classModel = require('../models/classModel');
const responseView = require('../views/responseView');

module.exports = {
    /* Allow user to retrieve all class information, allowing them to pick what they want */
    async getClassList(req, res) {
        try {
            const classList = await classModel.getClassList()
            responseView.sendSuccess(res, classList)
        } catch (err) {
            responseView.sendError(res, 'Fail to get class list', err)
        }
    }
}