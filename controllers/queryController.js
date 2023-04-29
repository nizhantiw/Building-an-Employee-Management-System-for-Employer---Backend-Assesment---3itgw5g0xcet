const Employee = require('../models/employeeModel');

// should return paginated employees
const getPaginatedEmployees = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const employees = await Employee.find()
      .sort({ salary: 1 })
      .skip(skip)
      .limit(limit);

    const count = await Employee.countDocuments();

    res.status(200).json({ employees, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// should delete all employees with a salary greater than 10000
const deleteEmployeesWithSalaryGreaterThan10000 = async (req, res) => {
  try {
    const result = await Employee.deleteMany({ salary: { $gt: 10000 } });
    const count = result.deletedCount;

    if (count === 0) {
      return res.status(404).json({ error: 'No employees found to delete' });
    }

    res.status(200).json({ message: `Deleted ${count} employees` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /employees should create a new employee
const createEmployee = async (req, res) => {
  try {
    const { name, salary } = req.body;

    if (!name || !salary) {
      return res.status(400).json({ error: 'Name and salary are required' });
    }

    const employee = new Employee({ name, salary });
    await employee.save();

    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /employee/id should return the employee with the specified id
// should return an error when the specified employee does not exist
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// should update employee details and if employee return 404
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { name, salary },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getPaginatedEmployees,
  deleteEmployeesWithSalaryGreaterThan10000,
  createEmployee,
  getEmployeeById,
  updateEmployee,
};
