const Feature = require('../models/Features');

exports.createFeature = async (req, res) => {
    // admin check
    const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
    if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
    }

    const { name } = req.body;

    // Validate fields
    if (!name) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const feature = await Feature.create({ name });
        console.log("Feature created:", feature);
        res.status(201).json({ feature });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getAllFeatures = async (req, res) => {
    try {
        const features = await Feature.find();
        res.status(200).json({ features });
    } catch (error) {
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

exports.getFeatureById = async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);
        if (!feature) return res.status(404).json({ message: "Feature not found" });

        res.status(200).json({ feature });
    } catch (error) {
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

exports.updateFeature = async (req, res) => {
    // admin check
    const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
    if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
    }

    const { name } = req.body;

    try {
        const feature = await Feature.findByIdAndUpdate(
            req.params.id,
            { name },
            { returnDocument: 'after', runValidators: true }
        );
        if (!feature) return res.status(404).json({ message: "Feature not found" });

        res.status(200).json({ feature });
    } catch (error) {
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

exports.deleteFeature = async (req, res) => {
    // admin check
    const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
    if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
    }

    try {
        const feature = await Feature.findByIdAndDelete(req.params.id);
        if (!feature) return res.status(404).json({ message: "Feature not found" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};
