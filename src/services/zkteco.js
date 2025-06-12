const ZKLib = require('node-zklib');
const { syncAttendanceToBackend } = require('./api');
const logger = require('../utils/logger');

let zkInstance = null;

/**
 * 设置并连接ZKTeco设备
 */
async function setupZKTeco() {
  try {
    const { ZK_IP, ZK_PORT, ZK_INBOUND_SPEED, ZK_TIMEOUT } = process.env;
    
    zkInstance = new ZKLib({
      ip: ZK_IP || '192.168.1.201',
      port: ZK_PORT || 4370,
      inport: ZK_INBOUND_SPEED || 5200,
      timeout: ZK_TIMEOUT || 5000
    });

    await zkInstance.connect();
    logger.info('ZKTeco设备连接成功');
    
    // 设置实时事件监听
    setupRealtimeEvents();
    
    return true;
  } catch (error) {
    logger.error(`ZKTeco设备连接失败: ${error.message}`);
    throw error;
  }
}

/**
 * 设置实时事件监听
 */
function setupRealtimeEvents() {
  if (!zkInstance) {
    logger.error('ZKTeco实例未初始化，无法设置事件监听');
    return;
  }
  
  zkInstance.on('attendance', async (attendanceData) => {
    logger.info(`收到考勤数据: ${JSON.stringify(attendanceData)}`);
    
    try {
      await syncAttendanceToBackend(attendanceData);
    } catch (error) {
      logger.error(`同步考勤数据到后端失败: ${error.message}`);
    }
  });
}

/**
 * 获取所有考勤记录
 */
async function getAttendance() {
  if (!zkInstance) {
    throw new Error('ZKTeco实例未初始化');
  }
  
  try {
    const attendance = await zkInstance.getAttendance();
    return attendance;
  } catch (error) {
    logger.error(`获取考勤记录失败: ${error.message}`);
    throw error;
  }
}

/**
 * 获取所有用户
 */
async function getUsers() {
  if (!zkInstance) {
    throw new Error('ZKTeco实例未初始化');
  }
  
  try {
    const users = await zkInstance.getUsers();
    return users;
  } catch (error) {
    logger.error(`获取用户列表失败: ${error.message}`);
    throw error;
  }
}

/**
 * 断开ZKTeco设备连接
 */
async function disconnect() {
  if (zkInstance) {
    try {
      await zkInstance.disconnect();
      zkInstance = null;
      logger.info('ZKTeco设备已断开连接');
    } catch (error) {
      logger.error(`断开ZKTeco设备连接失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = {
  setupZKTeco,
  getAttendance,
  getUsers,
  disconnect
}; 