const userModel = require('../models/userModel');
const responseView = require('../views/responseView');
 
module.exports = {
  /* Fetches a list of all users and returns them in the response */
  async listUsers(req, res) {
    try {
      const users = await userModel.getAllUsers();
      responseView.sendSuccess(res, users);
    } catch (err) {
      responseView.sendError(res, 'Failed to fetch user', err);
    }
  },

  /* Creates a new user if the username is unique */
  async createUser(req, res, next) {

    try {
    if (req.body.username == undefined) {
      responseView.BadRequest(res, 'Missing username');
      return;
    }

    if (req.body.email == undefined) {
      responseView.BadRequest(res, 'Missing email');
      return;
    }

    if (req.body.password == undefined) {
      responseView.BadRequest(res, 'Missing password');
      return;
    }

    let users = await userModel.getAllUsers();
    const username = req.body.username;
    const email = req.body.email
    const password = res.locals.hash
    const skillpoints = 0;

    var check = false;

    for (var i=0;i<users.length;i++) {
        if (users[i].username.toLowerCase() == req.body.username.toLowerCase()) {
            check = true;
            break;
        }
    }

    if(check) {
        return responseView.Conflict(res, 'Username already associated with another user')
    }

    var emailCheck = false;

    for (var i=0;i<users.length;i++) {
      if (users[i].email.toLowerCase() == req.body.email.toLowerCase()) {
        emailCheck = true;
        break;
      }
    }

    if(emailCheck) {
      return responseView.Conflict(res, 'Email already associated with another user')
    }

    const userId = await userModel.createUser(username, email, password, skillpoints);

    next()
    } catch (err) {
      responseView.sendError(res, 'Failed to create user', err);
    }
  },

  /* Fetches a user by ID and returns the user's details */
  async getUser(req, res) {
    try {
      const user = await userModel.getUserById(req.params.id);
      if (!user) {
        responseView.sendError(res, 'User not found', null, 404);
        return;
      }
      responseView.sendSuccess(res, user);
    } catch (err) {
      responseView.sendError(res, 'Failed to fetch user', err);
    }
  },

  /* Updates user information (username and skillpoints) if the user exists 
  and the username is not taken by another user */
  async updateUser(req, res) {
    try {
    const { username, skillpoints } = req.body;
    let users = await userModel.getAllUsers();
    var user_nonExistence = true;

    for (var i=0;i<users.length;i++) {
        if (users[i].user_id == req.params.id) {
            user_nonExistence = false;
            break
        }
    };

    if(user_nonExistence) {
        responseView.NotFound(res, 'user_id does not exist')
        return;
    };

    var check = false;
    
    for (var i=0;i<users.length;i++) {
        if (users[i].user_id == req.params.id) {
          continue;
        }else if (users[i].username.toLowerCase() == username.toLowerCase()) {
            check = true;
            break;
        }
    };

    if(check) {
        responseView.Conflict(res, 'Username already associated with another user')
        return;
    };
      await userModel.updateUser(req.params.id, username, skillpoints);
      responseView.sendSuccess(res, {id: req.params.id, username, skillpoints}, 'User updated successfully');
    } catch (err) {
      responseView.sendError(res, 'Failed to update user', err);
    }
  },
  
  /* Deletes a user by ID and sends a success response */
  async deleteUser(req, res) {
    try {
      await userModel.deleteUser(req.params.id);
      responseView.sendSuccess(res, null, 'User deleted successfully');
    } catch (err) {
      responseView.sendError(res, 'Failed to delete user', err);
    }
  },

  async loginUser(req, res, next) {
    try {
      if (req.body.username == undefined) {
        responseView.BadRequest(res, 'Missing username')
        return;
      }

      else if (req.body.password == undefined) {
        responseView.BadRequest(res, 'Missing password')
        return;
      }

      const username = req.body.username

      const result = await userModel.getUserByUsername(username)

      if (result.length === 0) {
        responseView.NotFound(res, 'User not found')
        return;
      }

      console.log(result[0].password)

      res.locals.hash = result[0].password
      
      console.log(res.locals.hash)

      next()
    } catch (err) {
      responseView.sendError(res, 'Failed to login user')
    }
  },

  async getUserByName(req, res) {
    try {
      const username = req.params.username

      const user = await userModel.getUserByUsername(username)

      if (user.length === 0) {
        return responseView.sendError(res, 'User not found', null, 404);
      }

      responseView.sendSuccess(res, user);
    } catch (err) {
      responseView.sendError(res, 'Failed to fetch user', err);
    }
  },

  async editUserInfo(req, res) {
    try {
      const username = req.body.username
      const email = req.body.email
      const user_id = req.params.user_id

      const userByName = await userModel.getUserByUsername(username)

      if (userByName.length > 0) {
        return responseView.Conflict(res, 'Username is already used')
      }

      const userByEmail = await userModel.getUserByEmail(email) 

      if (userByEmail.length > 0) {
        return responseView.Forbidden(res, 'Email is already used')
      }

      await userModel.updateUserInfo(user_id, username, email)
      responseView.sendSuccess(res, 'Successful')
    } catch (err) {
      responseView.sendError(res, 'Failed to edit user info', err)
    }
  },

  async changePassword(req, res) {
    try {
      const user_id = req.params.user_id
      const password = res.locals.hash

      await userModel.changePassword(user_id, password)
      responseView.sendSuccess(res, 'Successful')
    } catch (err) {
      responseView.sendError(res, 'Failed to change password')
    }
  }
};