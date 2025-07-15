const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');

// Get all policies
router.get('/', async (req, res) => {
  try {
    const policies = await Policy.find({ status: 'active' })
      .select('name provider uin metadata clauseCount')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: policies
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policies',
      error: error.message
    });
  }
});

// Get specific policy by ID
router.get('/:id', async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policy',
      error: error.message
    });
  }
});

// Search policies by text
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const policies = await Policy.find({
      $and: [
        { status: 'active' },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { provider: { $regex: query, $options: 'i' } },
            { 'clauses.text': { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('name provider uin clauses');

    res.json({
      success: true,
      data: policies
    });
  } catch (error) {
    console.error('Error searching policies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search policies',
      error: error.message
    });
  }
});

module.exports = router;