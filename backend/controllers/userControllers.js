const User = require("../models/Users.js");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
}

// New: admin-only create user (only superAdmin can grant admin/superAdmin)
exports.createUser = async (req, res) => {
    try {
        const isAdminReq = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
        if (!isAdminReq) return res.status(403).json({ message: "Admin access required" });

        const { name, email, password, isAdmin, isSuperAdmin, isActive } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" });
        }

        const userData = { name, email, password, isActive: isActive !== undefined ? isActive : true };

        if (req.user.isSuperAdmin) {
            if (typeof isAdmin !== 'undefined') userData.isAdmin = isAdmin;
            if (typeof isSuperAdmin !== 'undefined') userData.isSuperAdmin = isSuperAdmin;
        }

        const newUser = await User.create(userData);
        const { password: _, ...safeUser } = newUser.toObject();

        res.status(201).json({ user: safeUser });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({
            message: "Server error in createUser",
            error: error.message,
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const isAdminReq = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
        if (!isAdminReq) return res.status(403).json({ message: "Admin access required" });

        const updates = {};

        // Fields all admins can update
        ['name', 'email', 'isActive'].forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Only super admin can grant/revoke isAdmin or isSuperAdmin
        if (req.user.isSuperAdmin) {
            if (req.body.isAdmin !== undefined) updates.isAdmin = req.body.isAdmin;
            if (req.body.isSuperAdmin !== undefined) updates.isSuperAdmin = req.body.isSuperAdmin;
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent self-demotion: you cannot remove your own admin/superAdmin rights
        if (req.user.id.toString() === req.params.id) {
            if (updates.isAdmin === false || updates.isSuperAdmin === false) {
                return res.status(400).json({
                    message: "You cannot remove your own admin privileges"
                });
            }
        }

        Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });

        await user.save();

        const { password, ...safeUser } = user.toObject();

        res.status(200).json({ user: safeUser });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({
            message: "Server error in updateUser",
            error: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const isAdminReq = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
        if (!isAdminReq) return res.status(403).json({ message: "Admin access required" });

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res
        .status(500)
        .json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const allowedUpdates = ['name', 'email', 'password'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });

        await user.save(); // important for password hashing

        const { password, ...safeUser } = user.toObject();

        res.status(200).json({ user: safeUser });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({
            message: "Server error in updateProfile",
            error: error.message,
        });
    }
};
