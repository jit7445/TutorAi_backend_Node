/**
 * Health Check Controller
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getHealth = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the TutorAI Node.js Backend API!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

module.exports = {
  getHealth,
};
