const axios = require('axios');
const logger = require('../utils/logger');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

/**
 * 同步考勤数据到后端
 * @param {Object} attendanceData - 从ZKTeco设备获取的考勤数据
 */
async function syncAttendanceToBackend(attendanceData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/attendance/sync`, {
      attendance: attendanceData
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });
    
    logger.info(`考勤数据同步成功: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`考勤数据同步失败: ${error.message}`);
    throw error;
  }
}

/**
 * 获取会员信息
 * @param {string} memberId - 会员ID
 */
async function getMemberInfo(memberId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/members/${memberId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error(`获取会员信息失败: ${error.message}`);
    throw error;
  }
}

/**
 * 同步用户数据到ZKTeco设备
 */
async function syncUsersToDevice() {
  try {
    const response = await axios.get(`${API_BASE_URL}/members/for-device`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error(`获取用户数据失败: ${error.message}`);
    throw error;
  }
}

module.exports = {
  syncAttendanceToBackend,
  getMemberInfo,
  syncUsersToDevice
}; 