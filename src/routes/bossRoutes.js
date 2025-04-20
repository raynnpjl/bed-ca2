const express = require('express');
const dungeonController = require('../controllers/dungeonController');

const router = express.Router();

router.get('/', dungeonController.getAllDungeon);
router.get('/drops_info', dungeonController.getAllDungeonDropsInfo);
router.post('/:dungeon_id', dungeonController.checkDungeonExistence, dungeonController.checkCharacterExistence, dungeonController.checkMinLvl, dungeonController.rewardDrop, dungeonController.rewardLvlToPet, dungeonController.rewardGold, dungeonController.completeDungeon);

module.exports = router;