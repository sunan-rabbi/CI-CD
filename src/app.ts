import express, { Application, Request, Response } from 'express';

const app: Application = express();


app.get('/', async (req: Request, res: Response) => {
  try {


    res.status(200).json({
      message: 'Hello from Custom Server - Sunan',
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });

  } catch (error) {

    res.status(503).json({
      message: 'Error occurs',
      status: 'UNHEALTHY',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

  }
});


export default app;
