const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupZKTeco } = require('./services/zkteco');
const attendanceRoutes = require('./controllers/attendance');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/attendance', attendanceRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ZKTeco中间件运行正常' });
});

// 启动服务器
app.listen(PORT, async () => {
  console.log(`ZKTeco中间件服务运行在端口 ${PORT}`);
  
  // 尝试连接ZKTeco设备
  try {
    await setupZKTeco();
    console.log('ZKTeco设备连接成功');
  } catch (error) {
    console.error('ZKTeco设备连接失败:', error.message);
  }
}); 