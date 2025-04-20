const characterModel = require('../models/characterModel');
const userModel = require('../models/userModel');
const petModel = require('../models/petModel');
const inventoryModel = require('../models/inventoryModel');
const gearModel = require('../models/gearModel');
const classModel = require('../models/classModel');
const responseView = require('../views/responseView');

module.exports = {
    async createCharacter(req, res, next) {
        try {

            const allClass = await classModel.getClassList()
            var specifiedClass;
            const user_id = req.body.user_id
            const character_name = req.body.character_name;
            const character_class = req.body.character_class;
            const pet_name = req.body.pet_name;
            const lvl = 0;
            let weapon;
            if (character_class.toLowerCase() == 'warrior') {
                weapon = 'Wooden Sword';
            }
            else if (character_class.toLowerCase() == 'assassin') {
                weapon = 'Wooden Dagger';
            }
            else if (character_class.toLowerCase() == 'mage') {
                weapon = 'Wooden Wand';
            }
            else if (character_class.toLowerCase() == 'summoner') {
                weapon = 'Wooden Wand';
            }
            else if (character_class.toLowerCase() == 'archer') {
                weapon = 'Wooden Bow'
            }
            const helmet = '';
            const chestplate = '';
            const leggings = '';

            for (var i=0;i<allClass.length;i++) {
                if (allClass[i].class.toLowerCase() == character_class.toLowerCase()) {
                    specifiedClass = allClass[i]
                }
            }

            console.log(specifiedClass)
            const hp = specifiedClass.hp
            const atk = specifiedClass.atk
            const atk_spd = specifiedClass.atk_spd
            console.log(atk_spd)
            const movement_spd = specifiedClass.movement_spd
            const energy = specifiedClass.energy
            const mana = specifiedClass.mana
            const passive = specifiedClass.passive
            const skill1 = specifiedClass.skill1
            const skill2 = specifiedClass.skill2
            const faction = ''
            const pet_lvl = 0

            const characterId = await characterModel.createCharacter(user_id, character_name, character_class, faction, lvl, weapon, helmet, chestplate, leggings, hp, atk, atk_spd, movement_spd, energy, mana, passive, skill1, skill2, pet_name, pet_lvl);

            responseView.confirmCreated(res, { id: characterId, user_id, character_name, character_class, faction: faction, lvl, weapon, helmet, chestplate, leggings, pet_name, pet_lvl: pet_lvl });
            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to create characters', err);
        }
    },

    /* Check whether user exist, duplicate character name and if class entered is in database */
    async checkExistenceForCharacter(req, res, next) {
        try {
            if (req.body.user_id == undefined || req.body.character_name == undefined || req.body.character_class == undefined || req.body.pet_name == undefined) {
                responseView.BadRequest(res, 'Missing user_id, name, class or pet')
                return;
            };

            const user_id = req.body.user_id;
            const character_name = req.body.character_name;
            const character_class = req.body.character_class;

            var user = await userModel.getUserById(user_id)

            if (user.length === 0) {
                responseView.NotFound(res, 'User does not exist')
                return;
            }

            var characterList = await characterModel.getCharacterList();
            
            for (var i=0;i<characterList.length;i++) {
                if (characterList[i].character_name.toLowerCase() == character_name.toLowerCase()) {
                    responseView.Conflict(res, "Name already associated with another character")
                    return;
                }
            }

            var character_class_nonExistence = true

            var classList = await characterModel.getAllClasses();

            for (var i=0;i<classList.length;i++) {
                if(classList[i].class.toLowerCase() == character_class.toLowerCase()) {
                    character_class_nonExistence = false;
                    break;
                }
            }

            if(character_class_nonExistence) {
                responseView.NotFound(res, 'Class does not exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check user_id, name, class')
        }
    },

    /* Checks if user has reached character creation limit
    Current limit: 2 characters per user */
    async characterLimitation(req, res, next) {
        try {
            const user_id = req.body.user_id;

            const characterList = await characterModel.getCharacterWithUserId(user_id);

            if(characterList.length >= 2) {
                responseView.Forbidden(res, 'Max limit of character reached per user')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check amount of character of user', err)
        }
    },

    /* Check whether entered pet is in database */
    async checkCharacterPet(req, res, next) {
        try {
            const pet_name = req.body.pet_name;

            const petList = await petModel.getPetList();

            var petnonExistence = true;

            for(var i=0;i<petList.length;i++) {
                if (petList[i].pet_1st_evolution.toLowerCase() == pet_name.toLowerCase()) {
                    petnonExistence = false;
                }
            }

            if(petnonExistence) {
                responseView.NotFound(res, "Pet not found or isn't at first evolution.");
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check entered pet')
        }
    },

    /* Create an inventory for user when creating character
    1 inventory per user */
    async createInventory(req, res) {
        try {
            const user_id = req.body.user_id

            await inventoryModel.createInventory(user_id);
        } catch (err) {
            responseView.sendError(res, 'Unable to create inventory', err)
        }
    },

    /* Check whether user already owns a inventory */
    async checkInventoryExistence(req, res, next) {
        try {
            const user_id = req.body.user_id

            const inventoryList = await inventoryModel.getInventoryList();

            for (var i=0;i<inventoryList.length;i++) {
                if (inventoryList[i].user_id == user_id) {
                    return;
                }
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check if inventory exist already', err)
        }
    },

    /* Get characters created by a user */
    async getCharacterWithUserId(req, res) {
        try {
            const user_id = req.params.user_id
            
            const characterList = await characterModel.getCharacterWithUserId(user_id);
            const currentCharacterAmount = characterList.length

            const data = {
                characterList: characterList,
                currentCharacterAmount: currentCharacterAmount
            }

            responseView.sendSuccess(res, data)
        } catch (err) {
            responseView.sendError(res, 'Failed to fetch characters', err)
        }
    },

    /* Check whether user have characters created */
    async checkCharacterExistence(req, res, next) {
        try {
            const user_id = req.params.user_id

            const characterList = await characterModel.getCharacterList();

            let character_nonExistence = true;

            for (var i=0;i<characterList.length;i++) {
                if (characterList[i].user_id == user_id) {
                    character_nonExistence = false;
                    break;
                }
            }

            if(character_nonExistence) {
                const currentCharacterAmount = {currentCharacterAmount: 0}

                return responseView.confirmCreated(res, currentCharacterAmount)
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check character existence')
        }
    },

    /* Get characters with their stat created by a user */
    async getCharacterWithUserIdWithStat(req, res) {
        try{
            const user_id = req.params.user_id

            const characterListWithStat = await characterModel.getCharacterWithUserIdWithStat(user_id);
    
            responseView.sendSuccess(res, characterListWithStat)
        } catch (err) {
            responseView.sendError(res, 'Could not fetch characters with stat', err)
        }
    },

    /* Get characters with their abilities created by a user */
    async getCharacterWithUserIdWithAbility(req, res) {
        try{
            const user_id = req.params.user_id

            const characterListWithAbility = await characterModel.getCharacterWithUserIdWithAbility(user_id);
    
            responseView.sendSuccess(res, characterListWithAbility)
        } catch (err) {
            responseView.sendError(res, 'Could not fetch characters with ability', err)
        }
    },

    /* Level up characters with user's skillpoints */
    async levelUpCharacter(req, res) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name

            let user = await userModel.getUserById(user_id)

            if (user.length === 0) {
                responseView.NotFound(res, 'User does not exist')
                return;
            }

            let lvl;
            let skillpoints;
            let username;
            var character_nonExistence = true;
            
            const userCharacterList = await characterModel.getCharacterWithUserId(user_id);

            for (var i=0;i<userCharacterList.length;i++) {
                if (userCharacterList[i].character_name.toLowerCase() == character_name.toLowerCase()) {
                    character_nonExistence = false;
                    lvl = userCharacterList[i].lvl
                }
            }

            if (character_nonExistence) {
                responseView.NotFound(res, 'Character does not exist')
                return;
            }

            user = user[0];

            skillpoints = user.skillpoints
            username = user.username

            if (skillpoints < 100) {
                responseView.Forbidden(res, 'Not enough point to level up')
                return;
            }

            lvl += 1
            skillpoints -= 100

            await userModel.updateUser(user_id, username, skillpoints);
            await characterModel.levelUpCharacter(user_id, character_name, lvl)

            let updatedCharacter = [];
            const updatedCharacterList = await characterModel.getCharacterWithUserId(user_id)

            for (var i=0;i<updatedCharacterList.length;i++) {
                if (updatedCharacterList[i].character_name == character_name) {
                    updatedCharacter.push(updatedCharacterList[i])
                }
            }

            responseView.sendSuccess(res, updatedCharacter, `Character ${character_name} has successfully leveled up to ${lvl}`)
        } catch (err) {
            responseView.sendError(res, 'Failed to level up character', err)
        }
    },

    /* Equip item for character from user's inventory */
    async equipEquipment(req, res) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name
            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");

            const selectedItem = await gearModel.getGearByName(itemUpd)
            const selectedItemStat = selectedItem[0].stat
            const selectedItemEffect = selectedItem[0].effect
            const selectedItemPart = selectedItem[0].part

            const selectedCharacter = await characterModel.getCharacterWithUserIdAndName(user_id, character_name)
            const character_id = selectedCharacter[0].character_id
            const characterClass = selectedCharacter[0].character_class
            const currentCharacterStatValue = selectedCharacter[0][selectedItemStat]

            const characterClassInfo = await classModel.getClassInfo(characterClass)
            const classStatValue = characterClassInfo[0][selectedItemStat]
            const statGain = classStatValue * selectedItemEffect

            const newStatValue = currentCharacterStatValue + statGain

            await characterModel.equipEquipment(character_id, selectedItemPart, itemUpd)

            if (itemUpd != '' && itemUpd != 'Wooden Sword' && itemUpd != 'Wooden Axe' && itemUpd != 'Wooden Dagger' && itemUpd != 'Wooden Wand' && itemUpd != 'Wooden Bow') {
                await characterModel.updateStat(character_id, selectedItemStat, newStatValue)
            }

            const characterListWithUserId = await characterModel.getCharacterWithUserId(user_id)

            var updatedCharacter;

            for (var i=0;i<characterListWithUserId.length;i++) {
                if (characterListWithUserId[i].character_id == character_id) {
                    updatedCharacter = characterListWithUserId[i]
                }
            }

            responseView.sendSuccess(res, updatedCharacter, 'Successfully equipped item')

        } catch (err) {
            responseView.sendError(res, 'Unable to equip equipment', err)
        }
    },

    async checkItemSuitability(req, res, next) {
        try {
            const character_name = req.params.character_name
            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");

            const characterArray = await characterModel.getCharacterWithCharacterName(character_name)
            const character = characterArray[0]
            const gearArray = await gearModel.getGearByName(itemUpd)
            const gear = gearArray[0]

            if (gear.part != 'weapon') {
                next()
            } else {
                if (character.character_class == 'Warrior') {
                    if (gear.category != 'sword' && gear.category != 'axe') {
                        return responseView.Forbidden(res, 'Not suitable weapon for the class')
                    } else {
                        next()
                    }
                } else if (character.character_class == 'Mage' || character.character_class == 'Summoner') {
                    if (gear.category != 'wand') {
                        return responseView.Forbidden(res, 'Not suitable weapon for the class')
                    } else {
                        next()
                    }
                } else if (character.character_class == 'Assassin') {
                    if (gear.category != 'dagger') {
                        return responseView.Forbidden(res, 'Not suitable weapon for the class')
                    } else {
                        next()
                    }
                } else if (character.character_class == 'Archer') {
                    if (gear.category != 'bow') {
                        return responseView.Forbidden(res, 'Not suitable weapon for the class')
                    } else {
                        next()
                    }
                } else {
                    responseView.sendError(res, 'Failed to check item suitability')
                }
            }
        } catch (err) {
            responseView.sendError(res, 'Failed to check item suitability')
        }
    },

    /* Adding character currently equipped item into user's inventory */
    async addingEquippedItemIntoInventory(req, res, next) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name
            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");

            const selectedItem = await gearModel.getGearByName(itemUpd)
            const selectedItemPart = selectedItem[0].part

            const selectedCharacter = await characterModel.getCharacterWithUserIdAndName(user_id, character_name)

            const character_id = selectedCharacter[0].character_id
            const currentItemEquipped = selectedCharacter[0][selectedItemPart]

            console.log(currentItemEquipped)

            if (currentItemEquipped != '' && currentItemEquipped.toLowerCase() != 'wooden sword' && currentItemEquipped.toLowerCase() != 'wooden dagger' && currentItemEquipped.toLowerCase() != 'wooden wand' && currentItemEquipped.toLowerCase() != 'wooden bow') {
                const inventoryList = await inventoryModel.getInventoryList()
                var selectedInventory
    
                for (var i=0;i<inventoryList.length;i++) {
                    if (inventoryList[i].user_id == user_id) {
                        selectedInventory = inventoryList[i]
                    }
                }
    
                var currentInventory = selectedInventory.items
    
                currentInventory.push(currentItemEquipped)

                currentInventory = JSON.stringify(currentInventory)

                await inventoryModel.updateInventoryItems(user_id, currentInventory)

                const currentItemEquippedInfo = await gearModel.getGearByName(currentItemEquipped)
                const currentItemEffect = currentItemEquippedInfo[0].effect
                const currentItemStat = currentItemEquippedInfo[0].stat

                const characterClass = selectedCharacter[0].character_class
                const currentCharacterStatValue = selectedCharacter[0][currentItemStat]

                const characterClassInfo = await classModel.getClassInfo(characterClass)
                const classStatValue = characterClassInfo[0][currentItemStat]

                const StatLost = classStatValue * currentItemEffect

                const newStatValue = currentCharacterStatValue - StatLost

                await characterModel.updateStat(character_id, currentItemStat, newStatValue)
            } else if (currentItemEquipped.toLowerCase() == 'wooden sword' || currentItemEquipped.toLowerCase() == 'wooden dagger' || currentItemEquipped.toLowerCase() == 'wooden wand' || currentItemEquipped.toLowerCase() == 'wooden bow'){
                const inventoryList = await inventoryModel.getInventoryList()
                var selectedInventory
    
                for (var i=0;i<inventoryList.length;i++) {
                    if (inventoryList[i].user_id == user_id) {
                        selectedInventory = inventoryList[i]
                    }
                }
    
                var currentInventory = selectedInventory.items
    
                currentInventory.push(currentItemEquipped)

                currentInventory = JSON.stringify(currentInventory)

                await inventoryModel.updateInventoryItems(user_id, currentInventory)

            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to add currently equipped item into inventory.', err)
        }
    },

    /* Remove selected item from user's inventory */
    async removeInventoryitem(req, res, next) {
        try {
            const user_id = req.params.user_id
            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");
    
            const inventoryList = await inventoryModel.getInventoryList()
            var selectedInventory
    
            for (var i=0;i<inventoryList.length;i++) {
                if (inventoryList[i].user_id == user_id) {
                    selectedInventory = inventoryList[i]
                }
            }
    
            var currentInventory = selectedInventory.items
    
            const indexOfItem = currentInventory.indexOf(itemUpd)
            
            if (indexOfItem > -1) {
                currentInventory.splice(indexOfItem, 1)
            }
    
            console.log(currentInventory)
            currentInventory = JSON.stringify(currentInventory)
    
            await inventoryModel.updateInventoryItems(user_id, currentInventory)

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to remove item from inventory', err)
        }
    },
    
    /* Check whether item is in database */
    async checkItemExistence(req, res, next) {
        try {
            const user_id = req.params.user_id
            const item = req.body.item.toLowerCase()

            var itemUpd = item.split(" ");

            for (let i = 0; i < itemUpd.length; i++) {
                itemUpd[i] = itemUpd[i][0].toUpperCase() + itemUpd[i].substr(1);
            }

            itemUpd = itemUpd.join(" ");

            console.log(itemUpd)

            const gear = await gearModel.getGearByName(itemUpd)

            if(gear.length === 0) {
                responseView.NotFound(res, 'item is not in gear database')
                return;
            }

            const inventoryList = await inventoryModel.getInventoryList()
            var selectedInventory
    
            for (var i=0;i<inventoryList.length;i++) {
                if (inventoryList[i].user_id == user_id) {
                    selectedInventory = inventoryList[i]
                }
            }
    
            var currentInventory = selectedInventory.items

            var itemNonExistenceInInventory = true;

            for (var i=0;i<currentInventory.length;i++) {
                if (currentInventory[i].toLowerCase() == item) {
                    itemNonExistenceInInventory = false;
                }
            }

            if(itemNonExistenceInInventory) {
                responseView.NotFound(res, 'User does not have item in their inventory')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check item existence', err)
            console.log(err)
        }
    },

    /* Check whether user exist */
    async checkUserExistence(req, res, next) {
        try {
            const user_id = req.params.user_id

            const user = await userModel.getUserById(user_id)

            if (user.length === 0) {
                responseView.NotFound(res, 'User does not exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Failed to check whether user exist', err)
        }
    },

    /* Check whether character exist with character_name */
    async checkCharacterExistenceWithName(req, res, next) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name

            const selectedCharacter = await characterModel.getCharacterWithUserIdAndName(user_id, character_name)

            if (selectedCharacter.length === 0) {
                responseView.NotFound(res, 'Character with entered name does not exist')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check character with entered name', err)
        }
    },

    /* unEquip item off characters */
    async unequipEquipment(req, res) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name
            var itemType = req.body.item_type
            itemType = itemType.toLowerCase()

            
            const selectedCharacter = await characterModel.getCharacterWithUserIdAndName(user_id, character_name)
            const character_id = selectedCharacter[0].character_id
            const itemEquipped = selectedCharacter[0][itemType]

            const selectedInventory = await inventoryModel.getInventoryWithUserId(user_id)
            var currentInventory = selectedInventory[0].items

            if(itemEquipped == undefined) {
                responseView.Forbidden(res, 'Failed to unequip item')
                return;
            }

            currentInventory.push(itemEquipped)

            currentInventory = JSON.stringify(currentInventory)

            await inventoryModel.updateInventoryItems(user_id, currentInventory)

            await characterModel.unequipEquipment(character_id, itemType)

            const characterListWithUserId = await characterModel.getCharacterWithUserId(user_id)

            var updatedCharacter;

            for (var i=0;i<characterListWithUserId.length;i++) {
                if (characterListWithUserId[i].character_id == character_id) {
                    updatedCharacter = characterListWithUserId[i]
                }
            }

            const currentItemEquippedInfo = await gearModel.getGearByName(itemEquipped)
            const currentItemEffect = currentItemEquippedInfo[0].effect
            const currentItemStat = currentItemEquippedInfo[0].stat

            const characterClass = selectedCharacter[0].character_class
            const currentCharacterStatValue = selectedCharacter[0][currentItemStat]

            const characterClassInfo = await classModel.getClassInfo(characterClass)
            const classStatValue = characterClassInfo[0][currentItemStat]

            const StatLost = classStatValue * currentItemEffect

            const newStatValue = currentCharacterStatValue - StatLost

            if (itemEquipped != '' && itemEquipped != 'Wooden Sword' && itemEquipped != 'Wooden Axe' && itemEquipped != 'Wooden Dagger' && itemEquipped != 'Wooden Wand' && itemEquipped != 'Wooden Bow') {
                await characterModel.updateStat(character_id, currentItemStat, newStatValue)
            }

            responseView.sendSuccess(res, updatedCharacter)
        } catch (err) {
            responseView.sendError(res, 'Failed to unequip item', err)
            console.log(err)
        }
    },

    /* check whether character have selected item_type equipped */
    async checkCurrentItem(req, res, next) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name
            const itemType = req.body.item_type

            const selectedCharacter = await characterModel.getCharacterWithUserIdAndName(user_id, character_name)

            if (selectedCharacter[0][itemType] == '') {
                responseView.Forbidden(res, `There is no ${itemType} equipped`)
                return;
            } 

            next()
        } catch (err) {
            responseView.sendError(res, 'Fail to check current item equipped')
        }
    },

    /* Simple check for request body middleware for unequipEquipment function */
    async simpleCheckForUnequipEquipment(req, res, next) {
        try {
            if (req.body.item_type == undefined) {
                responseView.BadRequest(res, 'Missing item_type')
                return;
            }

            const item_type = req.body.item_type
 
            if (item_type.toLowerCase() == "helmet" || item_type.toLowerCase() == "chestplate" || item_type.toLowerCase() == "leggings" || item_type.toLowerCase() == "weapon") {
                next()
            } else {
                responseView.BadRequest(res, 'item_type must be either helmet, chestplate, leggings or weapon, unequip happens one at a time')
                return;
            }
        } catch (err) {
            responseView.sendError(res, 'Unable to do simple check for unequipEquipment')
        }
    },

    /* Evolve character's pet base on pet's level */
    async petEvolve(req, res) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name

            const petList = await petModel.getPetList()
            var selectedPet;

            const selectedCharacter = await characterModel.getCharacterWithUserIdAndName(user_id, character_name)
            const characterPet = selectedCharacter[0].pet_name
            const characterPetLvl = selectedCharacter[0].pet_lvl
            const character_id = selectedCharacter[0].character_id

            for (var i=0;i<petList.length;i++) {
                if (petList[i].pet_1st_evolution.toLowerCase() == characterPet.toLowerCase()) {
                    selectedPet = petList[i]
                }

                else if(petList[i].pet_2nd_evolution.toLowerCase() == characterPet.toLowerCase()) {
                    selectedPet = petList[i]
                }

                else if(petList[i].pet_3rd_evolution.toLowerCase() == characterPet.toLowerCase()) {
                    selectedPet = petList[i]
                }
            }

            var currentEvolution;
            var newPet;

            if (selectedPet.pet_1st_evolution.toLowerCase() == characterPet.toLowerCase()) {
                currentEvolution = 1
            }

            else if(selectedPet.pet_2nd_evolution.toLowerCase() == characterPet.toLowerCase()) {
                currentEvolution = 2
            }

            else if(selectedPet.pet_3rd_evolution.toLowerCase() == characterPet.toLowerCase()) {
                currentEvolution = 3
            }

            if (currentEvolution == 1 || currentEvolution == 2) {
                if (currentEvolution == 2 && characterPetLvl >= 40) {
                    newPet = selectedPet.pet_3rd_evolution
                }

                else if (currentEvolution == 1 && characterPetLvl >= 20) {
                    newPet = selectedPet.pet_2nd_evolution
                }

                else if (currentEvolution == 2 && characterPetLvl < 40){
                    responseView.Forbidden(res, 'Not enough level to evolve');
                    return;
                }

                else if (currentEvolution == 1 && characterPetLvl < 20) {
                    responseView.Forbidden(res, 'Not enough level to evolve');
                    return;
                }

                else {
                    responseView.sendError(res, 'Failed to evolve pet', err)
                    return;
                }

            } else if (currentEvolution == 3){
                responseView.noContent(res, 'Pet is already fully evolved');
                return;
            }

            else {
                responseView.sendError(res, 'Failed to evolve pet', err)
                return;
            }

            await characterModel.updatePet(character_id, newPet)
            responseView.sendSuccess(res, `Successfully Evolved into ${newPet}`)
        } catch (err) {
            responseView.sendError(res, 'Failed to evolve pet', err)
        }
    },

    async deleteCharacter(req, res) {
        try {
            const user_id = req.params.user_id
            const character_name = req.params.character_name

            await characterModel.deleteCharacterWithCharacterNameAndUserId(user_id, character_name)

            responseView.noContent(res, `Successfully deleted character ${character_name}`)
        } catch (err) {
            responseView.sendError(res, 'Fail to delete character')
        }
    },

    /* Get characters created by user with their base stat (stat from their class */
    async getCharacterBaseStat(req, res) {
        try {
            const user_id = req.params.user_id

            const characterList = await characterModel.getCharacterBaseStat(user_id)

            responseView.sendSuccess(res, characterList)
        } catch (err) {
            responseView,responseView.sendError(res, 'Fail to get character base stat')
        }
    },

    /* Retrieve list of character's ranking based on their level */
    async getRankingOfCharacter(req, res) {
        try {
            const rankingofCharacter = await characterModel.characterRanking()

            responseView.sendSuccess(res, rankingofCharacter)
        } catch (err) {
            responseView.sendError(res, 'Failed to get ranking of character')
            console.log(err)
        }
    },

    /* Check whether there is currently any characters created */
    async characterExistence(req, res, next) {
        try {
            const characterList = await characterModel.getCharacterList()

            if (characterList.length === 0) {
                responseView.NotFound(res, 'There is currently no characters')
                return;
            }

            next()
        } catch (err) {
            responseView.sendError(res, 'Unable to check if there is currently any characters')
        }
    },

    async getCharacterExistence(req, res) {
        try {
            const character_name = req.params.character_name
            const character = await characterModel.getCharacterWithCharacterName(character_name)

            if (character.length === 0) {
                return responseView.noContent(res, character)
            }

            responseView.sendSuccess(res, character)
        } catch (err) {
            responseView.sendError(res, 'Could not check for existence')
        }
    }
}