const Customer = require('../models/Customer');
const User = require('../models/User')
exports.createCustomer = async (req, res, next) => {
  try {
    console.log(req.body)
    
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().populate('user', 'name');
    res.status(200).json(customers);
  } catch (err) {
    next(err);
  }
};
exports.getCustomerswithoutaccount = async (req, res, next) => {
  try {
    const customerIds = await Customer.distinct('user');
    const users = await User.find({ _id: { $nin: customerIds } });
    res.json(users);
  } catch (error) {
    next(err)
  }
};

// exports.getCustomers = async (req, res, next) => {
//   try {
//   id= req.params.id;
//     const customers = await Customer.findById();
//     res.status(200).json(customers);
//   } catch (err) {
//     next(err);
//   }
// };