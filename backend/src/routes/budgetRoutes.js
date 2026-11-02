const express = require('express');
const router = express.Router();
const {
  getBudgets,
  setBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

// All budget routes are protected with JWT
router.use(protect);

router.route('/').get(getBudgets).post(setBudget);
router.route('/:id').delete(deleteBudget);

module.exports = router;
