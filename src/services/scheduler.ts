export interface ScheduleConfig {
  id: string;
  name: string;
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  time?: string; // HH:MM format
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  backupType: 'full' | 'incremental';
  includePaths: string[];
  excludePaths: string[];
}

export class BackupScheduler {
  private schedules: Map<string, ScheduleConfig> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private onBackupTrigger?: (schedule: ScheduleConfig) => void;

  constructor(onBackupTrigger?: (schedule: ScheduleConfig) => void) {
    this.onBackupTrigger = onBackupTrigger;
    this.loadSchedules();
  }

  addSchedule(config: ScheduleConfig): void {
    this.schedules.set(config.id, config);
    this.saveSchedules();
    
    if (config.enabled) {
      this.scheduleNext(config);
    }
  }

  removeSchedule(id: string): void {
    this.schedules.delete(id);
    this.clearTimer(id);
    this.saveSchedules();
  }

  updateSchedule(config: ScheduleConfig): void {
    this.clearTimer(config.id);
    this.schedules.set(config.id, config);
    this.saveSchedules();
    
    if (config.enabled) {
      this.scheduleNext(config);
    }
  }

  getSchedules(): ScheduleConfig[] {
    return Array.from(this.schedules.values());
  }

  private scheduleNext(config: ScheduleConfig): void {
    const nextRun = this.calculateNextRun(config);
    const delay = nextRun.getTime() - Date.now();
    
    if (delay > 0) {
      const timer = setTimeout(() => {
        this.onBackupTrigger?.(config);
        this.scheduleNext(config); // Schedule the next run
      }, delay);
      
      this.timers.set(config.id, timer);
    }
  }

  private calculateNextRun(config: ScheduleConfig): Date {
    const now = new Date();
    const next = new Date(now);
    
    switch (config.frequency) {
      case 'hourly':
        next.setHours(next.getHours() + 1, 0, 0, 0);
        break;
        
      case 'daily':
        if (config.time) {
          const [hours, minutes] = config.time.split(':').map(Number);
          next.setHours(hours, minutes, 0, 0);
          if (next <= now) {
            next.setDate(next.getDate() + 1);
          }
        } else {
          next.setDate(next.getDate() + 1);
        }
        break;
        
      case 'weekly':
        if (config.dayOfWeek !== undefined) {
          const daysUntilTarget = (config.dayOfWeek - next.getDay() + 7) % 7;
          next.setDate(next.getDate() + (daysUntilTarget || 7));
        } else {
          next.setDate(next.getDate() + 7);
        }
        if (config.time) {
          const [hours, minutes] = config.time.split(':').map(Number);
          next.setHours(hours, minutes, 0, 0);
        }
        break;
        
      case 'monthly':
        if (config.dayOfMonth) {
          next.setDate(config.dayOfMonth);
          if (next <= now) {
            next.setMonth(next.getMonth() + 1);
          }
        } else {
          next.setMonth(next.getMonth() + 1);
        }
        if (config.time) {
          const [hours, minutes] = config.time.split(':').map(Number);
          next.setHours(hours, minutes, 0, 0);
        }
        break;
    }
    
    return next;
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private saveSchedules(): void {
    localStorage.setItem('backup_schedules', JSON.stringify(Array.from(this.schedules.entries())));
  }

  private loadSchedules(): void {
    const saved = localStorage.getItem('backup_schedules');
    if (saved) {
      try {
        const entries = JSON.parse(saved);
        this.schedules = new Map(entries);
        
        // Restart enabled schedules
        for (const config of this.schedules.values()) {
          if (config.enabled) {
            this.scheduleNext(config);
          }
        }
      } catch (error) {
        console.error('Failed to load schedules:', error);
      }
    }
  }
}