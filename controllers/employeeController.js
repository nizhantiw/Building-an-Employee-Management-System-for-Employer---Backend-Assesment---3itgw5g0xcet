const Employee = require('../models/employeeModel');

const getPaginatedEmployees = async (req, res) => {
  try {
    const sort = { salary: 1 };
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const employees = await Employee.find().sort(sort).skip(skip).limit(limit);
    const count = await Employee.countDocuments();

    res.status(200).json({ employees, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteHighSalaryEmployees = async (req, res) => {
  try {
    const result = await Employee.deleteMany({ salary: { $gt: 10000 } });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'No employees found to delete' });
    } else {
      res.status(200).json({ message: 'Employees deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, salary } = req.body;
    if (!firstName || !lastName || !email || !salary) {
      res.status(400).json({ error: 'Missing required fields' });
    } else {
      const employee = new Employee({ firstName, lastName, email, salary });
      await employee.save();
      res.status(201).json({ message: 'Employee created successfully', employee });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.status(200).json({ employee });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateEmployeeById = async (req, res) => {
  try {
    const { firstName, lastName, email, salary } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      employee.firstName = firstName || employee.firstName;
      employee.lastName = lastName || employee.lastName;
      employee.email = email || employee.email;
      employee.salary = salary || employee.salary;
      await employee.save();
      res.status(200).json({ message: 'Employee updated successfully', employee });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getPaginatedEmployees,
  deleteHighSalaryEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployeeById,
};
