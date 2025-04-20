const express = require('express');
const factionController = require('../controllers/factionController');

const router = express.Router();

router.post('/', factionController.simpleCheckForCreateFaction, factionController.checkCharacterExistence, factionController.checkCharacterFaction, factionController.checkDuplicateFaction, factionController.createFaction)
router.get('/', factionController.getAllFaction)
router.put('/:faction_id', factionController.simpleCheckForUpdateFaction, factionController.checkCharacterExistence, factionController.checkFactionExistence, factionController.updateFaction)
router.put('/:faction_id/join', factionController.simpleCheckForJoinLeaveFaction, factionController.checkCharacterExistence, factionController.checkFactionExistence, factionController.checkCharacterFaction, factionController.checkCharacterLvl, factionController.joinFaction)
router.put('/:faction_id/leave', factionController.simpleCheckForJoinLeaveFaction, factionController.checkCharacterExistence, factionController.checkFactionExistence, factionController.checkCharacterInFaction, factionController.leaveFaction)
router.delete('/:faction_id', factionController.simpleCheckForDeleteFaction, factionController.checkCharacterExistence, factionController.checkFactionExistence, factionController.deleteFaction)

module.exports = router;