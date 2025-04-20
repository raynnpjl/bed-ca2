const express = require('express');
const characterController = require('../controllers/characterController');

const router = express.Router();

router.post('/',characterController.characterLimitation, characterController.checkExistenceForCharacter, characterController.checkCharacterPet, characterController.createCharacter, characterController.checkInventoryExistence, characterController.createInventory);
router.get('/ranking', characterController.characterExistence, characterController.getRankingOfCharacter)
router.get('/:user_id', characterController.checkUserExistence, characterController.checkCharacterExistence, characterController.getCharacterWithUserId);
router.get('/:user_id/basestat', characterController.checkUserExistence, characterController.checkCharacterExistence, characterController.getCharacterBaseStat);
router.get('/:user_id/stat', characterController.checkUserExistence, characterController.checkCharacterExistence, characterController.getCharacterWithUserIdWithStat);
router.get('/:user_id/ability', characterController.checkUserExistence, characterController.checkCharacterExistence, characterController.getCharacterWithUserIdWithAbility);
router.put('/:user_id/:character_name/level', characterController.levelUpCharacter);
router.put('/:user_id/:character_name/equip', characterController.checkUserExistence, characterController.checkCharacterExistenceWithName, characterController.checkItemExistence, characterController.checkItemSuitability, characterController.addingEquippedItemIntoInventory, characterController.removeInventoryitem, characterController.equipEquipment);
router.put('/:user_id/:character_name/unequip', characterController.checkUserExistence, characterController.checkCharacterExistence, characterController.simpleCheckForUnequipEquipment, characterController.checkCurrentItem, characterController.unequipEquipment);
router.put('/:user_id/:character_name/pet/evolve', characterController.petEvolve)
router.delete('/:user_id/:character_name', characterController.checkCharacterExistenceWithName, characterController.deleteCharacter)
router.get('/characterExistence/:character_name', characterController.getCharacterExistence);

module.exports = router;