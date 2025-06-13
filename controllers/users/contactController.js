const Contact = require('../../models/users/Contact');
const errorHandler = require('../../utils/errorHandler');
const { STATUS, MESSAGES } = require('../../constants/APIMessages');


const CustomError = require('../../utils/customError_V1');
const asyncHandler = require('../../utils/asyncHandler_V1');

// Get all contacts created by the user
// exports.getAllUserContacts = async (req, res, next) => {
//     try {
//         const userId = req.user.Id;
//         const contacts = await Contact.find({ createdBy: userId }).populate('createdBy', 'name');

//         if (!contacts || contacts.length === 0) {
//             return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.CONTACTS_NOT_FOUND });
//         }
//         res.status(STATUS.OK).json(contacts);
//     } catch (err) {
//         next(new errorHandler(MESSAGES.ERROR_FETCH_CONTACTS, STATUS.BAD_REQUEST));
//     }
// };

exports.getAllUserContacts = asyncHandler(async (req, res, next) => {
    const userId = req.user.Id;
    const contacts = await Contact.find({ createdBy: userId }).populate('createdBy', 'name');
    if (!contacts || contacts.length === 0) {
        return res.status(STATUS.OK).json({ success: true, data: null });
        // return next(new CustomError(MESSAGES.CONTACTS_NOT_FOUND, STATUS.NOT_FOUND));
    }
    res.status(STATUS.OK).json({ success: true, data: contacts });
});

exports.createUserContact = asyncHandler(async (req, res, next) => {
    const { name, phone, whatsapp, email, company, position, notes, favorite, tags } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
        return next(new CustomError('Contact name is required', STATUS.BAD_REQUEST));
    }

    if (!phone && !email) {
        return next(new CustomError('Either phone number or email is required', STATUS.BAD_REQUEST));
    }

    const duplicateQuery = { createdBy: req.user.Id };
    const orConditions = [];

    if (email) orConditions.push({ email: email.toLowerCase() });
    if (phone) orConditions.push({ phone });

    if (orConditions.length > 0) {
        duplicateQuery.$or = orConditions;

        const existingContact = await Contact.findOne(duplicateQuery);
        if (existingContact) {
            return next(new CustomError('Contact with this email or phone already exists', STATUS.CONFLICT));
        }
    }

    // Create contact object
    const contactData = {
        name: name.trim(),
        createdBy: req.user.Id,
        favorite: favorite || false
    };

    // Add optional fields
    if (phone) contactData.phone = phone.trim();
    if (whatsapp) contactData.whatsapp = whatsapp.trim();
    if (email) contactData.email = email.toLowerCase().trim();
    if (company) contactData.company = company.trim();
    if (position) contactData.position = position.trim();
    if (notes) contactData.notes = notes.trim();
    if (tags && Array.isArray(tags)) contactData.tags = tags.map(tag => tag.trim());

    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    // Populate the created contact
    await savedContact.populate('createdBy', 'name email');

    res.status(STATUS.CREATED).json({
        success: true,
        message: MESSAGES.CONTACT_CREATED,
    });
});


// Create a new contact
exports.createUserContact2 = async (req, res, next) => {
    // throw new Error("Forced error for testing");
    const { name, phone, whatsapp, email, company, position, notes, favorite, tags } = req.body;
    const contact = new Contact({ name, phone, whatsapp, email, company, position, notes, favorite, tags, createdBy: req.user.Id });
    try {
        await contact.save();
        res.status(STATUS.CREATED).json({ message: MESSAGES.CONTACT_CREATED });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_CREATE_CONTACT, STATUS.BAD_REQUEST));
    }
};

// Update a contact
exports.updateUserContact = async (req, res, next) => {
    try {
        const updatedContact = await Contact.findOneAndUpdate(
            { _id: req.params.Id, createdBy: req.user.Id },
            req.body,
            { new: true }
        );

        if (!updatedContact) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.CONTACTS_NOT_FOUND });
        }

        res.status(STATUS.OK).json({ success: true, message: MESSAGES.CONTACT_UPDATED, });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_UPDATE_CONTACT, STATUS.BAD_REQUEST));
    }
};

// Delete a contact
exports.deleteUserContact = async (req, res, next) => {
    try {
        const deletedContact = await Contact.findOneAndDelete({ _id: req.params.Id, createdBy: req.user.Id });

        if (!deletedContact) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.CONTACTS_NOT_FOUND });
        }
        res.status(STATUS.OK).json({ success: true, message: MESSAGES.CONTACT_DELETED });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_DELETE_CONTACT, STATUS.BAD_REQUEST));
    }
};
