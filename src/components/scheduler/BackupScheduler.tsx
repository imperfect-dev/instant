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
  AlertCircle
} from 'lucide-react';
import { BackupScheduler, ScheduleConfig } from '../../services/scheduler';
import { useNotifications } from '../../contexts/NotificationContext';

export function BackupSchedulerComponent() {
  const [schedules, setSchedules] = useState<ScheduleConfig[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleConfig | null>(null);
  const [scheduler] = useState(() => new BackupScheduler((schedule) => {
    // Handle backup trigger
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Backup Scheduler</h2>
          <p className="text-gray-600">Automate your backups with custom schedules</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Yet</h3>
          <p className="text-gray-600 mb-6">Create your first backup schedule to automate your data protection</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Schedule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${schedule.enabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    {schedule.enabled ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{schedule.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      schedule.backupType === 'full' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {schedule.backupType}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleSchedule(schedule)}
                    className={`p-1 rounded transition-colors ${
                      schedule.enabled 
                        ? 'text-emerald-600 hover:bg-emerald-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {schedule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{getFrequencyText(schedule)}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Includes:</strong> {schedule.includePaths.length} paths</p>
                  {schedule.excludePaths.length > 0 && (
                    <p><strong>Excludes:</strong> {schedule.excludePaths.length} paths</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${schedule.enabled ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {schedule.enabled ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {schedule ? 'Edit Schedule' : 'Create New Schedule'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Type
              </label>
              <select
                value={formData.backupType}
                onChange={(e) => setFormData({ ...formData, backupType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="incremental">Incremental</option>
                <option value="full">Full Backup</option>
              </select>
            </div>
          </div>

          {formData.frequency !== 'hourly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {formData.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Week
              </label>
              <select
                value={formData.dayOfWeek || ''}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth || ''}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="ml-2 text-sm text-gray-700">
              Enable this schedule
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {schedule ? 'Update' : 'Create'} Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}