import { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Save,
  Bell,
  Palette,
  Globe,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { extractApiError } from '../utils/helpers';
import { CURRENCY_OPTIONS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currencyPreference: user?.currencyPreference || 'USD',
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklySummary: false,
    monthlyReport: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const res = await userService.update(user.userId, {
        ...user,
        name: form.name,
        email: form.email,
        currencyPreference: form.currencyPreference,
      });
      updateUser(res.data);
      toast.success('Settings saved!');
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save settings'));
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-500 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        <div className="lg:w-56 shrink-0">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-lg font-bold text-surface-900 mb-6">
                Profile Information
              </h2>

              
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-600/25">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-surface-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-5 max-w-md">
                <Input
                  label="Full Name"
                  icon={<User className="w-4 h-4" />}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <div className="pt-4">
                  <Button
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-bold text-surface-900 mb-6">
                  Currency
                </h2>
                <div className="max-w-md space-y-5">
                  <Select
                    label="Default Currency"
                    options={CURRENCY_OPTIONS}
                    value={form.currencyPreference}
                    onChange={(e) =>
                      setForm({ ...form, currencyPreference: e.target.value })
                    }
                  />
                  <div className="flex items-center gap-2 p-3 bg-info-50 rounded-xl">
                    <Globe className="w-4 h-4 text-info-500 shrink-0" />
                    <p className="text-xs text-info-600">
                      Currency changes will apply to all new and existing displays throughout the app.
                    </p>
                  </div>
                  <Button
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    Save Preference
                  </Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-bold text-surface-900 mb-4">
                  Notifications
                </h2>
                <div className="space-y-4">
                  {([
                    { key: 'budgetAlerts' as const, label: 'Budget alerts', desc: 'Get notified when approaching budget limits' },
                    { key: 'weeklySummary' as const, label: 'Weekly summary', desc: 'Receive a weekly spending summary email' },
                    { key: 'monthlyReport' as const, label: 'Monthly report', desc: 'Monthly detailed expense report' },
                  ]).map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-surface-400" />
                        <div>
                          <p className="text-sm font-medium text-surface-800">
                            {item.label}
                          </p>
                          <p className="text-xs text-surface-500">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5.5 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.75 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary-600 shadow-inner" />
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-surface-400 mt-4 italic">
                  Notification preferences are saved locally. Email notifications require server-side setup.
                </p>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <Card>
              <h2 className="text-lg font-bold text-surface-900 mb-6">
                Change Password
              </h2>
              <div className="max-w-md space-y-5">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                <div className="flex items-center gap-2 p-3 bg-warning-50 rounded-xl">
                  <Shield className="w-4 h-4 text-warning-500 shrink-0" />
                  <p className="text-xs text-warning-600">
                    Use at least 8 characters with a mix of letters, numbers, and symbols.
                  </p>
                </div>
                <Button
                  icon={<Save className="w-4 h-4" />}
                  isLoading={isChangingPassword}
                  onClick={async () => {
                    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
                      toast.error('Please fill in all password fields');
                      return;
                    }
                    if (passwordForm.newPassword.length < 6) {
                      toast.error('New password must be at least 6 characters');
                      return;
                    }
                    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                      toast.error('Passwords do not match');
                      return;
                    }
                    setIsChangingPassword(true);
                    try {
                      await authService.confirmPasswordReset({
                        token: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword,
                      });
                      toast.success('Password updated!');
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    } catch (err) {
                      toast.error(extractApiError(err, 'Failed to update password'));
                    } finally {
                      setIsChangingPassword(false);
                    }
                  }}
                >
                  Update Password
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
