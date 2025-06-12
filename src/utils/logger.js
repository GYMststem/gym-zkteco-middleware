const winston = require('winston');
const path = require('path');

// 定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// 创建日志目录
const logDir = path.join(__dirname, '../../logs');

// 创建Winston日志记录器
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // 控制台输出
    new winston.transports.Console(),
    
    // 信息级别日志文件
    new winston.transports.File({ 
      filename: path.join(logDir, 'info.log'),
      level: 'info' 
    }),
    
    // 错误级别日志文件
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'),
      level: 'error' 
    })
  ]
});

module.exports = logger; 