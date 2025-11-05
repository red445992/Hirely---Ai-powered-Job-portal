"use client";

import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Target, 
  Users, 
  Clock,
  Shield,
  Headphones,
  TrendingUp,
  Brain
} from "lucide-react";
import { useState } from "react";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceAnnual: number;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  features: string[];
  aiFeatures: string[];
  limitations?: string[];
  buttonText: string;
  buttonStyle: string;
  popular?: boolean;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      priceAnnual: 0,
      description: "Perfect for getting started with basic job search",
      icon: <Star className="w-6 h-6" />,
      features: [
        "Browse unlimited jobs",
        "Apply to 10 jobs per month",
        "Basic profile creation",
        "Email notifications",
        "Standard support"
      ],
      aiFeatures: [
        "1 AI resume review per month",
        "Basic interview tips"
      ],
      limitations: [
        "Limited AI interview sessions",
        "No priority support",
        "Basic analytics"
      ],
      buttonText: "Get Started Free",
      buttonStyle: "bg-gray-600 hover:bg-gray-700 text-white"
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      priceAnnual: 299,
      description: "Enhanced features for serious job seekers",
      icon: <Zap className="w-6 h-6" />,
      badge: "Most Popular",
      popular: true,
      features: [
        "Everything in Free",
        "Unlimited job applications",
        "Advanced profile builder",
        "Priority job alerts",
        "Application tracking",
        "Resume templates",
        "Cover letter generator"
      ],
      aiFeatures: [
        "5 AI interviews per month",
        "AI resume optimization",
        "Personalized job recommendations",
        "Interview preparation assistant",
        "Skill gap analysis"
      ],
      buttonText: "Start Pro Trial",
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    {
      id: "premium",
      name: "Premium",
      price: 59,
      priceAnnual: 599,
      description: "Complete AI-powered career acceleration",
      icon: <Crown className="w-6 h-6" />,
      badge: "Best Value",
      features: [
        "Everything in Pro",
        "Premium profile visibility",
        "Direct recruiter contact",
        "Salary insights",
        "Career coaching sessions",
        "Industry reports",
        "Networking opportunities"
      ],
      aiFeatures: [
        "Unlimited AI interviews",
        "Advanced AI career advisor",
        "Personalized learning paths",
        "Mock interview with AI feedback",
        "Salary negotiation assistant",
        "Industry-specific preparation",
        "Real-time interview coaching"
      ],
      buttonText: "Go Premium",
      buttonStyle: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Tools
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Supercharge Your Job Search with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized interview coaching, resume optimization, and career guidance 
            powered by advanced AI to land your dream job faster.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border">
            <span className={`px-4 py-2 rounded-full text-sm font-medium transition-colors Rs{!isAnnual ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform Rs{
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`px-4 py-2 rounded-full text-sm font-medium transition-colors Rs{isAnnual ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
              Annual
              <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl Rs{
                tier.popular 
                  ? 'border-blue-500 ring-4 ring-blue-100 scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Popular Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 text-blue-600">
                    {tier.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      Rs{isAnnual ? tier.priceAnnual : tier.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                    {isAnnual && tier.price > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Save Rs{(tier.price * 12) - tier.priceAnnual}/year
                      </div>
                    )}
                  </div>

                  <button className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 Rs{tier.buttonStyle}`}>
                    {tier.buttonText}
                  </button>
                </div>

                {/* AI Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    AI Features
                  </h4>
                  <ul className="space-y-2">
                    {tier.aiFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Standard Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Standard Features
                  </h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {tier.limitations && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      Limitations
                    </h4>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0">•</span>
                          <span className="text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Features Showcase */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-driven platform provides personalized guidance and real-time feedback 
              to help you succeed in every aspect of your job search.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Interview Coach</h3>
              <p className="text-sm text-gray-600">
                Practice with AI-powered mock interviews tailored to your target role
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Resume Optimizer</h3>
              <p className="text-sm text-gray-600">
                Get AI-powered suggestions to optimize your resume for ATS systems
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Career Insights</h3>
              <p className="text-sm text-gray-600">
                Receive personalized career advice based on market trends and your profile
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skill Matching</h3>
              <p className="text-sm text-gray-600">
                AI analyzes job requirements and suggests skills to improve your candidacy
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing and features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                Yes, all paid plans come with a 7-day free trial. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How does AI interview work?</h3>
              <p className="text-gray-600 text-sm">
                Our AI conducts realistic mock interviews, provides real-time feedback, and helps you improve your responses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who used our AI-powered platform to accelerate their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}