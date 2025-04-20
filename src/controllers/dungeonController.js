const dungeonModel = require('../models/dungeonModel');
const characterModel = require('../models/characterModel');
const inventoryModel = require('../models/inventoryModel');
const responseView = require('../views/responseView');

module.exports = {
    /* Retrieve all dungeon information */
    async getAllDungeon(req, res) {
        try {
            const dungeonList = await dungeonModel.getAllDungeon();
            responseView.sendSuccess(res, dungeonList);
        } catch (err) {
            responseView.sendError(res, 'Failed to fetch dungeons', err)
        }
    },

    /* Get all drops information e.g Stat, Effect, Etc */
    async getAllDungeonDropsInfo(req, res) {
        try {
            const dropsInfoList = await dungeonModel.getAllDungeonDropsInfo();
            responseView.sendSuccess(res, dropsInfoList);
        } catch (err) {
            responseView.sendError(res, 'Failed to fetch dungeon drops info', err)
        }
    },

    /* Attempt to clear a dungeon */ 
    async completeDungeon(req, res) {
        try {

            const dungeon_id = parseInt(req.params.dungeon_id)
            const character_id = req.body.character_id

            const completedDungeon = await dungeonModel.completeDungeon(dungeon_id, character_id)
            const completeId = completedDungeon.insertId
            const creation_date = completedDungeon.creation_date

            responseView.confirmCreated(res, { complete_id: completeId, dungeon_id, character_id, creation_date }, 'Victory')
        } catch (err) {
            responseView.sendError(res, 'Failed to attempt dungeon', err)
        }
    },

    /* Check whether dungeon exist */
    async checkDungeonExistence(req, res, next) {
        try {
            if (req.body.character_id == undefined) {
                responseView.BadRequest(res, 'Missing character_id.')
                return;
            }

            const dungeon_id = req.params.dungeon_id

            const selectedDungeon = await dungeonModel.getDungeonWithDungeonId(dungeon_id)

            if(selectedDungeon.length === 0) {
                responseView.NotFound(res, 'Dungeon does not exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check whether dungeon exist', err)
        }
    },

    /* Check whether character exist */
    async checkCharacterExistence(req, res, next) {
        try {
            const character_id = req.body.character_id

            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id)
    
            if(selectedCharacter.length === 0) {
                responseView.NotFound(res, 'Character does not exist')
                return;
            }
    
            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check whether character exist', err)
        }
    },

    /* Check whether character reached the minimum level requirement to clear the selected dungeon */
    async checkMinLvl(req, res, next) {
        try {
            const dungeon_id = req.params.dungeon_id
            const character_id = req.body.character_id
            const selectedDungeon = await dungeonModel.getDungeonWithDungeonId(dungeon_id);
            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id);

            const minLvl = selectedDungeon[0].min_lvl
            const characterLvl = selectedCharacter[0].lvl

            if(characterLvl < minLvl) {
                responseView.Forbidden(res, "Character's level does not meet the minimum level requirement for the selected dungeon.")
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, "Failed to check character's level", err)
            console.log(err)
        }
    },

    /* Reward the user with the drops */
    async rewardDrop(req, res, next) {
        try {
            const dungeon_id = req.params.dungeon_id
            const character_id = req.body.character_id
            const selectedDungeon = await dungeonModel.getDungeonWithDungeonId(dungeon_id);
            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id);

            const user_id = selectedCharacter[0].user_id
            const dungeonDrops = selectedDungeon[0].drops

            const inventoryList = await inventoryModel.getInventoryList()
            var selectedInventory;

            for(var i=0;i<inventoryList.length;i++) {
                if (inventoryList[i].user_id == user_id) {
                    selectedInventory = inventoryList[i]
                }
            }

            var currentInventory = selectedInventory.items

            for(var i=0;i<dungeonDrops.length;i++) {
                currentInventory.push(dungeonDrops[i])
            }

            currentInventory = JSON.stringify(currentInventory)

            await inventoryModel.updateInventoryItems(user_id, currentInventory)

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to reward user dungeon drops', err)
        }
    },

    /* Reward level to character's pet */
    async rewardLvlToPet(req, res, next) {
        try {
            const dungeon_id = req.params.dungeon_id
            const character_id = req.body.character_id
            const selectedDungeon = await dungeonModel.getDungeonWithDungeonId(dungeon_id);
            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id);

            const dungeonPetLvlReward = selectedDungeon[0].pet_lvl
            const currentPetLvl = selectedCharacter[0].pet_lvl

            const updatedPetLvl = currentPetLvl + dungeonPetLvlReward

            await characterModel.petLvlUp(character_id, updatedPetLvl)

            next()
        } catch (err) {
            responseView.sendError(res, "Failed to reward levels to character's pet", err)
        }
    },

    /* Reward gold to user */
    async rewardGold(req, res, next) {
        try {
            const dungeon_id = req.params.dungeon_id
            const character_id = req.body.character_id
            const selectedDungeon = await dungeonModel.getDungeonWithDungeonId(dungeon_id);
            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id);

            const user_id = selectedCharacter[0].user_id
            const dungeonGold = selectedDungeon[0].gold

            const selectedInventory = await inventoryModel.getInventoryWithUserId(user_id)
            const currentGold = selectedInventory[0].gold

            const totalGold = dungeonGold + currentGold

            await inventoryModel.updateInventoryGold(user_id, totalGold)

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to reward user with gold', err)
        }
    }
}