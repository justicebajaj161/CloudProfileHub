const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({ 
        success: true, 
        users,
        count: users.length 
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch users' 
      });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      res.json({ 
        success: true, 
        user 
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user' 
      });
    }
  },

  // Create new user
  async createUser(req, res) {
    try {
      const { name, email, bio } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name and email are required' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          error: 'User with this email already exists' 
        });
      }

      const newUser = await User.create({ name, email, bio });
      
      // Log activity
      await ActivityLog.create({
        user_id: newUser.id,
        action: 'USER_CREATED',
        details: { name, email }
      });

      res.status(201).json({ 
        success: true, 
        user: newUser 
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create user' 
      });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      const updatedUser = await User.update(id, updateData);
      
      // Log activity
      await ActivityLog.create({
        user_id: id,
        action: 'USER_UPDATED',
        details: updateData
      });

      res.json({ 
        success: true, 
        user: updatedUser 
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update user' 
      });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      await User.delete(id);

      res.json({ 
        success: true, 
        message: 'User deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete user' 
      });
    }
  }
};

module.exports = userController;