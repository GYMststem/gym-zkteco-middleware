const express = require('express');
const router = express.Router();
const { getAttendance, getUsers } = require('../services/zkteco');
const logger = require('../utils/logger');

// 获取所有考勤记录
router.get('/', async (req, res) => {
  try {
    const attendance = await getAttendance();
    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    logger.error(`获取考勤记录失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: '获取考勤记录失败',
      error: error.message
    });
  }
});

// 获取所有用户
router.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error(`获取用户列表失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

// 手动触发同步
router.post('/sync', async (req, res) => {
  try {
    const attendance = await getAttendance();
    // 这里可以添加同步到后端的逻辑
    
    res.status(200).json({
      success: true,
      message: '手动同步成功',
      data: attendance
    });
  } catch (error) {
    logger.error(`手动同步失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: '手动同步失败',
      error: error.message
    });
  }
});

module.exports = router; 