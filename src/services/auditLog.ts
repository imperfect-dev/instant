export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'backup' | 'restore' | 'settings' | 'security' | 'admin';
}

export class AuditLogService {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 10000;

  constructor() {
    this.loadLogs();
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.logs.unshift(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.saveLogs();
    this.notifyIfCritical(logEntry);
  }

  getLogs(filters?: {
    userId?: string;
    category?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLogEntry[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filters.category);
      }
      if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.limit) {
        filteredLogs = filteredLogs.slice(0, filters.limit);
      }
    }

    return filteredLogs;
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'User', 'Action', 'Resource', 'Severity', 'Category', 'IP Address'];
      const rows = this.logs.map(log => [
        log.id,
        log.timestamp.toISOString(),
        log.userName,
        log.action,
        log.resource,
        log.severity,
        log.category,
        log.ipAddress
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getClientIP(): string {
    // In a real application, this would be provided by the server
    return '127.0.0.1';
  }

  private notifyIfCritical(entry: AuditLogEntry): void {
    if (entry.severity === 'critical') {
      // In a real application, this would send alerts to administrators
      console.warn('Critical security event:', entry);
    }
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('audit_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }
  }

  private loadLogs(): void {
    try {
      const saved = localStorage.getItem('audit_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.logs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  }
}

export const auditLog = new AuditLogService();