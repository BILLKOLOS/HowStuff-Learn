const ParentChildAccount = require('../models/ParentChildAccount');
const User = require('../models/User'); // Assuming you have a 'User' model

const ParentChildAccountService = {};

// Link parent and child account
ParentChildAccountService.linkParentChild = async (parentId, childId, accountType, relationshipType, permissions) => {
    try {
        // Ensure both parent and child exist
        const parent = await User.findById(parentId);
        const child = await User.findById(childId);

        if (!parent || !child) {
            throw new Error('Parent or child not found');
        }

        // Check if a link already exists
        const existingLink = await ParentChildAccount.findOne({ parentId, childId });
        if (existingLink) {
            throw new Error('Parent-child link already exists');
        }

        // Create new link
        const newLink = new ParentChildAccount({
            parentId,
            childId,
            accountType,
            relationshipType,
            permissions
        });

        await newLink.save();
        return { success: true, message: 'Parent and child linked successfully' };
    } catch (error) {
        throw new Error(`Error linking parent and child: ${error.message}`);
    }
};

// Fetch linked children for a parent
ParentChildAccountService.getChildrenForParent = async (parentId) => {
    try {
        const parentChildLinks = await ParentChildAccount.find({ parentId }).populate('childId', 'name progress');
        if (!parentChildLinks.length) {
            throw new Error('No linked children found for this parent');
        }

        // Return linked children data
        return parentChildLinks.map(link => link.childId);
    } catch (error) {
        throw new Error(`Error fetching children: ${error.message}`);
    }
};

// Unlink parent and child
ParentChildAccountService.unlinkParentChild = async (parentId, childId) => {
    try {
        const link = await ParentChildAccount.findOne({ parentId, childId });
        if (!link) {
            throw new Error('Parent-child link not found');
        }

        await link.remove();
        return { success: true, message: 'Parent and child unlinked successfully' };
    } catch (error) {
        throw new Error(`Error unlinking parent and child: ${error.message}`);
    }
};

module.exports = ParentChildAccountService;
