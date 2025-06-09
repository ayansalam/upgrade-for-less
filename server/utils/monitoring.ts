import { logger } from './logger';

interface HealthMetrics {
  uptime: number;
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  activeConnections: number;
  lastError?: {
    message: string;
    timestamp: number;
  };
}

class MonitoringService {
  private static instance: MonitoringService;
  private metrics: HealthMetrics;
  private startTime: number;
  private activeConnections: number;

  private constructor() {
    this.startTime = Date.now();
    this.activeConnections = 0;
    this.metrics = {
      uptime: 0,
      responseTime: 0,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      activeConnections: 0,
    };

    // Start periodic metrics collection
    this.startMetricsCollection();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private startMetricsCollection() {
    setInterval(() => {
      this.collectMetrics();
    }, 60000); // Collect metrics every minute
  }

  private collectMetrics() {
    try {
      this.metrics = {
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
        responseTime: this.calculateAverageResponseTime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        activeConnections: this.activeConnections,
      };

      // Log metrics
      logger.info('System metrics collected', {
        metrics: this.metrics,
      });

      // Check for memory leaks
      this.checkMemoryUsage();

      // Check CPU usage
      this.checkCpuUsage();
    } catch (error) {
      logger.error('Error collecting metrics', { error });
    }
  }

  private calculateAverageResponseTime(): number {
    // Implement your response time calculation logic here
    // This could involve tracking request start/end times
    return 0;
  }

  private checkMemoryUsage() {
    const heapUsed = this.metrics.memoryUsage.heapUsed;
    const heapTotal = this.metrics.memoryUsage.heapTotal;
    const memoryUsageRatio = heapUsed / heapTotal;

    if (memoryUsageRatio > 0.9) {
      logger.warn('High memory usage detected', {
        heapUsed,
        heapTotal,
        ratio: memoryUsageRatio,
      });
    }
  }

  private checkCpuUsage() {
    const cpuUsage = this.metrics.cpuUsage;
    const totalCpuTime = cpuUsage.user + cpuUsage.system;
    const cpuUsagePercent = (totalCpuTime / 1000000); // Convert to seconds

    if (cpuUsagePercent > 80) {
      logger.warn('High CPU usage detected', {
        cpuUsage,
        usagePercent: cpuUsagePercent,
      });
    }
  }

  public trackRequest() {
    this.activeConnections++;
  }

  public trackResponse() {
    this.activeConnections--;
  }

  public trackError(error: Error) {
    this.metrics.lastError = {
      message: error.message,
      timestamp: Date.now(),
    };

    logger.error('Application error tracked', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }

  public getMetrics(): HealthMetrics {
    return {
      ...this.metrics,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  public getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, any>;
  } {
    const memoryUsageRatio = this.metrics.memoryUsage.heapUsed / this.metrics.memoryUsage.heapTotal;
    const cpuUsage = (this.metrics.cpuUsage.user + this.metrics.cpuUsage.system) / 1000000;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    const issues: string[] = [];

    // Check memory usage
    if (memoryUsageRatio > 0.9) {
      status = 'degraded';
      issues.push('High memory usage');
    }

    // Check CPU usage
    if (cpuUsage > 80) {
      status = 'degraded';
      issues.push('High CPU usage');
    }

    // Check active connections
    if (this.activeConnections > 1000) {
      status = 'degraded';
      issues.push('High number of active connections');
    }

    // Check recent errors
    if (this.metrics.lastError && Date.now() - this.metrics.lastError.timestamp < 300000) {
      status = 'degraded';
      issues.push('Recent error occurred');
    }

    return {
      status,
      details: {
        uptime: this.metrics.uptime,
        memoryUsage: {
          used: this.metrics.memoryUsage.heapUsed,
          total: this.metrics.memoryUsage.heapTotal,
          ratio: memoryUsageRatio,
        },
        cpuUsage: {
          user: this.metrics.cpuUsage.user,
          system: this.metrics.cpuUsage.system,
          total: cpuUsage,
        },
        activeConnections: this.activeConnections,
        lastError: this.metrics.lastError,
        issues,
      },
    };
  }
}

export const monitoring = MonitoringService.getInstance(); 