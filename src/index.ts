import dotenv from 'dotenv';
import express, {Request, Response, Express} from 'express';
import cors from 'cors';
import {checkConnection} from './config/database';

dotenv.config();

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  database: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const createApp = (): Express => {
  const app = express();

  //Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};

//Routes
const initializeRoutes = (app: Express): void => {
  app.get('api/health', async (_req: Request, res: Response<HealthResponse>) => {
    try {
      const response: HealthResponse = {
        status: 'OK',
        message: 'Backend для сайта художественной гимнастики работает',
        timestamp: new Date().toISOString(),
        database: 'connected'
      };

      res.json(response);
    } catch (e) {
      const response: HealthResponse = {
        status: 'WARNING',
        message: 'Backend работает, но есть проблемы с БД',
        timestamp: new Date().toISOString(),
        database: 'disconnected'
      };

      res.status(503).json(response);
    }
  })

  app.post('api/echo', (req: Request, res: Response) => {
    res.json({
      received: req.body,
      timestamp: new Date().toISOString(),
    })
  })
};

//Errors init
const initializeErrorHandling = (app: Express): void => {
  app.use('*', (req: Request, res: Response<ErrorResponse>) => {
    res.status(404).json({
      error: 'Маршрут не найден',
      details: `Запрошенный путь: ${req.originalUrl}`
    });
  });

  app.use((err: Error, _req: Request, res: Response<ErrorResponse>) => {
    console.error('Ошибка сервера:', err);

    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
};

//Start
const startServer = (app: Express): void => {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📡 Проверка здоровья: http://localhost:${PORT}/api/health`);
  })
};

const initializeApp = async (): Promise<void> => {
  try {
    console.log('🔧 Инициализация приложения...');
    const dbConnected = await checkConnection();

    if (!dbConnected) {
      console.log('⚠️  Предупреждение: Не удалось подключиться к БД');
    }
    const app = createApp();
    initializeRoutes(app);
    initializeErrorHandling(app);
    startServer(app);

  } catch (error) {
    console.error('❌ Не удалось запустить приложение:', error);
    process.exit(1);
  }
};

initializeApp();

export { createApp, initializeRoutes, initializeErrorHandling };