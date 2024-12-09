const mongoose = require('mongoose');
const UserSchema = require('./user.schema').UserSchema;

const UserModel = mongoose.model('User', UserSchema);

async function createUser(userData) {
    try {
        console.log('Creating user in database:', userData);
        const newUser = new UserModel(userData);
        const savedUser = await newUser.save();
        console.log('User saved successfully:', savedUser);
        return savedUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function findUserByUsername(username) {
    try {
        console.log('Looking for user in database:', username);
        const user = await UserModel.findOne({ username: username });
        console.log('Database query result:', user);
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

async function updateUserDescription(userId, newDescription) {
    try {
        console.log('Updating user description in database:', userId, newDescription);
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { description: newDescription },
            { new: true }
        );
        console.log('User description updated successfully:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user description:', error);
        throw error;
    }
}

// Debug function to check database contents
async function getAllUsers() {
    try {
        const users = await UserModel.find({});
        console.log('All users in database:', users);
        return users;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
}

module.exports = {
    UserModel,
    createUser,
    findUserByUsername,
    updateUserDescription,
    getAllUsers
};