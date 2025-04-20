const reviewModel = require('../models/reviewModel');
const responseView = require('../views/responseView');

module.exports = {
    async createReview(req, res) {
        try {
            if(req.body.review_amt == undefined) {
                responseView.BadRequest(res, "review_amt is undefined");
                return;
            }
            else if(req.body.review_amt > 5 || req.body.review_amt < 0)
            {
                responseView.Forbidden(res, 'review_amt can only be between 0 to 5');
                return;
            }
            else if (req.body.review_msg == undefined) {
                responseView.BadRequest(res, 'review_msg is undefined')
            }
            else if(req.body.user_id == undefined)
            {
                responseView.BadRequest(res,"user_id is undefined");
                return;
            } else if (req.body.username == undefined) {
                responseView.BadRequest(res, "username is undefined")
            }
        
            const user_id = req.body.user_id
            const username = req.body.username
            const review_amt = req.body.review_amt
            const review_msg = req.body.review_msg
        
            const id = await reviewModel.insertSingle(user_id, username, review_amt, review_msg)
            const result = await reviewModel.selectById(id)
            responseView.sendSuccess(res, result)
        } catch (err) {
            responseView.sendError(res, 'Fail to create review')
        }
    },

    async readReviewById(req, res) {
        try {
            const id = req.params.id

            const review = await reviewModel.selectById(id)

            if (review.length === 0) {
                responseView.NotFound(res, 'Review not found')
                return;
            }

            responseView.sendSuccess(res, review)
        } catch (err) {
            responseView.sendError(res, 'Fail to get review by id')
        }
    },

    async readAllReview(req, res) {
        try {
            const review = await reviewModel.selectAll()

            responseView.sendSuccess(res, review)
        } catch (err) {
            responseView.sendError(res, 'Failed to get all review')
        }
    },

    async updateReviewbyId(req, res) {
        try {
            if (req.params.id == undefined) {
                responseView.BadRequest(res, 'id is undefined')
                return;
            } else if (req.body.review_amt == undefined) {
                responseView.BadRequest(res, 'review_amt is undefined')
                return;
            } else if (req.body.review_msg == undefined) {
                responseView.BadRequest(res, 'review_msg is undefined')
                return;
            } else if (req.body.review_amt > 5 || req.body.review_amt < 0) {
                responseView.Forbidden(res, 'review_amt can only be between 0 to 5')
                return;
            } else if (req.body.user_id == undefined) {
                responseView.BadRequest(res, 'user_id is undefined')
                return;
            } else if (req.body.username == undefined) {
                responseView.BadRequest(res, "username is undefined")
            }
    
            const id = req.params.id
            const user_id = req.body.user_id
            const username = req.body.username
            const review_amt = req.body.review_amt
            const review_msg = req.body.review_msg
    
            await reviewModel.updateById(id, user_id, username, review_amt, review_msg)
    
            responseView.noContent(res, 'data')
        } catch (err) {
            responseView.sendError(res, 'Fail to update review')
        }
    },

    async deleteReviewById(req, res) {
        try {
            const id = req.params.id

            const review = await reviewModel.selectById(id)
    
            if (review.length == 0) {
                responseView.NotFound(res, 'Review not found')
                return;
            }
    
            await reviewModel.deleteById(id)
    
            responseView.noContent(res, 'data')
        } catch (err) {
            responseView.sendError(res, 'Fail to delete review')
        }
    },

    async readReviewByUserId(req, res) {
        try {
            const user_id = req.params.user_id

            const review = await reviewModel.selectByUserId(user_id)

            if (review.length == 0) {
                responseView.NotFound(res, 'Review not found')
                return
            }

            responseView.sendSuccess(res, review)
        } catch (err) {
            responseView.sendError(res, 'Fail to read review by user_id')
        }
    }
}