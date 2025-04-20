const factionModel = require('../models/factionModel');
const characterModel = require('../models/characterModel');
const responseView = require('../views/responseView');

module.exports = {
    /* Creates a new faction with the provided details.
    Checks for character ownership and initializes faction members. */
    async createFaction(req, res) {
        try {
            const faction_name = req.body.faction_name
            const faction_desc = req.body.faction_desc
            const min_lvl = req.body.min_lvl
            const character_id = req.body.character_id

            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id)
            const owner_name = selectedCharacter[0].character_name
            var members = []
            members.push(owner_name)

            members = JSON.stringify(members)
            
            const factionId = await factionModel.createFaction(faction_name, faction_desc, character_id, min_lvl, owner_name, members)
            
            const faction = await factionModel.getFactionWithId(factionId)

            await characterModel.updateCharacterFaction(character_id, faction_name)

            responseView.confirmCreated(res, faction);
        } catch (err) {
            responseView.sendError(res, 'Failed to create faction', err)
        }
    },

    /* Middleware to check if a character exists in the database */
    async checkCharacterExistence(req, res, next) {
        try {
            const characterList = await characterModel.getCharacterList()
            const character_id = req.body.character_id

            var characterNonExistence = true;

            for (var i=0;i<characterList.length;i++) {
                if (characterList[i].character_id == character_id) {
                    characterNonExistence = false;
                }
            }

            if(characterNonExistence) {
                responseView.NotFound(res, 'Character not found')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to check character existence')
        }
    },

    /* Middleware to check for duplicate faction names */
    async checkDuplicateFaction(req, res, next) {
        try {
            const faction_name = req.body.faction_name

            const factionList = await factionModel.getFactionList()

            var DuplicateFaction = false;

            for (var i=0;i<factionList.length;i++) {
                if (factionList[i].faction_name == faction_name) {
                    DuplicateFaction = true;
                }
            }

            if(DuplicateFaction) {
                responseView.Conflict(res, 'Faction already exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to check for duplicate factions', err)
        }
    },

    /* Middleware to verifies if a character is already in a faction */
    async checkCharacterFaction(req, res, next) {
        try {
            const character_id = req.body.character_id

            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id)

            const currentCharacterFaction = selectedCharacter[0].faction

            if(currentCharacterFaction != '') {
                responseView.Forbidden(res, 'Character is already in a faction')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to check if character is in a faction already.', err)
            console.log(err)
        }
    },

    /* Middleware to performs basic checks for faction creation input */
    async simpleCheckForCreateFaction(req, res, next) {
        try {
            if (req.body.faction_name == undefined || req.body.faction_desc == undefined || req.body.min_lvl == undefined || req.body.character_id == undefined) {
                responseView.BadRequest(res, 'faction_name, faction_desc, min_lvl or character_id is missing')
                return;
            }
            
            if (req.body.min_lvl < 0) {
                responseView.BadRequest(res, 'the minimum level to enter faction cannot be lower than 0')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to do simple check before creating faction', err)
        }
    },

    /* Retrieves and sends the list of all factions */
    async getAllFaction(req, res) {
        try {
            const factionList = await factionModel.getFactionList()
            responseView.sendSuccess(res, factionList)
        } catch (err) {
            responseView.sendError(res, 'Failed to fetch faction list')
        }
    },

    /* Allows a character to join a faction */
    async joinFaction(req, res) {
        try {
            const faction_id = req.params.faction_id
            const character_id = req.body.character_id

            const faction = await factionModel.getAllFactionInfoWithId(faction_id)
            const faction_name = faction[0].faction_name
            const currentMembers = faction[0].members

            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id)
            const character_name = selectedCharacter[0].character_name

            var updatedMembers = currentMembers.push(character_name)
            updatedMembers = JSON.stringify(currentMembers)

            await factionModel.updateFactionMembers(faction_id, updatedMembers)
            await characterModel.updateCharacterFaction(character_id, faction_name)

            const updatedFaction = await factionModel.getFactionWithId(faction_id)

            responseView.sendSuccess(res, updatedFaction)
        } catch (err) {
            responseView.sendError(res, 'Failed to join faction', err)
            console.log(err)
        }
    },


    /* Middleware to performs basic checks for join & leave faction input */
    async simpleCheckForJoinLeaveFaction(req, res, next) {
        try {
            if (req.body.character_id == undefined) {
                responseView.BadRequest(res, 'Missing character_id')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to do simple check before join faction', err)
        }
    },

    /* Middleware to check whether faction exist */
    async checkFactionExistence(req, res, next) {
        try {
            const faction_id = req.params.faction_id

            const faction = await factionModel.getAllFactionInfoWithId(faction_id)

            if(faction.length === 0) {
                responseView.NotFound(res, 'Faction does not exist.')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check if faction exist.', err)
        }
    },

    /* Middleware to check whether user is eligible to join selected faction by comparing faction's minimum level and character's level */
    async checkCharacterLvl(req, res, next) {
        try {
            const faction_id = req.params.faction_id
            const character_id = req.body.character_id

            const faction = await factionModel.getAllFactionInfoWithId(faction_id)
            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id)

            const min_lvl = faction[0].min_lvl
            const characterLvl = selectedCharacter[0].lvl

            if (characterLvl < min_lvl) {
                responseView.Forbidden(res, 'Level requirement not met')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check for level requirement')
        }
    },

    /* Allows a character to leave a faction */
    async leaveFaction(req, res) {
        try {
            const faction_id = req.params.faction_id
            const character_id = req.body.character_id

            const faction = await factionModel.getAllFactionInfoWithId(faction_id)
            var currentMembers = faction[0].members

            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id)
            const character_name = selectedCharacter[0].character_name

            const index = currentMembers.indexOf(character_name)
            if (index > -1) {
                currentMembers.splice(index, 1)
            }

            currentMembers = JSON.stringify(currentMembers)

            const no_faction = ''

            await factionModel.updateFactionMembers(faction_id, currentMembers)
            await characterModel.updateCharacterFaction(character_id, no_faction)

            const updatedFaction = await factionModel.getFactionWithId(faction_id)

            responseView.sendSuccess(res, updatedFaction)
        } catch (err) {
            responseView.sendError(res, 'Fail to leave faction', err)
            console.log(err)
        }
    },

    /* Middleware to check whether character is in a faction */
    async checkCharacterInFaction(req, res, next) {
        try {
            const faction_id = req.params.faction_id
            const character_id = req.body.character_id

            const faction = await factionModel.getAllFactionInfoWithId(faction_id)
            const currentMembers = faction[0].members

            const selectedCharacter = await characterModel.getCharacterWithCharacterId(character_id)
            const character_name = selectedCharacter[0].character_name

            const index = currentMembers.indexOf(character_name)
            if (index < 0) {
                responseView.NotFound(res, 'Character is not in the faction.')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check if character is in the faction.', err)
        }
    },

    /* Allow faction's owner to update their faction information */
    async updateFaction(req, res, next) {
        try {
            const faction_id = req.params.faction_id
            const character_id = req.body.character_id
            const faction_name = req.body.faction_name
            const faction_desc = req.body.faction_desc  
            const min_lvl = req.body.min_lvl
    
            const faction = await factionModel.getAllFactionInfoWithId(faction_id)
            const owner_character_id = faction[0].owner_character_id

            if (owner_character_id != character_id) {
                responseView.Forbidden(res, 'You are not the owner of the faction')
                return;
            }

            await factionModel.updateFaction(faction_id, faction_name, faction_desc, min_lvl)

            const updatedFaction = await factionModel.getFactionWithId(faction_id)

            responseView.sendSuccess(res, updatedFaction)
        } catch (err) {
            responseView.sendError(res, 'Fail to update faction information', err)
        }
    },

    /* Middleware to do simple check of input for updating faction */
    async simpleCheckForUpdateFaction(req, res, next) {
        try {
            if (req.body.character_id == undefined || req.body.faction_name == undefined || req.body.faction_desc == undefined || req.body.min_lvl == undefined) {
                responseView.BadRequest(res, 'Missing character_id, faction_name, faction_desc or min_lvl')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to do simple check before updating faction.', err)
            console.log(err)
        }
    },

    /* Allow faction's owner to delete their faction */
    async deleteFaction(req, res) {
        try {
            const faction_id = req.params.faction_id
            const character_id = req.body.character_id
    
            const faction = await factionModel.getAllFactionInfoWithId(faction_id)
            const owner_character_id = faction[0].owner_character_id
    
            if (owner_character_id != character_id) {
                responseView.Forbidden(res, 'You are not the owner of the faction')
                return;
            }

            const currentMembers = faction[0].members

            for (var i=0;i<currentMembers.length;i++) {
                const selectedCharacter = await characterModel.getCharacterWithCharacterName(currentMembers[i])
                const character_id = selectedCharacter[0].character_id
                await characterModel.updateCharacterFaction(character_id, '')
            }
    
            await factionModel.deleteFaction(faction_id)
    
            responseView.noContent(res, 'Successfully deleted faction')
        } catch (err) {
            responseView.sendError(res, 'Fail to delete faction')
        }
    },

    /* Middleware to do simple check for faction deletion input */
    async simpleCheckForDeleteFaction(req, res, next) {
        try {
            if (req.body.character_id == undefined) {   
                responseView.BadRequest(res, 'character_id is missing')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to do simple check for delete faction')
        }
    }
}