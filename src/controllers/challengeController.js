const challengeModel = require('../models/challengeModel');
const userModel = require('../models/userModel');
const responseView = require('../views/responseView');

module.exports = {
    async createChallenge(req, res) {
        try {
            if (req.body.challenge == undefined || req.body.user_id == undefined || req.body.skillpoints == undefined) {
                responseView.BadRequest(res, 'Missing challenge, user_id or skillpoints.')
                return;
            }

            const challenge_name = req.body.challenge_name
            const challenge = req.body.challenge;
            const creator_id = req.body.user_id;
            const skillpoints = req.body.skillpoints;
            const challengeId = await challengeModel.createChallenge(challenge_name, challenge, creator_id, skillpoints);

            responseView.confirmCreated(res, { challenge_id: challengeId, challenge_name, challenge, creator_id, skillpoints }, 'Challenge created successfully');
        } catch (err){
        responseView.sendError(res, 'Failed to create challenge', err);
        }
    },

    /* Retrieve all challenges */
    async listChallenges(req, res) {
        try {
            const challenges = await challengeModel.getAllChallenges();
            responseView.sendSuccess(res, challenges);
        } catch (err) {
            responseView.sendError(res, 'Failed to fetch challenges', err);
        }
    },

    /* Change information on a challenge */
    async updateChallenge(req, res) {
        try {
        var challengeList = await challengeModel.getAllChallenges();

        var challenge_nonExistence = true;

        for (var i=0;i<challengeList.length;i++) {
            if (challengeList[i].challenge_id == req.params.challenge_id) {
                challenge_nonExistence = false;
                break
            }
        };

        if(challenge_nonExistence) {
            responseView.NotFound(res, 'challenge_id does not exist')
            return;
        };

        if (req.body.user_id == undefined || req.body.challenge == undefined || req.body.skillpoints == undefined) {
            responseView.BadRequest(res, 'Missing challenge, skillpoints or user_id.')
            return;
        }

        var differentCreator = true

        for (var i=0;i<challengeList.length;i++) {
            if (challengeList[i].challenge_id == req.params.challenge_id) {
                if (challengeList[i].creator_id == req.body.user_id) {
                    differentCreator = false;
                    break;
                }
            }
        };

        if(differentCreator) {
            responseView.Forbidden(res, 'Not correct creator')
            return;
        };

            const creator_id = req.body.user_id;
            const challenge_name = req.body.challenge_name
            const challenge = req.body.challenge;
            const skillpoints = req.body.skillpoints;

            await challengeModel.updateChallenge(req.params.challenge_id, challenge_name, challenge, creator_id, skillpoints);
            responseView.sendSuccess(res, {id: req.params.challenge_id, challenge_name, challenge, creator_id, skillpoints}, 'Challenge updated successfully');
        } catch (err) {
            responseView.sendError(res, 'Failed to update challenge', err);
        }
    },

    async deleteChallenge(req, res) {
        try {
            var challengeList = await challengeModel.getAllChallenges();

            var challenge_nonExistence = true;

            for (var i=0;i<challengeList.length;i++) {
                if (challengeList[i].challenge_id == req.params.challenge_id) {
                    challenge_nonExistence = false;
                    break
                }
            };

            if(challenge_nonExistence) {
                responseView.NotFound(res, 'challenge_id does not exist')
                return;
            };

            await challengeModel.deleteChallenge(req.params.challenge_id);
            responseView.noContent(res, null)
        } catch (err) {
            responseView.sendError(res, 'Failed to delete challenge', err);
        }
    },

    /* complete challenge and record it down in usercompletion */
    async completeChallenge(req, res) {
        try {
            var challengeList = await challengeModel.getAllChallenges();
            var userList = await userModel.getAllUsers();

            var checkUser = true
            var checkChallenge = true
            for (var i=0;i<userList.length;i++) {
                if (userList[i].user_id == req.body.user_id) {
                    checkUser = false;
                    break;
                }
            };

            for (var i=0;i<challengeList.length;i++) {
                if (challengeList[i].challenge_id == req.params.challenge_id) {
                    checkChallenge = false;
                    break;
                }
            }

            if(checkUser || checkChallenge) {
                responseView.NotFound(res, 'user_id or challenge_id does not exist');
                return;
            }

            for (var i=0;i<userList.length;i++) {
                if (userList[i].user_id == req.body.user_id) {
                    var username = userList[i].username;
                    var skillpoints = userList[i].skillpoints;
                    break;
                }
            }

            for (var i=0;i<challengeList.length;i++) {
                if (challengeList[i].challenge_id == req.params.challenge_id) {
                    var challenge_skillpoints = challengeList[i].skillpoints;
                    break;
                }
            }

            if (!req.body.completed) {
                await userModel.updateUser(req.body.user_id, username, skillpoints+5);
            }
            else {
                await userModel.updateUser(req.body.user_id, username, skillpoints+challenge_skillpoints);
            }

            const challenge_id = parseInt(req.params.challenge_id);
            const user_id = req.body.user_id;
            const challenge_name = req.body.challenge_name
            const challenge = req.body.challenge
            const completed = req.body.completed;
            const notes = '';
    
            const completeId = await challengeModel.completeChallenge(challenge_id, user_id, challenge_name, challenge, completed, notes);
            responseView.confirmCreated(res, {complete_id: completeId, challenge_id, user_id, challenge_name, challenge, completed, notes}, 'Challenge attempted')
        } catch(err) {
            responseView.sendError(res, 'Failed to attempt challenge', err)
        }
    },

    /* Get all challenge attempted */
    async getChallengeById(req, res) {
        try {
        const challengeList = await challengeModel.getAllChallenges();
        var checkChallenge = true
        for (var i=0;i<challengeList.length;i++) {
            if (challengeList[i].challenge_id == req.params.challenge_id) {
                checkChallenge = false;
                break;
            }
        }

        if(checkChallenge) {
            responseView.NotFound(res, 'challenge_id does not exist')
            return;
        }

        const challenge_id = req.params.challenge_id;
        const challengeData = await challengeModel.getChallengeById(challenge_id);

        if (challengeData.length === 0) {
            responseView.NotFound(res, `challenge_id ${challenge_id} does not have any user attempts`)
            return;
        }
        responseView.sendSuccess(res, challengeData)
        } catch (err) {
            responseView.sendError(res, 'Failed to get completed challenge', err)
        }
    },

    async getChallengeByChallengeId(req, res) {
        try {
            const challenge_id = req.params.challenge_id

            const challenge = await challengeModel.getChallengeByChallengeId(challenge_id)

            if (challenge.length === 0) {
                return responseView.NotFound(res, 'Challenge not found')
            }

            responseView.sendSuccess(res, challenge)
        } catch (err) {
            responseView.sendError(res, 'Failed to get challenge', err)
        }
    },

    async updateCompletedNote(req, res) {
        try {
            const complete_id = req.params.complete_id
            const notes = req.body.notes

            if (complete_id == undefined) {
                return responseView.BadRequest(res, 'Missing complete_id')
            }

            await challengeModel.addNoteToCompleted(complete_id, notes)
            responseView.noContent(res, null)
        } catch (err) {
            responseView.sendError(res, 'Failed to add note', err)
        }
    }
}