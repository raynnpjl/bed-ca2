const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/', reviewController.readAllReview);
router.post('/', reviewController.createReview);
router.get('/:id', reviewController.readReviewById);
router.put('/:id', reviewController.updateReviewbyId);
router.delete('/:id', reviewController.deleteReviewById);
router.get('/user_id/:user_id', reviewController.readReviewByUserId)

module.exports = router;