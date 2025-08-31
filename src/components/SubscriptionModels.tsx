import React from 'react';
import { 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  HardDrive, 
  Clock, 
  ArrowLeft,
  Crown,
  Sparkles
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface SubscriptionModelsProps {
  onNavigate: (view: string) => void;
}

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  features: PlanFeature[];
  storage: string;
  devices: string;
  support: string;
  icon: React.ComponentType<any>;
}

export function SubscriptionModels({ onNavigate }: SubscriptionModelsProps) {
  const { addNotification } = useNotifications();

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for personal use and getting started',
      storage: '5 GB',
      devices: '1 device',
      support: 'Community support',
      icon: Shield,
      features: [
        { text: '5 GB secure storage', included: true },
        { text: 'Basic file backup', included: true },
        { text: 'Manual backup only', included: true },
        { text: 'Standard encryption', included: true },
        { text: 'Email support', included: false },
        { text: 'Advanced scheduling', included: false },
        { text: 'Team collaboration', included: false },
        { text: 'Priority restore', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Advanced features for professionals and small teams',
      popular: true,
      storage: '1 TB',
      devices: '5 devices',
      support: 'Priority email support',
      icon: Zap,
      features: [
        { text: '1 TB secure storage', included: true },
        { text: 'Automated backup scheduling', included: true },
        { text: 'Advanced encryption', included: true },
        { text: 'Version history (30 days)', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Mobile apps', included: true },
        { text: 'Team collaboration (up to 5)', included: true },
        { text: 'Advanced analytics', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$29.99',
      period: 'per month',
      description: 'Complete solution for large teams and organizations',
      storage: 'Unlimited',
      devices: 'Unlimited',
      support: '24/7 phone & chat support',
      icon: Crown,
      features: [
        { text: 'Unlimited secure storage', included: true },
        { text: 'Advanced backup automation', included: true },
        { text: 'Military-grade encryption', included: true },
        { text: 'Unlimited version history', included: true },
        { text: '24/7 priority support', included: true },
        { text: 'Advanced team management', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Compliance reporting', included: true }
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    if (planId === 'free') {
      addNotification({
        type: 'info',
        message: 'You are already on the Free plan',
      });
      return;
    }

    addNotification({
      type: 'success',
      message: `${plan.name} plan selected! Redirecting to payment...`,
    });

    // Simulate redirect to payment
    setTimeout(() => {
      addNotification({
        type: 'info',
        message: 'Payment processing would happen here in a real application',
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Select the perfect plan for your backup needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative card-glass card-hover p-8 transition-all ${
                plan.popular ? 'border-2 border-blue-500/50 scale-105' : 'border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
                  plan.id === 'free' ? 'bg-gray-600/20' :
                  plan.id === 'pro' ? 'gradient-primary' : 'bg-gradient-to-br from-purple-600 to-pink-600'
                }`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm text-gray-400 mb-6">
                  <div className="flex items-center justify-center space-x-2 bg-white/5 rounded-lg py-2">
                    <HardDrive className="h-4 w-4" />
                    <span>{plan.storage} storage</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 bg-white/5 rounded-lg py-2">
                    <Users className="h-4 w-4" />
                    <span>{plan.devices}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 bg-white/5 rounded-lg py-2">
                    <Clock className="h-4 w-4" />
                    <span>{plan.support}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      feature.included ? 'bg-emerald-500/20' : 'bg-gray-600/20'
                    }`}>
                      {feature.included ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      feature.included ? 'text-white' : 'text-gray-500'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  plan.id === 'free' 
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : plan.id === 'pro'
                    ? 'btn-primary hover:scale-105'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                }`}
              >
                {plan.id === 'free' ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="card-glass p-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <Sparkles className="h-6 w-6 mr-2 text-blue-400" />
          Frequently Asked Questions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Is my data secure?</h4>
              <p className="text-gray-400">
                Absolutely. We use end-to-end encryption and your data is stored across multiple secure data centers.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-2">What happens to my data if I cancel?</h4>
              <p className="text-gray-400">
                Your data remains accessible for 30 days after cancellation, giving you time to download everything.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Do you offer refunds?</h4>
              <p className="text-gray-400">
                Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}