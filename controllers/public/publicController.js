const Account = require("../../models/account/Account");
const Transaction = require("../../models/account/Transaction");
const User = require('../../models/users/User');
const { STATUS, MESSAGES, } = require("../../constants/auth");
const ErrorHandler = require("../../utils/errorHandler");
const { v4: uuidv4 } = require('uuid');
const SessionToken = require("../../models/auth/SessionToken");
const { sendWhatsAppMessage, sendSMSMessage } = require("../../services/whatsappService");

exports.genrateSessionToken = async (req, res, next) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.ACCOUNT_REQUIRED });
    }

    const customer = await Account.findById(customerId);
    if (!customer) {
      return res
        .status(STATUS.NOTFOUND)
        .json({ message: MESSAGES.ACCOUNT_NOTFOUND });
    }

    // Create a unique session token ID
    const sessionTokenId = uuidv4();

    // Store the session token ID in the database
    const sessionToken = new SessionToken({
      tokenId: sessionTokenId,
      customerId,
      userId: customer.user,
      createdAt: new Date(),
    });

    const savedSessionToken = await sessionToken.save();
    const TokenId = savedSessionToken._id;
    res.json({ TokenId });
  } catch (err) {
    next(new ErrorHandler(err, STATUS.SERVER_ERROR));
  }
};

exports.genrateSessionTokenSMS = async (req, res, next) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.ACCOUNT_REQUIRED });
    }

    const customer = await Account.findById(customerId);
    if (!customer) {
      return res.status(STATUS.NOTFOUND).json({ message: MESSAGES.ACCOUNT_NOTFOUND });
    }

    // Create a unique session token ID
    const sessionTokenId = uuidv4();

    // Store the session token ID in the database
    const sessionToken = new SessionToken({
      tokenId: sessionTokenId,
      customerId,
      userId: customer.user,
      createdAt: new Date(),
    });

    const savedSessionToken = await sessionToken.save();
    const TokenId = savedSessionToken._id;

    const phoneNumber = '+919664759611';
    const shareUrl = `${process.env.APPURL}account/${TokenId}`;
    const messageText = `🎉 Great news! Your account statement is ready! 🏦\n\nClick the link below to view your statement:\n\n🔗 ${shareUrl}\n\nWe appreciate your trust in us! Thank you for banking with us! 😊`;

    // Send WhatsApp OR SMS message
    const response = await sendWhatsAppMessage(phoneNumber, messageText);
    //const response = await sendSMSMessage(phoneNumber, messageText);

    if (response.success) {
      return res.status(STATUS.OK).json({ success: true, TokenId, whatsappMessageSid: response.sid, });
    }
    else {
      return res.status(STATUS.OK).json({ success: true, TokenId, whatsappStatus: 'failed', });
    }
  } catch (err) {
    console.log(err)
    next(new ErrorHandler(err, STATUS.SERVER_ERROR));
  }
};

exports.verifySessionToken = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_MISSING });
    }

    // Check the database for the session token ID
    const session = await SessionToken.findById(sessionId);
    if (!session) {
      return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_MISSING });
    }

    const customerId = session.customerId;
    const transactions = await Transaction.find({ customer: customerId }).sort({ createdAt: 1 });

    let balance = 0;
    const formattedTransactions = [];

    for (const transaction of transactions) {
      if (transaction.type === "withdrawal") {
        balance -= transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: transaction.amount,
          credit: null,
          balance,
        });
      } else if (transaction.type === "deposit") {
        balance += transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: null,
          credit: transaction.amount,
          balance,
        });
      }
    }

    const reversedTransactions = formattedTransactions.reverse();

    const userId = session.userId;
    const user = await User.findById(userId).select('name email -_id');
    const publicdata = {
      transactionsData: reversedTransactions,
      userdata: user,
    };
    res.status(200).json({ message: 'Success', data: publicdata });
  } catch (err) {
    next(new ErrorHandler(err, STATUS.SERVER_ERROR));
  }
};