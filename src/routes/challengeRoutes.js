const express = require('express');
const challengeController = require('../controllers/challengeController');

const router = express.Router();

router.get('/', challengeController.listChallenges);
router.post('/', challengeController.createChallenge);
router.post('/:challenge_id', challengeController.completeChallenge);
router.put('/:challenge_id', challengeController.updateChallenge);
router.delete('/:challenge_id', challengeController.deleteChallenge);
router.get('/:challenge_id', challengeController.getChallengeById);
router.get('/other/:challenge_id', challengeController.getChallengeByChallengeId);
router.put('/note/:complete_id', challengeController.updateCompletedNote);

module.exports = router;