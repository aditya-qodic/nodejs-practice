import User from '../models/userModel.js';

export const createUser = async (userData) => {
    return await User.create(userData);
};

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const findUserById = async (id) => {
    return await User.findById(id);
};

export const findAllUsers = async (filter = {}) => {
    return await User.find(filter);
};

export const updateUserById = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

export const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
};
