import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { BackupScheduler, ScheduleConfig } from '../../services/scheduler';
import { useNotifications } from '../../contexts/NotificationContext';

export function BackupSchedulerComponent() {
  const [schedules, setSchedules] = useState<ScheduleConfig[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleConfig | null>(null);
  const [scheduler] = useState(() => new BackupScheduler((schedule) => {
    addNotification({
      type: 'info',
      message: `Scheduled backup "${schedule.name}" started`
    });
  }));
  const { addNotification } = useNotifications();

  useEffect(() => {
    setSchedules(scheduler.getSchedules());
  }, [scheduler]);

  const handleCreateSchedule = (config: Omit<ScheduleConfig, 'id'>) => {
    const newSchedule: ScheduleConfig = {
      ...config,
      id: Date.now().toString()
    };
    
    scheduler.addSchedule(newSchedule);
    setSchedules(scheduler.getSchedules());
    setShowCreateModal(false);
    
    addNotification({
      type: 'success',
      message: 'Backup schedule created successfully'
    });
  };

  const handleUpdateSchedule = (config: ScheduleConfig) => {
    scheduler.updateSchedule(config);
    setSchedules(scheduler.getSchedules());
    setEditingSchedule(null);
    
    addNotification({
      type: 'success',
      message: 'Backup schedule updated successfully'
    });
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      scheduler.removeSchedule(id);
      setSchedules(scheduler.getSchedules());
      
      addNotification({
        type: 'info',
        message: 'Backup schedule deleted'
      });
    }
  };

  const handleToggleSchedule = (schedule: ScheduleConfig) => {
    const updatedSchedule = { ...schedule, enabled: !schedule.enabled };
    scheduler.updateSchedule(updatedSchedule);
    setSchedules(scheduler.getSchedules());
    
    addNotification({
      type: 'info',
      message: `Schedule ${updatedSchedule.enabled ? 'enabled' : 'disabled'}`
    });
  };

  const getFrequencyText = (schedule: ScheduleConfig) => {
    switch (schedule.frequency) {
      case 'hourly':
        return 'Every hour';
      case 'daily':
        return schedule.time ? `Daily at ${schedule.time}` : 'Daily';
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = schedule.dayOfWeek !== undefined ? days[schedule.dayOfWeek] : 'Weekly';
        return schedule.time ? `${dayName} at ${schedule.time}` : dayName;
      case 'monthly':
        const monthText = schedule.dayOfMonth ? `${schedule.dayOfMonth}th of each month` : 'Monthly';
        return schedule.time ? `${monthText} at ${schedule.time}` : monthText;
      default:
        return schedule.frequency;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Backup Scheduler</h2>
          <p className="text-gray-400">Automate your backups with custom schedules</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="card-glass p-16 text-center">
          <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Schedules Yet</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Create your first backup schedule to automate your data protection and never worry about losing files again.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="card-glass card-hover p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${schedule.enabled ? 'bg-emerald-500/20' : 'bg-gray-600/20'}`}>
                    {schedule.enabled ? (
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{schedule.name}</h3>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-2 ${
                      schedule.backupType === 'full' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {schedule.backupType}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleSchedule(schedule)}
                    className={`p-2 rounded-xl transition-colors ${
                      schedule.enabled 
                        ? 'text-emerald-400 hover:bg-emerald-500/10' 
                        : 'text-gray-400 hover:bg-gray-600/10'
                    }`}
                  >
                    {schedule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">{getFrequencyText(schedule)}</span>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><span className="text-white font-medium">Includes:</span> {schedule.includePaths.length} paths</p>
                    {schedule.excludePaths.length > 0 && (
                      <p><span className="text-white font-medium">Excludes:</span> {schedule.excludePaths.length} paths</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold flex items-center space-x-2 ${
                    schedule.enabled ? 'text-emerald-400' : 'text-gray-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      schedule.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                    }`}></div>
                    <span>{schedule.enabled ? 'Active' : 'Inactive'}</span>
                  </span>
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingSchedule) && (
        <ScheduleModal
          schedule={editingSchedule}
          onSave={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingSchedule(null);
          }}
        />
      )}
    </div>
  );
}

interface ScheduleModalProps {
  schedule?: ScheduleConfig | null;
  onSave: (schedule: ScheduleConfig | Omit<ScheduleConfig, 'id'>) => void;
  onCancel: () => void;
}

function ScheduleModal({ schedule, onSave, onCancel }: ScheduleModalProps) {
  const [formData, setFormData] = useState<Omit<ScheduleConfig, 'id'>>({
    name: schedule?.name || '',
    enabled: schedule?.enabled ?? true,
    frequency: schedule?.frequency || 'daily',
    time: schedule?.time || '02:00',
    dayOfWeek: schedule?.dayOfWeek,
    dayOfMonth: schedule?.dayOfMonth,
    backupType: schedule?.backupType || 'incremental',
    includePaths: schedule?.includePaths || ['/Documents', '/Pictures'],
    excludePaths: schedule?.excludePaths || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (schedule) {
      onSave({ ...formData, id: schedule.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="p-8 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white">
            {schedule ? 'Edit Schedule' : 'Create New Schedule'}
          </h3>
          <p className="text-gray-400 mt-1">Configure your automated backup schedule</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Schedule Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-glass w-full"
              placeholder="e.g., Daily Documents Backup"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="input-glass w-full"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Backup Type
              </label>
              <select
                value={formData.backupType}
                onChange={(e) => setFormData({ ...formData, backupType: e.target.value as any })}
                className="input-glass w-full"
              >
                <option value="incremental">Incremental</option>
                <option value="full">Full Backup</option>
              </select>
            </div>
          </div>

          {formData.frequency !== 'hourly' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input-glass w-full max-w-xs"
              />
            </div>
          )}

          {formData.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Day of Week
              </label>
              <select
                value={formData.dayOfWeek || ''}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value ? Number(e.target.value) : undefined })}
                className="input-glass w-full max-w-xs"
              >
                <option value="">Select day</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
            </div>
          )}

          {formData.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Day of Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth || ''}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value ? Number(e.target.value) : undefined })}
                className="input-glass w-full max-w-xs"
              />
            </div>
          )}

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-white/10"
            />
            <label htmlFor="enabled" className="text-gray-300">
              Enable this schedule immediately
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {schedule ? 'Update' : 'Create'} Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}