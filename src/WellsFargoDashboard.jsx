﻿import React, { useState, useEffect, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import { TrendingUp, Users, Calendar, Clock, User, UserPlus, Smartphone, Tablet } from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, XAxis, YAxis, Bar, Legend, CartesianGrid 
} from 'recharts';
import { Presentation, Slide, Text, Shape } from 'react-pptx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const WellsFargoDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const { toPDF } = usePDF({filename: 'WellsFargo-MoneyMind-Dashboard.pdf'});
  
  // Color scheme aligned with Wells Fargo branding
  const COLORS = {
    primary: '#00C49F', // Verde
    secondary: '#FFBF3F', // Wells Fargo gold
    tertiary: '#548235', // Green
    neutral1: '#F2F2F2', // Light gray
    neutral2: '#333333', // Dark gray
    blue: '#0088FE',
    green: '#00C49F',
    yellow: '#FFBB28',
    orange: '#FF8042',
    purple: '#8884d8', // Morado para Emerging Affluent
    moneyMind: {
      growth: '#FFBB28',    // Amarillo
      security: '#D71E28',  // Rojo
      control: '#548235',   // Verde
      daily: '#999999'      // Gris
    }
  };
  
  // Chart animation configuration
  const CHART_CONFIG = {
    animation: {
      isActive: true,
      begin: 0,
      duration: 400,
      easing: 'ease-out'
    }
  };
  
  // Data from analysis (ESTÁTICO)
  const [data, setData] = useState({
    overview: {
      moneyMind: [
        { name: 'Security Focused', millennials: 30, genZ: 25, hispanic: 40, smallBusiness: 45, emergingAffluent: 28, average: 34 },
        { name: 'Growth Oriented', millennials: 45, genZ: 50, hispanic: 30, smallBusiness: 40, emergingAffluent: 40, average: 41 },
        { name: 'Control Seekers', millennials: 35, genZ: 30, hispanic: 45, smallBusiness: 55, emergingAffluent: 22, average: 37 },
        { name: 'Day-to-Day Focused', millennials: 40, genZ: 45, hispanic: 35, smallBusiness: 30, emergingAffluent: 10, average: 32 }
      ],
      strategies: [
        { name: 'Budget Management', value: 76, description: 'Creating and sticking to budgets' },
        { name: 'Expense Tracking', value: 68, description: 'Actively monitoring where money goes' },
        { name: 'Goal Setting', value: 52, description: 'Setting specific financial targets' },
        { name: 'Automated Savings', value: 47, description: 'Using automation to save consistently' },
        { name: 'Subscription Management', value: 34, description: 'Regularly auditing subscriptions' }
      ],
      tools: [
        { name: 'Mobile Banking', value: 85 },
        { name: 'Goal Tracking', value: 62 },
        { name: 'Subscription Management', value: 58 },
        { name: 'Investment Tools', value: 45 },
        { name: 'Financial Education', value: 42 }
      ],
      painPoints: [
        { name: 'Invisible Spending', value: 72 },
        { name: 'Investing Complexity', value: 68 },
        { name: 'Goal Tracking', value: 54 },
        { name: 'Card Security', value: 48 },
        { name: 'Financial Guidance', value: 62 }
      ]
    },
    millennials: {
      summary: {
        avgAge: 32,
        avgSentiment: 18,
        topConcern: 'Managing student debt while saving',
        respondents: 500
      },
      moneyMind: [
        { name: 'Security', value: 30 },
        { name: 'Growth', value: 45 },
        { name: 'Control', value: 35 },
        { name: 'Daily Focus', value: 40 }
      ],
      strategies: [
        { name: 'Q(1)', factor: 'What does money mean to you?', sentiment: 15, description: 'Money is seen as a tool for experiences rather than possessions' },
        { name: 'Q(2)', factor: 'What makes managing your money easier?', sentiment: 28, description: 'Digital tools and automation are preferred management methods' },
        { name: 'Q(3)', factor: 'What tricks help you make your money last?', sentiment: 10, description: 'Struggle to balance current lifestyle with future saving goals' }
      ],
      relevantProducts: [
        { name: 'Goal-based savings tools', relevance: 85, description: 'Tools that visualize progress toward specific goals' },
        { name: 'Automated investing', relevance: 78, description: 'Simple, low-cost entry to investing markets' },
        { name: 'Subscription management', relevance: 72, description: 'Tools to track and manage recurring expenses' },
        { name: 'Debt optimization', relevance: 68, description: 'Strategies to manage and reduce various debts' }
      ],
      keyInsights: [
        "Millennials show strong interest in goal-tracking tools that help balance current enjoyment with future security",
        "They value transparency in banking and want to understand fee structures clearly",
        "Digital-first approach is essential, with 92% preferring to handle finances via mobile app",
        "Investment tools with educational components address their desire to grow wealth while learning"
      ]
    },
    genZ: {
      summary: {
        avgAge: 21,
        avgSentiment: -12, // Actualizado basado en el análisis de los datos de Gen Z.csv
        topConcern: 'Building credit history and saving',
        respondents: 392
      },
      moneyMind: [
        { name: 'Growth', value: 35 },
        { name: 'Security', value: 20 },
        { name: 'Control', value: 20 },
        { name: 'Daily Focus', value: 25 }
      ],
      strategies: [
        { name: 'Q(1)', factor: 'What does money mean to you?', sentiment: 12, description: 'Money represents freedom and future options' },
        { name: 'Q(2)', factor: 'What makes managing your money easier?', sentiment: 8, description: 'Highly digital approach, often using multiple apps' },
        { name: 'Q(3)', factor: 'What tricks help you make your money last?', sentiment: -5, description: 'Micro-saving and occasional side hustles' }
      ],
      relevantProducts: [
        { name: 'Micro-investing tools', relevance: 92, description: 'Allows Gen Z to start building investment portfolios with as little as $1-5, reducing the psychological barrier to investing' },
        { name: 'Credit building products', relevance: 85, description: 'Addresses the "credit catch-22" where they need credit history to get credit but can\'t build history without credit' },
        { name: 'Financial education', relevance: 76, description: 'Fills critical knowledge gaps in a generation that received minimal formal financial education' },
        { name: 'Digital wallet integration', relevance: 70, description: 'Connects with their preference for cashless, contactless payments and peer-to-peer money transfers' }
      ],
      keyInsights: [
        "Gen Z shows higher anxiety about financial futures than any other generation, with 68% expressing concern about long-term economic stability",
        "They're highly receptive to gamified elements in financial tools that provide learning through experience rather than traditional education",
        "Authenticity is crucial - transparent fee structures and ethical banking practices matter more to Gen Z than previous generations",
        "Strong preference for digital tools with instant feedback and visual progress indicators, with 94% preferring mobile-first solutions",
        "Social influence plays a significant role in financial decisions, with 72% consulting online communities before making major financial choices",
        "They show the highest interest in cryptocurrency and alternative investments, with 58% expressing interest in including these in their portfolios",
        "Short-term video content is their preferred financial education format, with 3-5 minute tutorials being most effective for engagement"
      ]
    },
    hispanics: {
      summary: {
        avgAge: 36,
        avgSentiment: 15,
        topConcern: 'Family financial coordination',
        respondents: 110
      },
      moneyMind: [
        { name: 'Growth', value: 35 },
        { name: 'Security', value: 45 },
        { name: 'Control', value: 20 },
        { name: 'Daily Focus', value: 25 }
      ],
      strategies: [
        { name: 'Q(1)', factor: 'What does money mean to you?', sentiment: 22, description: 'Security and family stability' },
        { name: 'Q(2)', factor: 'What makes managing your money easier?', sentiment: 12, description: 'Digital tools and family coordination' },
        { name: 'Q(3)', factor: 'What tricks help you make your money last?', sentiment: 8, description: 'Family budgeting and shared resources' }
      ],
      relevantProducts: [
        { name: 'Family banking tools', relevance: 88, description: 'Tools that facilitate shared financial management and coordination between family members' },
        { name: 'Bilingual services', relevance: 82, description: 'Financial services and support available in both English and Spanish' },
        { name: 'Educational resources', relevance: 75, description: 'Resources to help families learn about financial management together' },
        { name: 'Multi-account management', relevance: 70, description: 'Solutions for managing multiple accounts across family members' }
      ],
      keyInsights: [
        "Hispanic customers often balance individual needs with extended family financial responsibilities",
        "Strong desire for face-to-face relationships with bankers who understand cultural context",
        "Multi-generational household considerations influence financial decisions",
        "Prefer banking tools that facilitate family financial coordination and education"
      ]
    },
    smallbusiness: {
      moneyMind: [
        { name: 'Growth', value: 24 },
        { name: 'Security', value: 26 },
        { name: 'Control', value: 32 },
        { name: 'Daily Focus', value: 18 }
      ],
      strategies: [
        { name: 'Q(1)', sentiment: 15, description: 'What does money mean to you?' },
        { name: 'Q(2)', sentiment: 18, description: 'What makes managing your money easier?' },
        { name: 'Q(3)', sentiment: 25, description: 'What tricks help you make your money last?' }
      ],
      relevantProducts: [
        { name: 'Cash flow management', relevance: 85, description: 'Streamlined tools for tracking and forecasting business cash flow' },
        { name: 'Business credit building', relevance: 75, description: 'Products that help establish and grow business credit separate from personal' },
        { name: 'Payment processing', relevance: 65, description: 'Efficient transaction processing with lower fees and faster settlement' },
        { name: 'Business planning tools', relevance: 60, description: 'Digital resources for financial planning and business growth' }
      ],
      keyInsights: [
        'Small business owners show the highest desire for control in their financial picture',
        'Strong need for tools that distinguish between personal and business finances',
        'Value specialized expertise that understands their specific industry challenges',
        'Appreciate both digital efficiency and relationship-based service options'
      ]
    },
    emergingaffluent: {
      moneyMind: [
        { name: 'Growth', value: 40 },
        { name: 'Security', value: 28 },
        { name: 'Control', value: 22 },
        { name: 'Daily Focus', value: 10 }
      ],
      strategies: [
        { name: 'Q(1)', sentiment: 22, description: 'What does money mean to you?' },
        { name: 'Q(2)', sentiment: 28, description: 'What makes managing your money easier?' },
        { name: 'Q(3)', sentiment: 18, description: 'What tricks help you make your money last?' }
      ],
      relevantProducts: [
        { name: 'Investment products', relevance: 92, description: 'Accessible investment platforms with educational resources' },
        { name: 'Wealth management', relevance: 85, description: 'Entry-level advisory services with growth-focused strategies' },
        { name: 'Premium digital banking', relevance: 78, description: 'Enhanced digital tools with financial insights and budgeting' },
        { name: 'Rewards credit cards', relevance: 70, description: 'Cards optimized for lifestyle spending with investment features' }
      ],
      keyInsights: [
        'Strong focus on wealth building while balancing current lifestyle needs',
        'Seeking accessible entry points to wealth management without high minimums',
        'Digital-first approach with preference for self-directed tools with expert guidance',
        'Value status and lifestyle benefits that recognize their growing affluence'
      ]
    }
  });
  
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        // Aquí se cargaría el CSV si es necesario
        // Por ahora, asegurémonos de que los datos de emergingaffluent estén correctamente inicializados
        setData(prevData => {
          // Verificar si emergingaffluent ya existe
          if (!prevData.emergingaffluent) {
            // Si no existe, lo añadimos
            return {
              ...prevData,
              emergingaffluent: {
                moneyMind: [
                  { name: 'Growth', value: 40 },
                  { name: 'Security', value: 28 },
                  { name: 'Control', value: 22 },
                  { name: 'Daily Focus', value: 10 }
                ],
                strategies: [
                  { name: 'Q(1)', sentiment: 22, description: 'What does money mean to you?' },
                  { name: 'Q(2)', sentiment: 28, description: 'What makes managing your money easier?' },
                  { name: 'Q(3)', sentiment: 18, description: 'What tricks help you make your money last?' }
                ],
                relevantProducts: [
                  { name: 'Investment products', relevance: 92, description: 'Accessible investment platforms with educational resources' },
                  { name: 'Wealth management', relevance: 85, description: 'Entry-level advisory services with growth-focused strategies' },
                  { name: 'Premium digital banking', relevance: 78, description: 'Enhanced digital tools with financial insights and budgeting' },
                  { name: 'Rewards credit cards', relevance: 70, description: 'Cards optimized for lifestyle spending with investment features' }
                ],
                keyInsights: [
                  'Strong focus on wealth building while balancing current lifestyle needs',
                  'Seeking accessible entry points to wealth management without high minimums',
                  'Digital-first approach with preference for self-directed tools with expert guidance',
                  'Value status and lifestyle benefits that recognize their growing affluence'
                ]
              }
            };
          }
          // Si ya existe, retornamos los datos sin cambios
          return prevData;
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        setLoading(false);
      }
    };

    loadCSVData();
  }, []);
  
  // Helper function for sentiment color
  const getSentimentColor = (value) => {
    if (value > 20) return COLORS.tertiary;
    if (value < 0) return COLORS.primary;
    return COLORS.secondary;
  };

  // Helper function to calculate average sentiment from 3 questions
  const calculateAvgSentiment = (sentimentData) => {
    if (!sentimentData || sentimentData.length < 3) return 0;
    
    // Find the three specific questions
    const q1 = sentimentData.find(item => item.name === 'Q(1)' || 
                                          (item.factor && item.factor.includes('money mean to you')));
    const q2 = sentimentData.find(item => item.name === 'Q(2)' || 
                                          (item.factor && item.factor.includes('managing your money easier')));
    const q3 = sentimentData.find(item => item.name === 'Q(3)' || 
                                          (item.factor && item.factor.includes('tricks help you make your money last')));
    
    // Calculate average if all questions are found
    if (q1 && q2 && q3) {
      return Math.round((q1.sentiment + q2.sentiment + q3.sentiment) / 3);
    }
    
    return 0;
  };

  // Helper function to calculate axis domain dynamically
  const calculateDomain = (data, key, isPercentage = true) => {
    if (!data || data.length === 0) return [0, 100];
    
    let min = Infinity;
    let max = -Infinity;
    
    // Find min and max values
    data.forEach(item => {
      const value = typeof key === 'function' ? key(item) : item[key];
      if (value < min) min = value;
      if (value > max) max = value;
    });
    
    // Add margin (15% of range)
    const range = max - min;
    const margin = range * 0.15;
    
    // Adjust min and max with margin
    min = Math.floor(min - margin);
    max = Math.ceil(max + margin);
    
    // For percentage values, ensure sensible bounds
    if (isPercentage) {
      // If all values are positive
      if (min >= 0) {
        min = 0; // Start at 0 for better visualization
        max = Math.max(max, 10); // At least 10% for small values
      } else {
        // For charts with negative values
        min = Math.min(min, -5); // At least -5% for small negative values
        max = Math.max(max, 5);  // At least 5% for small positive values
      }
    }
    
    return [min, max];
  };

  const renderOverviewTab = () => {
    return (
      <div className="px-6 py-8 mx-auto max-w-7xl font-sans bg-gray-100 space-y-8">
        {/* OVERVIEW & STATS */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Honing Money Mind with Wells Fargo
          </h2>
          <p className="mb-4">
            Analysis of financial improvisers across audience segments who create
            unique mental strategies - the &quot;money mind&quot; - to navigate
            their finances.
          </p>
  
          {/* Three key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Respondents */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Total Respondents</h3>
              <p className="text-3xl font-bold text-gray-800">1,527</p>
              <p className="text-sm text-gray-500">Across 5 audience segments</p>
            </div>
  
            {/* Average Sentiment */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Average Sentiment</h3>
              <p className="text-3xl font-bold text-green-500">+9.3%</p>
              <p className="text-sm text-gray-500">
                Cautiously optimistic outlook
              </p>
            </div>
  
            {/* Top Barrier */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Top Barrier</h3>
              <p className="text-3xl font-bold text-gray-800">
                Invisible Spending
              </p>
              <p className="text-sm text-gray-500">
                63% report difficulty tracking recurring expenses
              </p>
            </div>
          </div>
  
          {/* STRATEGIC FOCUS SECTION */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">
              Strategic Focus: Honing Money Mind with Wells Fargo
            </h3>
            <p className="mb-4">
              A partnership that helps customers gain certainty while sharpening
              their financial decision-making skills.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* The Problem */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <h4 className="font-semibold mb-2 text-red-800">The Problem</h4>
                <p className="text-sm">
                  Wells Fargo needs to rebuild trust and demonstrate its ability
                  to deliver on basic fundamentals while solving unmet category
                  needs. 58% of customers express need for more transparency in
                  banking.
                </p>
              </div>
              {/* The Insight */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <h4 className="font-semibold mb-2 text-yellow-800">The Insight</h4>
                <p className="text-sm">
                  Financial improvisation means individuals create unique mental
                  strategies - their &quot;money mind&quot;. As humans, they seek
                  certainty and expertise to sharpen these skills. 71% of Hispanic
                  customers emphasize family financial security.
                </p>
              </div>
              {/* Strategy */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-semibold mb-2 text-green-800">Strategy</h4>
                <p className="text-sm">
                  Wells Fargo positioned as a partnership powered by empathy,
                  simplicity and expertise to help customers navigate myriad money
                  journeys. 67% of small business owners prioritize financial
                  stability and growth.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* MONEY MIND COMPARISON */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2 text-gray-700">
            Money Mind Comparison Across Segments
          </h2>
  
          {/* Understanding Chart */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">
              Understanding this Chart
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This chart shows how each audience segment values different aspects
              of their &quot;Money Mind&quot; on a scale of 0-100%, where higher
              numbers indicate stronger importance.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">
                  ✓
                </div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Security Focused:</span>{' '}
                  Prioritizes financial stability and safety
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">
                  ✓
                </div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Growth Oriented:</span> Focuses
                  on increasing wealth
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">
                  ✓
                </div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Control Seekers:</span> Wants
                  hands-on management
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">
                  ✓
                </div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Day-to-Day Focused:</span>{' '}
                  Concerned with immediate finances
                </span>
              </div>
            </div>
          </div>
  
          {/* EXAMPLE CHART: adapt or replace with new data */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.overview.moneyMind} // Replace with new data if needed
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                layout="horizontal"
                barGap={8}
                barSize={24}
              >
                <XAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 13, fill: '#444', fontWeight: 500 }}
                  height={60}
                  interval={0}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  domain={calculateDomain(data.overview.moneyMind, (item) =>
                    Math.max(
                      item.millennials,
                      item.genZ,
                      item.hispanic,
                      item.smallBusiness
                    )
                  )}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(229, 231, 235, 0.3)' }}
                />
                <Bar
                  dataKey="millennials"
                  name="Millennials"
                  fill={COLORS.blue}
                  radius={[6, 6, 6, 6]}
                >
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`millennials-${index}`} fill={`${COLORS.blue}dd`} />
                  ))}
                </Bar>
                <Bar
                  dataKey="genZ"
                  name="Gen Z"
                  fill={COLORS.green}
                  radius={[6, 6, 6, 6]}
                >
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`genZ-${index}`} fill={`${COLORS.green}dd`} />
                  ))}
                </Bar>
                <Bar
                  dataKey="hispanic"
                  name="Hispanic"
                  fill={COLORS.yellow}
                  radius={[6, 6, 6, 6]}
                >
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`hispanic-${index}`} fill={`${COLORS.yellow}dd`} />
                  ))}
                </Bar>
                <Bar
                  dataKey="smallBusiness"
                  name="Small Business"
                  fill={COLORS.orange}
                  radius={[6, 6, 6, 6]}
                >
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell
                      key={`smallBusiness-${index}`}
                      fill={`${COLORS.orange}dd`}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="emergingAffluent"
                  name="Emerging Affluent"
                  fill={COLORS.purple}
                  radius={[6, 6, 6, 6]}
                >
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell
                      key={`emergingAffluent-${index}`}
                      fill={`${COLORS.purple}dd`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          {/* KEY FINDINGS & STRATEGIC IMPLICATIONS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Findings */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-red-700">
                Key Findings
              </h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-700">
                <li>
                  Small Business owners show the highest focus on control (76%)
                  and stability (65%). 43% consider money as a means of business
                  sustainability.
                </li>
                <li>
                  Gen Z shows growth orientation (52%) and significant day-to-day
                  focus (45%). 65% use digital tools for money management.
                </li>
                <li>
                  Hispanic segment prioritizes security (48%) and growth (42%). 37%
                  mention financial freedom as their primary money motivation.
                </li>
                <li>
                  Millennials emphasize growth (45%) with balanced overall
                  distribution. 52% value digital banking solutions with human
                  support options.
                </li>
                <li>
                  Emerging Affluent strongly prioritize growth (72%) with minimal
                  day-to-day focus (10%). 78% invest regularly as part of their
                  financial strategy.
                </li>
              </ul>
            </div>
  
            {/* Strategic Implications */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-red-700">
                Strategic Implications
              </h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-700">
                <li>
                  Wells Fargo should customize control tools for small business
                  segment, as 39% cite better cash flow management as their primary
                  need.
                </li>
                <li>
                  The bank needs to develop growth-focused products for Gen Z,
                  with 54% expressing interest in automated investing platforms.
                </li>
                <li>
                  Security features should be enhanced for Hispanic customers,
                  where 42% rank security as their top banking priority.
                </li>
                <li>
                  Flexible solutions are required for millennials&apos; diverse
                  needs, with 61% seeking personalized financial guidance.
                </li>
                <li>
                  Wealth-building products with premium features would benefit
                  Emerging Affluent customers, 73% of whom are actively planning
                  for early retirement.
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* TOP MONEY MANAGEMENT STRATEGIES */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Top Money Management Strategies
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Analysis of the most common financial management techniques used
            across all segments, with 82% employing at least two strategies
            simultaneously
          </p>
  
          {/* Understanding these strategies */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">
              Understanding these strategies:
            </h3>
            <div className="space-y-4">
              {data.overview.strategies.map((strategy, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-3 h-3 flex items-center justify-center text-[#20B2AA] mt-1 mr-2">
                    ✓
                  </div>
                  <div className="text-sm text-gray-900">
                    <span className="font-semibold">
                      {strategy.name} ({strategy.value}%):
                    </span>{' '}
                    {strategy.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Data Highlights */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Data Highlights:
            </h3>
            <ul className="list-disc pl-4 space-y-2 text-gray-700">
              <li>
                47% of Hispanic respondents emphasize family-focused financial
                planning
              </li>
              <li>
                59% of small business owners prioritize separating personal and
                business finances
              </li>
              <li>
                38% of Gen Z report using automated savings apps to manage their
                money
              </li>
              <li>
                43% across all segments cite budgeting as their most effective
                money management tool
              </li>
              <li>
                31% of respondents report difficulty maintaining their financial
                strategies during economic uncertainty
              </li>
            </ul>
          </div>
  
          {/* Bar Chart for strategies */}
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.overview.strategies}
                    margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
                    layout="vertical"
                  >
                    <XAxis
                      type="number"
                      domain={calculateDomain(data.overview.strategies, 'value')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      width={120}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Sentiment']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#20B2AA"
                      radius={[0, 4, 4, 0]}
                      barSize={60}
                      label={{
                        position: 'right',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.overview.strategies.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`#20B2AA${Math.round(
                            ((100 - index * 15) / 100) * 255
                          )
                            .toString(16)
                            .padStart(2, '0')}`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
  
            {/* Implications for Wells Fargo */}
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Implications for Wells Fargo
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#20B2AA] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">
                      High adoption strategies:
                    </span>{' '}
                    Wells Fargo needs to offer budget management and expense
                    tracking tools as core offerings, with advanced features that
                    differentiate them from competitors
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#20B2AA] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Growth opportunity:</span>{' '}
                    Subscription management represents an emerging concern (34%)
                    and an unmet need that Wells Fargo can address with new
                    dedicated tools
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#20B2AA] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Education need:</span> The
                    bank has an opportunity to educate customers about automated
                    savings approaches, which are currently underutilized despite
                    their proven effectiveness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* TOOLS & PAIN POINTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Desired Banking Tools */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-700">
              Desired Banking Tools
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...data.overview.tools].sort((a, b) => b.value - a.value)}
                  margin={{ top: 30, right: 40, left: 40, bottom: 70 }}
                  layout="vertical"
                >
                  <XAxis
                    type="number"
                    domain={calculateDomain(
                      [...data.overview.tools].sort((a, b) => b.value - a.value),
                      'value'
                    )}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Interest Level']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={COLORS.secondary}
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: 'right',
                      formatter: (value) => `${value}%`,
                      fill: '#666',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  >
                    {[...data.overview.tools]
                      .sort((a, b) => b.value - a.value)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`${COLORS.secondary}${Math.round(
                            ((100 - index * 15) / 100) * 255
                          )
                            .toString(16)
                            .padStart(2, '0')}`}
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            {/* Key Insights for Desired Banking Tools */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Key Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Mobile Banking:</span> High
                      demand across all segments (82%), particularly Gen Z (94%)
                      and Millennials (89%) who prefer digital-first solutions
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Goal Tracking:</span> Most
                      valued by Millennials (76%) for balancing current lifestyle
                      with future planning. 68% of Hispanic respondents seek
                      family-oriented savings goals.
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">
                        Subscription Management:
                      </span>{' '}
                      Growing need (63%) as customers struggle with &quot;invisible
                      spending&quot; from digital subscriptions. 71% of Small
                      Business owners want integrated business/personal expense
                      tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Key Pain Points */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-700">
              Key Pain Points
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...data.overview.painPoints].sort((a, b) => b.value - a.value)}
                  margin={{ top: 30, right: 40, left: 40, bottom: 70 }}
                  layout="vertical"
                >
                  <XAxis
                    type="number"
                    domain={calculateDomain(
                      [...data.overview.tools].sort((a, b) => b.value - a.value),
                      'value'
                    )}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Concern Level']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#D71E28"
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: 'right',
                      formatter: (value) => `${value}%`,
                      fill: '#666',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  >
                    {[...data.overview.painPoints]
                      .sort((a, b) => b.value - a.value)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`#D71E28${Math.round(
                            ((100 - index * 15) / 100) * 255
                          )
                            .toString(16)
                            .padStart(2, '0')}`}
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            {/* Opportunity Areas */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Opportunity Areas
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Invisible Spending:</span>{' '}
                      63% of customers need automated tools to identify
                      pattern-based spending they often miss. 39% of Hispanic
                      respondents specifically mention difficulty tracking digital
                      expenses.
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Investing Complexity:</span>{' '}
                      57% report investing intimidation. 44% of Small Business
                      owners cite lack of investment knowledge as a major barrier
                      to business growth.
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Financial Guidance:</span>{' '}
                      72% want balance between digital guidance and human expertise
                      across segments. 68% of Gen Z prefer digital-first but with
                      human backup for complex decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* PROOF POINT FRAMEWORK */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Wells Fargo Proof Point Framework
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proof Point
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role for Wells Fargo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    &quot;Invisible&quot; spending
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Manage subscriptions through the WF app
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Effortless transparency
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Perceived barrier to investment
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Stock fractions with as little as $10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Helping you buy-in your way
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Getting sidetracked from goals
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Planning/goal setting in the WF app
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Persistence in your pursuit
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Looming vulnerability
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Card on/off feature
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Omni-present protection
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Personal money blind spots
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Human Bankers
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Empathetic expertise
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        {/* RECOMMENDED FOCUS AREAS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Recommended Focus Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Immediate Opportunities */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-red-800">
                Immediate Opportunities
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Subscription management tools to address &quot;invisible
                  spending&quot; - 63% of respondents report this need
                </li>
                <li>
                  Micro-investing options with educational component - 57% express
                  interest in starting with small amounts
                </li>
                <li>
                  Enhanced goal tracking with visual progress indicators - 76% find
                  visual feedback motivating
                </li>
              </ul>
            </div>
  
            {/* Strategic Positioning */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-yellow-800">
                Strategic Positioning
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Position as a partner in financial improvisation - 82% value
                  banking relationships that adapt to their changing needs
                </li>
                <li>
                  Emphasize the combination of digital tools with human expertise -
                  72% prefer this hybrid approach
                </li>
                <li>
                  Focus on building financial confidence - 69% cite lack of
                  confidence as a barrier to financial decision-making
                </li>
              </ul>
            </div>
  
            {/* Segment-Specific Focus */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                Segment-Specific Focus
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Gen Z: Education + micro-tools with immediate feedback - 65% use
                  digital tools for money management
                </li>
                <li>
                  Millennials: Goal-based tools balanced with lifestyle management
                  - 52% value digital banking with human support
                </li>
                <li>
                  Hispanic: Family-oriented financial tools and bilingual support -
                  47% emphasize family financial planning
                </li>
                <li>
                  Small Business: Clear separation of business/personal with
                  specialized advice - 59% prioritize this separation
                </li>
                <li>
                  Emerging Affluent: Wealth-building tools with premium features -
                  78% invest regularly as part of their financial strategy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMillennialsTab = () => {
    return (
      <div className="px-6 py-8 mx-auto max-w-7xl font-sans bg-gray-100 space-y-8">
        {/* SINGLE WRAPPER DIV FOR TOP SECTIONS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          {/* HEADER & SURVEY PARTICIPANT INFO */}
          <div className="space-y-4">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Millennials Money Mind Analysis
              </h1>
              <p className="text-sm text-gray-600">
                Understanding how Millennials think about and manage their finances
              </p>
            </div>
  
            {/* Survey Participant Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Survey Participant Information
              </h2>
              <div className="flex flex-wrap justify-between">
                {/* Overall Sentiment */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Overall Sentiment
                  </p>
                  <p className="text-3xl font-bold text-green-500 my-2">+10.3%</p>
                  <p className="text-xs text-gray-500">slightly positive</p>
                </div>
  
                {/* Total Respondents */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Users className="text-blue-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Respondents
                  </p>
                  <p className="text-3xl font-bold text-blue-500 my-2">500</p>
                  <p className="text-xs text-gray-500">survey participants</p>
                </div>
  
                {/* Age Range */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Calendar className="text-blue-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Age Range
                  </p>
                  <p className="text-3xl font-bold text-blue-500 my-2">28-42</p>
                  <p className="text-xs text-gray-500">millennial generation</p>
                </div>
  
                {/* Average Age */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Clock className="text-blue-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Average Age
                  </p>
                  <p className="text-3xl font-bold text-blue-500 my-2">35.2</p>
                  <p className="text-xs text-gray-500">mid-thirties</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* GENDER & DEVICE USAGE + PRIMARY FINANCIAL CONCERN */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Gender Distribution
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-blue-50 p-2 rounded-full">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">254</p>
                      <p className="text-sm text-gray-500">Male · 50.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-pink-50 p-2 rounded-full">
                      <UserPlus className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">246</p>
                      <p className="text-sm text-gray-500">Female · 49.2%</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Device Usage */}
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Device Usage
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gray-200 p-2 rounded-full">
                      <Smartphone className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">260</p>
                      <p className="text-sm text-gray-500">iOS · 52.0%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-green-50 p-2 rounded-full">
                      <Tablet className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">240</p>
                      <p className="text-sm text-gray-500">Android · 48.0%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Primary Financial Concern */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2 text-md">
                Primary Financial Concern
              </h3>
              <p className="text-sm text-gray-700">
                Managing student debt while saving for the future
              </p>
            </div>
          </div>
        </div>
  
        {/* MONEY MIND FACTORS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Money Mind Factors</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Security', value: 30 },
                      { name: 'Growth', value: 45 },
                      { name: 'Control', value: 35 },
                      { name: 'Daily Focus', value: 40 }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    paddingAngle={2}
                    labelLine={false}
                    isAnimationActive
                    animationBegin={400}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    label={({ name, value, cx, cy, midAngle, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.1;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
                      const colorMap = {
                        Growth: '#FFBB28',
                        Security: '#D71E28',
                        Control: '#548235',
                        'Daily Focus': '#999999'
                      };
                      const fillColor = colorMap[name] || '#8884d8';
  
                      return (
                        <text
                          x={x}
                          y={y}
                          fill={fillColor}
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontWeight="bold"
                        >
                          {`${name}: ${value}%`}
                        </text>
                      );
                    }}
                  >
                    <Cell fill="#D71E28" />
                    <Cell fill="#FFBB28" />
                    <Cell fill="#548235" />
                    <Cell fill="#999999" />
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:w-1/2 pl-6 flex flex-col justify-center space-y-4 mt-4 md:mt-0">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Key findings:</span> Millennials show a
                strong orientation toward financial growth (45%) while maintaining
                security (30%) and control (35%). Daily focus (40%) indicates
                attention to immediate financial needs.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Interpretation:</span> This generation
                prioritizes growth opportunities while maintaining a balanced
                approach to financial management, reflecting their career stage and
                desire for financial stability.
              </p>
            </div>
          </div>
        </div>
  
        {/* FINANCIAL MANAGEMENT STRATEGIES */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-bold text-gray-800">
            Financial Management Strategies
          </h2>
  
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-semibold">About Sentiment Scores: </span>
                These sentiment values were calculated using advanced AI analysis
                of survey responses. Our AI model evaluated the emotional tone,
                context, and specific language used in each participant's answers,
                assigning a sentiment score that reflects both explicit and
                implicit attitudes.
              </p>
            </div>
          </div>
  
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Q(1)',
                        factor: 'What does money mean to you?',
                        sentiment: 15
                      },
                      {
                        name: 'Q(2)',
                        factor: 'What makes managing your money easier?',
                        sentiment: 28
                      },
                      {
                        name: 'Q(3)',
                        factor: 'What tricks help you make your money last?',
                        sentiment: 10
                      }
                    ]}
                    margin={{ top: 20, right: 60, left: 40, bottom: 20 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="number"
                      domain={[0, 35]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Sentiment']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="sentiment"
                      fill="#0088FE"
                      radius={[4, 4, 0, 0]}
                      barSize={48}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-100 p-4 rounded-lg self-center">
              <h3 className="font-bold text-md mb-3 text-gray-900">
                Sentiment Analysis
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#0088FE] mt-1 mr-2"></div>
                  <p>
                    <span className="font-semibold">
                      Q(1) What does money mean to you?:
                    </span>{' '}
                    Money is seen as a tool for experiences rather than possessions{' '}
                    <span className="font-bold text-green-600 ml-1">(+15%)</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#0088FE] mt-1 mr-2"></div>
                  <p>
                    <span className="font-semibold">
                      Q(2) What makes managing your money easier?:
                    </span>{' '}
                    Digital tools and automation are preferred management methods{' '}
                    <span className="font-bold text-green-600 ml-1">(+28%)</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#0088FE] mt-1 mr-2"></div>
                  <p>
                    <span className="font-semibold">
                      Q(3) What tricks help you make your money last?:
                    </span>{' '}
                    Struggle to balance current lifestyle with future saving goals{' '}
                    <span className="font-bold text-green-600 ml-1">(+10%)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* AUTHENTIC SURVEY RESPONSES */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            Authentic Survey Responses
          </h2>
  
          <div className="flex flex-wrap gap-8">
            {/* Q1 */}
            <div className="flex-1 min-w-[280px]">
              <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
                <span className="font-medium">Sentiment: </span>
                <span className="font-bold text-green-600">+24%</span>
              </div>
              <div className="mb-4 pb-2 border-b border-gray-300">
                <h3 className="font-semibold text-gray-800 text-sm">
                  What does money mean to you?
                </h3>
              </div>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li>"A means of living"</li>
                <li>"Life"</li>
                <li>"It means something that lets us live everyday"</li>
                <li>"Safety"</li>
                <li>
                  "It means security. Less stress about where basic needs will come
                  from"
                </li>
              </ul>
            </div>
  
            {/* Q2 */}
            <div className="flex-1 min-w-[280px]">
              <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
                <span className="font-medium">Sentiment: </span>
                <span className="font-bold text-green-600">+12%</span>
              </div>
              <div className="mb-4 pb-2 border-b border-gray-300">
                <h3 className="font-semibold text-gray-800 text-sm">
                  What makes managing your money easier?
                </h3>
              </div>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li>"Budgeting"</li>
                <li>"Having money"</li>
                <li>"I save it until I need it"</li>
                <li>"Having more of it"</li>
                <li>"Well it's easier that we don't have a lot of it to manage"</li>
              </ul>
            </div>
  
            {/* Q3 */}
            <div className="flex-1 min-w-[280px]">
              <div className="inline-block mb-3 px-2 py-1 text-xs bg-red-50 rounded text-gray-700">
                <span className="font-medium">Sentiment: </span>
                <span className="font-bold text-red-600">-5%</span>
              </div>
              <div className="mb-4 pb-2 border-b border-gray-300">
                <h3 className="font-semibold text-gray-800 text-sm">
                  What tricks help you make your money last?
                </h3>
              </div>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li>"Coupons and discounts"</li>
                <li>"Not browsing"</li>
                <li>"I don't pay too much attention to things I don't need"</li>
                <li>"Thinking about money as time"</li>
                <li>"I'm incredibly frugal and rarely buy wants"</li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* KEY INSIGHTS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Key Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-indigo-700">
                  Financial Security:
                </span>{' '}
                Many respondents view money as a means to provide basic needs and
                security, indicating a pragmatic relationship with finances.
              </p>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-indigo-700">
                  Practical Approaches:
                </span>{' '}
                Responses show a trend toward practical money management strategies
                like budgeting and intentional spending habits.
              </p>
            </div>
          </div>
        </div>
  
        {/* HOW MILLENNIALS MANAGE THEIR MONEY */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-bold text-gray-800">
            How Millennials Manage Their Money
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strategy 1 */}
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-800">
                  Digital tools and automation are preferred
                </h3>
              </div>
              <p className="text-sm text-gray-600 ml-9 mb-2">
                Strong preference for all-in-one financial apps that consolidate
                accounts, bills, and goals in a single dashboard
              </p>
              <div className="ml-9">
                <p className="text-xs text-gray-500">Sentiment:</p>
                <p className="text-md font-semibold text-green-600">+12%</p>
              </div>
            </div>
  
            {/* Strategy 2 */}
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-800">
                  Struggle to balance lifestyle &amp; saving goals
                </h3>
              </div>
              <p className="text-sm text-gray-600 ml-9 mb-2">
                Need visualization tools that show the long-term impact of small
                daily spending decisions on major goals
              </p>
              <div className="ml-9">
                <p className="text-xs text-gray-500">Sentiment:</p>
                <p className="text-md font-semibold text-red-600">-5%</p>
              </div>
            </div>
  
            {/* Strategy 3 */}
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-800">
                  Combining multiple financial tools
                </h3>
              </div>
              <p className="text-sm text-gray-600 ml-9 mb-2">
                Using budgeting apps alongside banking tools to manage different
                aspects of their finances
              </p>
              <div className="ml-9">
                <p className="text-xs text-gray-500">Sentiment:</p>
                <p className="text-md font-semibold text-green-600">+8%</p>
              </div>
            </div>
  
            {/* Strategy 4 */}
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">4</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-800">
                  Value-based investing
                </h3>
              </div>
              <p className="text-sm text-gray-600 ml-9 mb-2">
                Preferring to invest in companies and funds aligned with social and
                environmental values
              </p>
              <div className="ml-9">
                <p className="text-xs text-gray-500">Sentiment:</p>
                <p className="text-md font-semibold text-green-600">+15%</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* MILLENNIALS FINANCIAL STRATEGY INSIGHTS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-bold text-gray-800">
            Millennials Financial Strategy Insights
          </h2>
          {/* Relationship with Money */}
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="font-bold text-sm mb-1 text-gray-800">
              Relationship with Money
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              Money is seen as a tool for experiences rather than possessions
            </p>
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-600 mr-2">
                Sentiment Score:
              </span>
              <span className="text-md font-semibold text-green-600">+15%</span>
            </div>
            <p className="text-xs text-gray-600">
              Millennials prioritize spending on experiences that create lasting
              memories while maintaining a balanced approach to saving
            </p>
          </div>
  
          {/* Money Management */}
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="font-bold text-sm mb-1 text-gray-800">
              Money Management
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              Digital tools and automation are preferred management methods
            </p>
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-600 mr-2">
                Sentiment Score:
              </span>
              <span className="text-md font-semibold text-green-600">+28%</span>
            </div>
            <p className="text-xs text-gray-600">
              Strong preference for digital banking solutions that offer automation
              and comprehensive financial tracking capabilities
            </p>
          </div>
  
          {/* Saving Strategies */}
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="font-bold text-sm mb-1 text-gray-800">
              Saving Strategies
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              Struggle to balance current lifestyle with future saving goals
            </p>
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-600 mr-2">
                Sentiment Score:
              </span>
              <span className="text-md font-semibold text-red-600">-5%</span>
            </div>
            <p className="text-xs text-gray-600">
              Need better tools and strategies to manage the balance between
              enjoying current lifestyle and meeting long-term financial goals
            </p>
          </div>
        </div>
  
        {/* MOST RELEVANT BANKING PRODUCTS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-bold text-gray-800">
            Most Relevant Banking Products
          </h2>
          <div className="bg-blue-100 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-sm mb-1 text-gray-900">
              Understanding Product Relevance:
            </h3>
            <p className="text-xs text-gray-700">
              Product relevance measures how well a banking product or service
              addresses the specific financial needs and pain points of this
              segment. Higher percentages (80-100%) indicate "must-have" products
              that strongly align with Millennial financial behaviors and goals.
            </p>
          </div>
  
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Goal-based savings tools',
                        relevance: 85,
                        description:
                          'Tools that visualize progress toward specific goals'
                      },
                      {
                        name: 'Automated investing',
                        relevance: 78,
                        description: 'Simple, low-cost entry to investing markets'
                      },
                      {
                        name: 'Subscription management',
                        relevance: 72,
                        description: 'Tools to track and manage recurring expenses'
                      },
                      {
                        name: 'Debt optimization',
                        relevance: 68,
                        description: 'Strategies to manage and reduce various debts'
                      }
                    ]}
                    margin={{ top: 20, right: 40, left: 100, bottom: 20 }}
                    layout="horizontal"
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Relevance']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="relevance"
                      fill="#0088FE"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 10
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-72 bg-gray-100 p-4 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-md mb-3 text-gray-900">
                Product Impact Analysis
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  {
                    name: 'Goal-based savings tools',
                    relevance: 85,
                    description:
                      'Tools that visualize progress toward specific goals'
                  },
                  {
                    name: 'Automated investing',
                    relevance: 78,
                    description: 'Simple, low-cost entry to investing markets'
                  },
                  {
                    name: 'Subscription management',
                    relevance: 72,
                    description: 'Tools to track and manage recurring expenses'
                  },
                  {
                    name: 'Debt optimization',
                    relevance: 68,
                    description: 'Strategies to manage and reduce various debts'
                  }
                ].map((product, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 mt-1">
                      <div className="w-2 h-2 bg-[#0088FE] rounded-full"></div>
                    </div>
                    <p className="ml-2">
                      <span className="font-semibold">{product.name}:</span>{' '}
                      {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  
        {/* KEY INSIGHTS FOR WELLS FARGO */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-bold text-gray-800">
            Key Insights for Wells Fargo
          </h2>
          <div className="space-y-3">
            {[
              'Millennials show strong interest in goal-tracking tools that help balance current enjoyment with future security',
              'They value transparency in banking and want to understand fee structures clearly',
              'Digital-first approach is essential, with 92% preferring to handle finances via mobile app',
              'Investment tools with educational components address their desire to grow wealth while learning'
            ].map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-[#0088FE]/10 rounded-full flex items-center justify-center mr-2">
                  <span className="text-[#0088FE] font-semibold">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
  
        {/* WELLS FARGO OPPORTUNITY */}
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="font-bold text-blue-700 mb-2 text-md">
            Wells Fargo Opportunity
          </h3>
          <p className="text-sm text-gray-700">
            Position Wells Fargo as a partner in balancing present enjoyment with
            future security through goal-based tools, automated investing options,
            and debt optimization strategies that respect Millennials' desire for
            experiences while building financial stability.
          </p>
        </div>
      </div>
    );
  };

  const renderGenZTab = () => {
    return (
      <div className="px-6 py-8 mx-auto max-w-7xl font-sans bg-gray-100 space-y-8">
        {/* SINGLE WRAPPER DIV FOR TOP SECTIONS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          {/* HEADER & SURVEY PARTICIPANT INFO */}
          <div className="space-y-4">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Gen Z Money Mind Analysis
              </h1>
              <p className="text-sm text-gray-600">
                Understanding how Gen Z thinks about and manages their finances
              </p>
            </div>
  
            {/* Survey Participant Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Survey Participant Information
              </h2>
              <div className="flex flex-wrap justify-between">
                {/* Overall Sentiment */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Overall Sentiment
                  </p>
                  <p className="text-3xl font-bold text-green-500 my-2">+0.1%</p>
                  <p className="text-xs text-gray-500">neutral attitude</p>
                </div>
  
                {/* Total Respondents */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Users className="text-blue-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Respondents
                  </p>
                  <p className="text-3xl font-bold text-blue-500 my-2">390</p>
                  <p className="text-xs text-gray-500">survey participants</p>
                </div>
  
                {/* Age Range */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Calendar className="text-blue-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Age Range
                  </p>
                  <p className="text-3xl font-bold text-blue-500 my-2">18-27</p>
                  <p className="text-xs text-gray-500">gen z range</p>
                </div>
  
                {/* Average Age */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Clock className="text-blue-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Average Age
                  </p>
                  <p className="text-3xl font-bold text-blue-500 my-2">23.6</p>
                  <p className="text-xs text-gray-500">early twenties</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* GENDER & DEVICE USAGE + PRIMARY FINANCIAL CONCERN */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Gender Distribution
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-pink-50 p-2 rounded-full">
                      <UserPlus className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">202</p>
                      <p className="text-sm text-gray-500">
                        Female · 51.8%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-blue-50 p-2 rounded-full">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">188</p>
                      <p className="text-sm text-gray-500">
                        Male · 48.2%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Device Usage */}
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Device Usage
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gray-200 p-2 rounded-full">
                      <Smartphone className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">248</p>
                      <p className="text-sm text-gray-500">iOS · 63.6%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-green-50 p-2 rounded-full">
                      <Tablet className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">142</p>
                      <p className="text-sm text-gray-500">Android · 36.4%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Primary Financial Concern */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2 text-md">
                Primary Financial Concern
              </h3>
              <p className="text-sm text-gray-700">
                Building financial independence while managing digital spending
              </p>
            </div>
          </div>
        </div>
  
  
        {/* Money Mind Factors */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Money Mind Factors</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Growth', value: 35 },
                      { name: 'Security', value: 20 },
                      { name: 'Control', value: 20 },
                      { name: 'Daily Focus', value: 25 }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    labelLine={false}
                    label={({ name, value, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.1;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill={name === 'Growth' ? COLORS.moneyMind.growth : 
                               name === 'Security' ? COLORS.moneyMind.security : 
                               name === 'Control' ? COLORS.moneyMind.control : 
                               COLORS.moneyMind.daily}
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          fontWeight="bold"
                        >
                          {`${name}: ${value}%`}
                        </text>
                      );
                    }}
                  >
                    <Cell fill={COLORS.moneyMind.growth} />   {/* Growth - Amarillo */}
                    <Cell fill={COLORS.moneyMind.security} /> {/* Security - Rojo */}
                    <Cell fill={COLORS.moneyMind.control} />  {/* Control - Verde */}
                    <Cell fill={COLORS.moneyMind.daily} />    {/* Daily Focus - Gris */}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:w-1/2 pl-6 flex flex-col justify-center space-y-4 mt-4 md:mt-0">
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-bold">Key findings:</span> Gen Z shows a strong preference for growth (35%) and security (20%), with a balanced approach to control (20%). Daily focus (25%) is significant but not as strong as growth orientation.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Interpretation:</span> This generation is focused on building a strong financial foundation while prioritizing growth opportunities. They balance daily management needs with long-term financial planning.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Management Strategies */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Financial Management Strategies</h2>
          
          {/* Sentiment Calculation Explanation */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-semibold">About Sentiment Scores: </span>
                These sentiment values were calculated using advanced AI analysis of survey responses. Our AI model evaluated the emotional tone, context, and specific language used in each participant's answers, assigning a sentiment score that reflects both the explicit and implicit attitudes towards financial management. Positive percentages indicate optimistic or confident responses, while negative values suggest areas of concern or uncertainty.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.genZ.strategies}
                    margin={{ top: 20, right: 80, left: 40, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.genZ.strategies, 'sentiment')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Sentiment']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="sentiment"
                      fill={COLORS.green}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.genZ.strategies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.sentiment > 0 ? '#00C49F' : '#D71E28'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Sentiment Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#00C49F] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(1) What does money mean to you?:</span> Money represents freedom and future options
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#00C49F] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(2) What makes managing your money easier?:</span> Highly digital approach, often using multiple apps
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#00C49F] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(3) What tricks help you make your money last?:</span> Micro-saving and occasional side hustles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

              {/* AUTHENTIC SURVEY RESPONSES */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <div className="w-6 h-6 rounded-md bg-[#7FFFD4]/40 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#7FFFD4]"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          Authentic Survey Responses
        </h2>

        <div className="flex flex-wrap gap-8">
          {/* Q1 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+30%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What does money mean to you?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Freedom"</li>
              <li>"Everything"</li>
              <li>"Security"</li>
              <li>"Independence"</li>
              <li>"Opportunity to live how I want"</li>
            </ul>
          </div>

          {/* Q2 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+20%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What makes managing your money easier?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Having a plan for each time I get paid"</li>
              <li>"Apps"</li>
              <li>"Spreadsheets and budgets"</li>
              <li>"Using fintech apps"</li>
              <li>"Having separate accounts for different purposes"</li>
            </ul>
          </div>

          {/* Q3 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-red-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-gray-600">0%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What tricks help you make your money last?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Don't spend impulsively"</li>
              <li>"Staying home"</li>
              <li>"Haven't developed any long standing ones yet"</li>
              <li>"Only buying what I need"</li>
              <li>"Deleting shopping apps from my phone"</li>
            </ul>
          </div>
        </div>
      </div>

        {/* How Gen Z Manages Their Money */}
        <div className="bg-[#e8f5e9] p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">How Gen Z Manages Their Money</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Strategy 1 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#00C49F]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#00C49F] font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg">Automated micro-savings</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Using apps that round up purchases and automatically transfer small amounts to savings accounts
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+15%</p>
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#00C49F]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#00C49F] font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg">Multiple income streams</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Combining main job with side hustles and gig economy to diversify income
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+18%</p>
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#00C49F]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#00C49F] font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg">Collaborative consumption</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Sharing subscriptions, using second-hand platforms and sharing economy to minimize expenses
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+15%</p>
              </div>
            </div>

            {/* Strategy 4 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#00C49F]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#00C49F] font-semibold">4</span>
                </div>
                <h3 className="font-semibold text-lg">Financial community consultation</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                72% consult online forums and social media before making major financial decisions
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+12%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gen Z Financial Strategy Insights */}
        <div className="bg-[#e8f5e9] p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">Gen Z Financial Strategy Insights</h2>
          
          {/* Relationship with Money */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Relationship with Money</h3>
            <p className="text-gray-700 mb-2">Money represents freedom and future options</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+28%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Gen Z views money as a tool for flexibility and independence rather than status, with growing anxiety about economic uncertainty
            </p>
          </div>

          {/* Money Management */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Money Management</h3>
            <p className="text-gray-700 mb-2">Highly digital approach, often using multiple apps</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+17%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Uses an average of 3-4 different financial apps simultaneously, preferring specialized tools over all-in-one solutions
            </p>
          </div>

          {/* Saving Strategies */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Saving Strategies</h3>
            <p className="text-gray-700 mb-2">Micro-saving and occasional side hustles</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-gray-600">0%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Combines multiple income streams with automated micro-saving tools that round up purchases or make small automatic transfers
            </p>
          </div>
        </div>

        {/* Most Relevant Banking Products */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Most Relevant Banking Products</h2>
          
          {/* What is Product Relevance explanation */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Understanding Product Relevance:</h3>
            <p className="text-sm text-gray-700">
              Product relevance indicates how essential a banking product or service is for meeting the specific financial needs of Gen Z. The percentage (0-100%) shows how strongly the product aligns with their financial behaviors, needs, and aspirations, with 90%+ indicating critical products that would significantly impact adoption and engagement.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.genZ.relevantProducts}
                    margin={{ top: 20, right: 80, left: 120, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.genZ.relevantProducts, 'relevance')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Relevance']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="relevance"
                      fill={COLORS.primary}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.genZ.relevantProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${COLORS.primary}${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Product Impact Analysis</h3>
              <div className="space-y-4">
                {data.genZ.relevantProducts.map((product, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 mt-1">
                      <div className="w-2 h-2 bg-[#20B2AA] rounded-full"></div>
                    </div>
                    <p className="ml-3 text-sm text-gray-900">
                      <span className="font-semibold">{product.name}:</span> {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights for Wells Fargo */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Key Insights for Wells Fargo</h2>
          <div className="space-y-4 mb-6">
            {data.genZ.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-[#00C49F]/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-[#00C49F] font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Wells Fargo Opportunity */}
        <div className="bg-[#00C49F]/10 p-4 rounded-lg">
          <h3 className="font-bold text-[#00835F] mb-2">Wells Fargo Opportunity</h3>
          <p className="text-sm text-gray-700">
            Create entry-level financial tools with educational components that help Gen Z build credit and invest with minimal barriers. Focus on gamified experiences that provide immediate feedback, incorporate social elements, and offer transparent fee structures with ethical banking practices that align with their values. Short-form video content will be most effective for education.
          </p>
        </div>
      </div>
    );
  };

  const renderHispanicsTab = () => {
    return (
      <div className="px-6 py-8 mx-auto max-w-7xl font-sans bg-gray-100 space-y-8">
        {/* SINGLE WRAPPER DIV FOR TOP SECTIONS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          {/* HEADER & SURVEY PARTICIPANT INFO */}
          <div className="space-y-4">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Hispanic Money Mind Analysis
              </h1>
              <p className="text-sm text-gray-600">
                Understanding how Hispanic Americans think about and manage their finances
              </p>
            </div>
  
            {/* Survey Participant Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Survey Participant Information
              </h2>
              <div className="flex flex-wrap justify-between">
                {/* Overall Sentiment */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Overall Sentiment
                  </p>
                  <p className="text-3xl font-bold text-green-500 my-2">
                    +8.7%
                  </p>
                  <p className="text-xs text-gray-500">moderately positive</p>
                </div>
  
                {/* Total Respondents */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <Users className="text-yellow-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Respondents
                  </p>
                  <p className="text-3xl font-bold text-yellow-500 my-2">
                    145
                  </p>
                  <p className="text-xs text-gray-500">survey participants</p>
                </div>
  
                {/* Age Range */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <Calendar className="text-yellow-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Age Range
                  </p>
                  <p className="text-3xl font-bold text-yellow-500 my-2">
                    16 - 74
                  </p>
                  <p className="text-xs text-gray-500">
                    across Hispanic adults
                  </p>
                </div>
  
                {/* Average Age */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <Clock className="text-yellow-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Average Age
                  </p>
                  <p className="text-3xl font-bold text-yellow-500 my-2">
                    36.4
                  </p>
                  <p className="text-xs text-gray-500">diverse representation</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* GENDER & DEVICE USAGE + PRIMARY FINANCIAL CONCERN */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div className="bg-yellow-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Gender Distribution
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-yellow-50 p-2 rounded-full">
                      <User className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">75</p>
                      <p className="text-sm text-gray-500">Male · 51.7%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-pink-50 p-2 rounded-full">
                      <UserPlus className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">70</p>
                      <p className="text-sm text-gray-500">Female · 48.3%</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Device Usage */}
              <div className="bg-yellow-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Device Usage
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gray-200 p-2 rounded-full">
                      <Smartphone className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">82</p>
                      <p className="text-sm text-gray-500">iOS · 56.6%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-green-50 p-2 rounded-full">
                      <Tablet className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">63</p>
                      <p className="text-sm text-gray-500">Android · 43.4%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Primary Financial Concern */}
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2 text-md">
                Primary Financial Concern
              </h3>
              <p className="text-sm text-gray-700">
                Supporting family while building long-term financial stability
              </p>
            </div>
          </div>
        </div>

        {/* Money Mind Factors */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Money Mind Factors</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.hispanics.moneyMind}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    labelLine={false}
                    isAnimationActive={CHART_CONFIG.animation.isActive}
                    animationBegin={CHART_CONFIG.animation.begin}
                    animationDuration={CHART_CONFIG.animation.duration}
                    animationEasing={CHART_CONFIG.animation.easing}
                    label={({ name, value, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.1;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill={name === 'Growth' ? COLORS.moneyMind.growth : 
                               name === 'Security' ? COLORS.moneyMind.security : 
                               name === 'Control' ? COLORS.moneyMind.control : 
                               COLORS.moneyMind.daily}
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          fontWeight="bold"
                        >
                          {`${name}: ${value}%`}
                        </text>
                      );
                    }}
                  >
                    <Cell fill={COLORS.moneyMind.growth} />   {/* Growth - Amarillo */}
                    <Cell fill={COLORS.moneyMind.security} /> {/* Security - Rojo */}
                    <Cell fill={COLORS.moneyMind.control} />  {/* Control - Verde */}
                    <Cell fill={COLORS.moneyMind.daily} />    {/* Daily Focus - Gris */}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:w-1/2 pl-6 flex flex-col justify-center space-y-4 mt-4 md:mt-0">
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-bold">Key findings:</span> Hispanic customers often balance individual needs with extended family financial responsibilities.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Interpretation:</span> This segment values face-to-face relationships with bankers who understand cultural context and multi-generational household considerations.
              </p>
            </div>
          </div>
        </div>

        {/* Question Responses & Sentiment */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Financial Management Strategies</h2>
          
          {/* Sentiment Calculation Explanation */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-semibold">About Sentiment Scores: </span>
                These sentiment values were calculated using advanced AI analysis of survey responses. Our AI model evaluated the emotional tone, context, and specific language used in each participant's answers, assigning a sentiment score that reflects both the explicit and implicit attitudes towards financial management. Positive percentages indicate optimistic or confident responses, while negative values suggest areas of concern or uncertainty.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.hispanics.strategies}
                    margin={{ top: 20, right: 80, left: 40, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.hispanics.strategies, 'sentiment')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Sentiment']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="sentiment"
                      fill={COLORS.yellow}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.hispanics.strategies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.sentiment > 0 ? '#FFBB28' : '#D71E28'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Sentiment Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(1) What does money mean to you?:</span> Security and family stability
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(2) What makes managing your money easier?:</span> Digital tools and family coordination
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(3) What tricks help you make your money last?:</span> Family budgeting and shared resources
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* AUTHENTIC SURVEY RESPONSES */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <div className="w-6 h-6 rounded-md bg-yellow-100 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-600"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          Authentic Survey Responses
        </h2>

        <div className="flex flex-wrap gap-8">
          {/* Q1 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+18.7%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What does money mean to you?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Security for my family"</li>
              <li>"Future opportunities"</li>
              <li>"Stability and peace of mind"</li>
              <li>"A way to provide for everyone"</li>
              <li>"Something to build for my children"</li>
            </ul>
          </div>

          {/* Q2 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+9.8%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What makes managing your money easier?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Planning with my spouse and parents"</li>
              <li>"Having clear categories for spending"</li>
              <li>"Separating needs from wants"</li>
              <li>"Keeping track of every expense"</li>
              <li>"Making decisions as a family"</li>
            </ul>
          </div>

          {/* Q3 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+6.5%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What tricks help you make your money last?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Buying quality items that last longer"</li>
              <li>"Cooking at home instead of eating out"</li>
              <li>"Having clear priorities"</li>
              <li>"Planning major purchases well in advance"</li>
              <li>"Looking for the best value, not just lowest price"</li>
            </ul>
          </div>
        </div>
      </div>

        {/* How Hispanics Manage Their Money */}
        <div className="bg-[#e8f5e9] p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">How Hispanics Manage Their Money</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Strategy 1 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FFBB28]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#FFBB28] font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg">Digital tools and automation are preferred management methods</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Strong preference for all-in-one financial apps that consolidate accounts, bills, and goals in a single dashboard
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+12%</p>
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FFBB28]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#FFBB28] font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg">Struggle to balance current lifestyle with future saving goals</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Need visualization tools that show long-term impact of small daily spending decisions on major goals
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-red-600">-5%</p>
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FFBB28]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#FFBB28] font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg">Combining multiple financial tools</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Using budgeting apps alongside banking tools to manage different aspects of their finances
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+8%</p>
              </div>
            </div>

            {/* Strategy 4 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FFBB28]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#FFBB28] font-semibold">4</span>
                </div>
                <h3 className="font-semibold text-lg">Value-based investing</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Prefer to invest in companies and funds aligned with their social and environmental values
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hispanics Financial Strategy Insights */}
        <div className="bg-[#e8f5e9] p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">Hispanics Financial Strategy Insights</h2>
          
          {/* Relationship with Money */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Relationship with Money</h3>
            <p className="text-gray-700 mb-2">Money is seen as a tool for experiences rather than possessions</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+15%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Hispanics prioritize spending on experiences that create lasting memories while maintaining a balanced approach to saving
            </p>
          </div>

          {/* Money Management */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Money Management</h3>
            <p className="text-gray-700 mb-2">Digital tools and automation are preferred management methods</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+28%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Strong preference for digital banking solutions that offer automation and comprehensive financial tracking capabilities
            </p>
          </div>

          {/* Saving Strategies */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Saving Strategies</h3>
            <p className="text-gray-700 mb-2">Struggle to balance current lifestyle with future saving goals</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-red-600">-5%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Need better tools and strategies to manage the balance between enjoying current lifestyle and meeting long-term financial goals
            </p>
          </div>
        </div>

        {/* Most Relevant Banking Products */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Most Relevant Banking Products</h2>
          
          {/* What is Product Relevance explanation */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Understanding Product Relevance:</h3>
            <p className="text-sm text-gray-700">
              Product relevance measures how well a banking product or service addresses the specific financial needs and pain points of this segment. Higher percentages (80-100%) indicate "must-have" products that strongly align with Hispanic financial behaviors and goals.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.hispanics.relevantProducts}
                    margin={{ top: 20, right: 80, left: 120, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.hispanics.relevantProducts, 'relevance')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Relevance']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="relevance"
                      fill={COLORS.yellow}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.hispanics.relevantProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${COLORS.yellow}${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Product Impact Analysis</h3>
              <div className="space-y-4">
                {data.hispanics.relevantProducts.map((product, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 mt-1">
                      <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                    </div>
                    <p className="ml-3 text-sm text-gray-900">
                      <span className="font-semibold">{product.name}:</span> {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights for Wells Fargo */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Key Insights for Wells Fargo</h2>
          <div className="space-y-4 mb-6">
            {data.hispanics.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-[#FFBB28]/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-[#FFBB28] font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights & Opportunity */}
        <div className="bg-[#fdb833]/10 p-4 rounded-lg">
          <h3 className="font-bold text-[#8B4513] mb-2">Wells Fargo Opportunity</h3>
          <p className="text-sm text-gray-700">
            Position Wells Fargo as a partner in balancing present enjoyment with future security through goal-based tools, automated investing options, and debt optimization strategies that respect Hispanic customers' desire for financial freedom and security.
          </p>
        </div>
      </div>
    );
  };

  const renderSmallbusinessTab = () => {
    return (
      <div className="px-6 py-8 mx-auto max-w-7xl font-sans bg-gray-100 space-y-8">
        {/* SINGLE WRAPPER DIV FOR TOP SECTIONS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          {/* HEADER & SURVEY PARTICIPANT INFO */}
          <div className="space-y-4">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Small Business Money Mind Analysis
              </h1>
              <p className="text-sm text-gray-600">
                Understanding how small business owners think about and manage their finances
              </p>
            </div>
  
            {/* Survey Participant Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Survey Participant Information
              </h2>
              <div className="flex flex-wrap justify-between">
                {/* Overall Sentiment */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Overall Sentiment
                  </p>
                  <p className="text-3xl font-bold text-green-500 my-2">
                    +12.6%
                  </p>
                  <p className="text-xs text-gray-500">positive attitude</p>
                </div>
  
                {/* Total Respondents */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <Users className="text-orange-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Respondents
                  </p>
                  <p className="text-3xl font-bold text-orange-500 my-2">
                    58
                  </p>
                  <p className="text-xs text-gray-500">survey participants</p>
                </div>
  
                {/* Average Owner Age */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <Clock className="text-orange-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Avg Owner Age
                  </p>
                  <p className="text-3xl font-bold text-orange-500 my-2">
                    42.7
                  </p>
                  <p className="text-xs text-gray-500">experienced operators</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* GENDER & DEVICE USAGE + PRIMARY FINANCIAL CONCERN */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div className="bg-orange-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Gender Distribution
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-orange-50 p-2 rounded-full">
                      <User className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">34</p>
                      <p className="text-sm text-gray-500">Male · 58.6%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-pink-50 p-2 rounded-full">
                      <UserPlus className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-gray-500">Female · 41.4%</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Device Usage */}
              <div className="bg-orange-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Device Usage
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gray-200 p-2 rounded-full">
                      <Smartphone className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">36</p>
                      <p className="text-sm text-gray-500">iOS · 62.1%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-green-50 p-2 rounded-full">
                      <Tablet className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">22</p>
                      <p className="text-sm text-gray-500">Android · 37.9%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Primary Financial Concern */}
            <div className="bg-orange-100 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2 text-md">
                Primary Financial Concern
              </h3>
              <p className="text-sm text-gray-700">
                Cash flow management and sustainable growth
              </p>
            </div>
          </div>
        </div>

        {/* Money Mind Factors */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Money Mind Factors</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.smallbusiness.moneyMind}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    labelLine={false}
                    isAnimationActive={CHART_CONFIG.animation.isActive}
                    animationBegin={CHART_CONFIG.animation.begin}
                    animationDuration={CHART_CONFIG.animation.duration}
                    animationEasing={CHART_CONFIG.animation.easing}
                    label={({ name, value, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.1;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill={name === 'Growth' ? COLORS.moneyMind.growth : 
                               name === 'Security' ? COLORS.moneyMind.security : 
                               name === 'Control' ? COLORS.moneyMind.control : 
                               COLORS.moneyMind.daily}
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          fontWeight="bold"
                        >
                          {`${name}: ${value}%`}
                        </text>
                      );
                    }}
                  >
                    <Cell fill={COLORS.moneyMind.growth} />   {/* Growth - Amarillo */}
                    <Cell fill={COLORS.moneyMind.security} /> {/* Security - Rojo */}
                    <Cell fill={COLORS.moneyMind.control} />  {/* Control - Verde */}
                    <Cell fill={COLORS.moneyMind.daily} />    {/* Daily Focus - Gris */}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:w-1/2 pl-6 flex flex-col justify-center space-y-4 mt-4 md:mt-0">
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-bold">Key findings:</span> Small business owners show the highest desire for control in their financial picture.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Interpretation:</span> This segment values specialized expertise that understands their specific industry challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Question Responses & Sentiment */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Financial Management Strategies</h2>
          
          {/* Sentiment Calculation Explanation */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-semibold">About Sentiment Scores: </span>
                These sentiment values were calculated using advanced AI analysis of survey responses. Our AI model evaluated the emotional tone, context, and specific language used in each participant's answers, assigning a sentiment score that reflects both the explicit and implicit attitudes towards financial management. Positive percentages indicate optimistic or confident responses, while negative values suggest areas of concern or uncertainty.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.smallbusiness.strategies}
                    margin={{ top: 20, right: 80, left: 40, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.smallbusiness.strategies, 'sentiment')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Sentiment']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="sentiment"
                      fill={COLORS.orange}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.smallbusiness.strategies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.sentiment > 0 ? '#FFBB28' : '#D71E28'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Sentiment Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(1) What does money mean to you?:</span> Managing cash flow and business growth
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(2) What makes managing your money easier?:</span> Tools that distinguish between personal and business finances
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(3) What tricks help you make your money last?:</span> Appreciate both digital efficiency and relationship-based service options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Relevant Banking Products */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Most Relevant Banking Products</h2>
          
          {/* What is Product Relevance explanation */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Understanding Product Relevance:</h3>
            <p className="text-sm text-gray-700">
              Product relevance measures how well a banking product or service addresses the specific financial needs and pain points of this segment. Higher percentages (80-100%) indicate "must-have" products that strongly align with Small Business financial behaviors and goals.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.smallbusiness.relevantProducts}
                    margin={{ top: 20, right: 80, left: 120, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.smallbusiness.relevantProducts, 'relevance')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Relevance']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="relevance"
                      fill={COLORS.orange}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.smallbusiness.relevantProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${COLORS.orange}${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Product Impact Analysis</h3>
              <div className="space-y-4">
                {data.smallbusiness.relevantProducts.map((product, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 mt-1">
                      <div className="w-2 h-2 bg-[#FFBB28] rounded-full"></div>
                    </div>
                    <p className="ml-3 text-sm text-gray-900">
                      <span className="font-semibold">{product.name}:</span> {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights for Wells Fargo */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Key Insights for Wells Fargo</h2>
          <div className="space-y-4 mb-6">
            {data.smallbusiness.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-[#FFBB28]/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-[#FFBB28] font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Wells Fargo Opportunity */}
        <div className="bg-[#FF8042]/10 p-4 rounded-lg">
          <h3 className="font-bold text-[#CC4000] mb-2">Wells Fargo Opportunity</h3>
          <p className="text-sm text-gray-700">
            Create entry-level financial tools with educational components that help small business owners manage cash flow and grow their business. Focus on gamified experiences that provide immediate feedback, incorporate social elements, and offer transparent fee structures with ethical banking practices that align with their values. Short-form video content will be most effective for education.
          </p>
        </div>
      </div>
    );
  };

  const renderEmergingaffluentTab = () => {
    return (
      <div className="px-6 py-8 mx-auto max-w-7xl font-sans bg-gray-100 space-y-8">
        {/* SINGLE WRAPPER DIV FOR TOP SECTIONS */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          {/* HEADER & SURVEY PARTICIPANT INFO */}
          <div className="space-y-4">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Emerging Affluent Money Mind Analysis
              </h1>
              <p className="text-sm text-gray-600">
                Understanding how emerging affluent individuals think about and manage their finances
              </p>
            </div>
  
            {/* Survey Participant Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Survey Participant Information
              </h2>
              <div className="flex flex-wrap justify-between">
                {/* Overall Sentiment */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Overall Sentiment
                  </p>
                  <p className="text-3xl font-bold text-green-500 my-2">
                    +17.5%
                  </p>
                  <p className="text-xs text-gray-500">strongly positive</p>
                </div>
  
                {/* Total Respondents */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Users className="text-purple-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Respondents
                  </p>
                  <p className="text-3xl font-bold text-purple-500 my-2">
                    434
                  </p>
                  <p className="text-xs text-gray-500">survey participants</p>
                </div>
  
                {/* Age Range */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Calendar className="text-purple-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Age Range
                  </p>
                  <p className="text-3xl font-bold text-purple-500 my-2">
                    25 - 45
                  </p>
                  <p className="text-xs text-gray-500">emerging affluent demographic</p>
                </div>
  
                {/* Average Age */}
                <div className="flex flex-col items-center text-center p-4 mx-2 min-w-[150px]">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Clock className="text-purple-500" size={16} />
                  </div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Average Age
                  </p>
                  <p className="text-3xl font-bold text-purple-500 my-2">
                    38.6
                  </p>
                  <p className="text-xs text-gray-500">prime earning years</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* GENDER & DEVICE USAGE + PRIMARY FINANCIAL CONCERN */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div className="bg-purple-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Gender Distribution
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-purple-50 p-2 rounded-full">
                      <User className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">243</p>
                      <p className="text-sm text-gray-500">Male · 56.0%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-pink-50 p-2 rounded-full">
                      <UserPlus className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">191</p>
                      <p className="text-sm text-gray-500">Female · 44.0%</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Device Usage */}
              <div className="bg-purple-100 p-6 rounded-lg">
                <h3 className="text-md font-semibold mb-4 text-gray-800">
                  Device Usage
                </h3>
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gray-200 p-2 rounded-full">
                      <Smartphone className="text-gray-700" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">312</p>
                      <p className="text-sm text-gray-500">iOS · 71.9%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 bg-green-50 p-2 rounded-full">
                      <Tablet className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">122</p>
                      <p className="text-sm text-gray-500">Android · 28.1%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Primary Financial Concern */}
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2 text-md">
                Primary Financial Concern
              </h3>
              <p className="text-sm text-gray-700">
                Wealth accumulation and strategic growth
              </p>
            </div>
          </div>
        </div>

        {/* Money Mind Factors */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Money Mind Factors</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Growth', value: 40 },
                      { name: 'Security', value: 28 },
                      { name: 'Control', value: 22 },
                      { name: 'Daily Focus', value: 10 }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    labelLine={false}
                    label={({ name, value, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.1;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill={name === 'Growth' ? COLORS.moneyMind.growth : 
                               name === 'Security' ? COLORS.moneyMind.security : 
                               name === 'Control' ? COLORS.moneyMind.control : 
                               COLORS.moneyMind.daily}
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          fontWeight="bold"
                        >
                          {`${name}: ${value}%`}
                        </text>
                      );
                    }}
                  >
                    <Cell fill={COLORS.moneyMind.growth} />   {/* Growth - Amarillo */}
                    <Cell fill={COLORS.moneyMind.security} /> {/* Security - Rojo */}
                    <Cell fill={COLORS.moneyMind.control} />  {/* Control - Verde */}
                    <Cell fill={COLORS.moneyMind.daily} />    {/* Daily Focus - Gris */}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:w-1/2 pl-6 flex flex-col justify-center space-y-4 mt-4 md:mt-0">
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-bold">Key findings:</span> Emerging Affluent show a strong focus on growth (40%) and security (28%), with a balanced approach to control (22%). Daily focus (10%) indicates attention to immediate financial needs.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Interpretation:</span> This segment prioritizes wealth building while balancing current lifestyle needs and managing investments.
              </p>
            </div>
          </div>
        </div>

        {/* Question Responses & Sentiment */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Financial Management Strategies</h2>
          
          {/* Sentiment Calculation Explanation */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-semibold">About Sentiment Scores: </span>
                These sentiment values were calculated using advanced AI analysis of survey responses. Our AI model evaluated the emotional tone, context, and specific language used in each participant's answers, assigning a sentiment score that reflects both the explicit and implicit attitudes towards financial management. Positive percentages indicate optimistic or confident responses, while negative values suggest areas of concern or uncertainty.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.emergingaffluent.strategies}
                    margin={{ top: 20, right: 80, left: 40, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.emergingaffluent.strategies, 'sentiment')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Sentiment']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="sentiment"
                      fill={COLORS.purple}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.emergingaffluent.strategies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.sentiment > 0 ? '#8884d8' : '#D71E28'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Sentiment Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#8884d8] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(1) What does money mean to you?:</span> Building wealth and managing investments
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#8884d8] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(2) What makes managing your money easier?:</span> Seeking accessible entry points to wealth management without high minimums
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#8884d8] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(3) What tricks help you make your money last?:</span> Digital-first approach with preference for self-directed tools with expert guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

              {/* AUTHENTIC SURVEY RESPONSES */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-500"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          Sample Responses Analysis
        </h2>

        <div className="flex flex-wrap gap-8">
          {/* Q1 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+14.2%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                Total value of personal savings and investments?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Portfolio performing above market benchmarks"</li>
              <li>"Satisfied with current investment mix"</li>
              <li>"Seeking more alternative investment options"</li>
              <li>"Focused on tax-efficient growth"</li>
              <li>"Building substantial retirement assets"</li>
            </ul>
          </div>

          {/* Q2 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+21.6%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What does money mean for you and your business?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Fuel for growth and expansion"</li>
              <li>"Freedom to pursue strategic opportunities"</li>
              <li>"Capital to reinvest in my business"</li>
              <li>"Tool for building long-term wealth"</li>
              <li>"Security combined with growth potential"</li>
            </ul>
          </div>

          {/* Q3 */}
          <div className="flex-1 min-w-[280px]">
            <div className="inline-block mb-3 px-2 py-1 text-xs bg-green-50 rounded text-gray-700">
              <span className="font-medium">Sentiment: </span>
              <span className="font-bold text-green-600">+15.7%</span>
            </div>
            <div className="mb-4 pb-2 border-b border-gray-300">
              <h3 className="font-semibold text-gray-800 text-sm">
                What makes handling money easier for you?
              </h3>
            </div>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>"Integrated dashboard for all accounts"</li>
              <li>"Working with a knowledgeable advisor"</li>
              <li>"Automated portfolio rebalancing"</li>
              <li>"Tax planning integration"</li>
              <li>"Seamless business and personal financial management"</li>
            </ul>
          </div>
        </div>
      </div>

        {/* How Emerging Affluent Manage Their Money */}
        <div className="bg-[#e8f5e9] p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">How Emerging Affluent Manage Their Money</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Strategy 1 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#8884d8]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#8884d8] font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg">Automated investing</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Using apps that round up purchases and automatically transfer small amounts to investment accounts
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+15%</p>
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#8884d8]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#8884d8] font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg">Wealth management services</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Seeking entry-level advisory services with growth-focused strategies
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+18%</p>
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#8884d8]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#8884d8] font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg">Premium digital banking</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Seeking enhanced digital tools with financial insights and budgeting
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+15%</p>
              </div>
            </div>

            {/* Strategy 4 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-[#8884d8]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#8884d8] font-semibold">4</span>
                </div>
                <h3 className="font-semibold text-lg">Rewards credit cards</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Seeking cards optimized for lifestyle spending with investment features
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emerging Affluent Financial Strategy Insights */}
        <div className="bg-[#e8f5e9] p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">Emerging Affluent Financial Strategy Insights</h2>
          
          {/* Relationship with Money */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Relationship with Money</h3>
            <p className="text-gray-700 mb-2">Money is seen as a tool for growth and stability</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+15%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Emerging Affluent prioritize growth opportunities while maintaining a balanced approach to financial management, reflecting their growing affluence and desire for financial stability.
            </p>
          </div>

          {/* Money Management */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Money Management</h3>
            <p className="text-gray-700 mb-2">Digital tools and automation are preferred management methods</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+28%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Strong preference for digital banking solutions that offer automation and comprehensive financial tracking capabilities
            </p>
          </div>

          {/* Investment Strategies */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Investment Strategies</h3>
            <p className="text-gray-700 mb-2">Struggle to balance current lifestyle with future growth</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-red-600">-5%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Need better tools and strategies to manage the balance between enjoying current lifestyle and meeting long-term growth goals
            </p>
          </div>
        </div>

        {/* Most Relevant Banking Products */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Most Relevant Banking Products</h2>
          
          {/* What is Product Relevance explanation */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Understanding Product Relevance:</h3>
            <p className="text-sm text-gray-700">
              Product relevance measures how well a banking product or service addresses the specific financial needs and pain points of this segment. Higher percentages (80-100%) indicate "must-have" products that strongly align with Emerging Affluent financial behaviors and goals.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.emergingaffluent.relevantProducts}
                    margin={{ top: 20, right: 80, left: 120, bottom: 20 }}
                    layout="horizontal"
                    barSize={60}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      domain={calculateDomain(data.emergingaffluent.relevantProducts, 'relevance')}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Relevance']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    <Bar
                      dataKey="relevance"
                      fill={COLORS.purple}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.emergingaffluent.relevantProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${COLORS.purple}${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Product Impact Analysis</h3>
              <div className="space-y-4">
                {data.emergingaffluent.relevantProducts.map((product, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 mt-1">
                      <div className="w-2 h-2 bg-[#8884d8] rounded-full"></div>
                    </div>
                    <p className="ml-3 text-sm text-gray-900">
                      <span className="font-semibold">{product.name}:</span> {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights for Wells Fargo */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Key Insights for Wells Fargo</h2>
          <div className="space-y-4 mb-6">
            {data.emergingaffluent.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-[#8884d8]/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-[#8884d8] font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights & Opportunity */}
        <div className="bg-[#8884d8]/10 p-4 rounded-lg">
          <h3 className="font-bold text-[#5552A6] mb-2">Wells Fargo Opportunity</h3>
          <p className="text-sm text-gray-700">
            Position Wells Fargo as a partner in balancing present enjoyment with future security through goal-based tools, automated investing options, and debt optimization strategies that respect Emerging Affluent customers' desire for financial freedom and security.
          </p>
        </div>
      </div>
    );
  };

  // Función para determinar qué pestaña mostrar basado en activeTab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'millennials':
        return renderMillennialsTab();
      case 'genZ':
        return renderGenZTab();
      case 'hispanics':
        return renderHispanicsTab();
      case 'smallbusiness':
        return renderSmallbusinessTab();
      case 'emergingaffluent':
        return renderEmergingaffluentTab();
      case 'affluent':
        return (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Affluent Tab</h2>
            <p className="text-gray-600 mb-6">This tab will be available in future updates.</p>
          </div>
        );
      case 'aiAgent':
        return (
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">AI Agent Coming Soon!</h2>
            <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-4">Our intelligent AI Agent will help you navigate financial data and provide personalized insights.</p>
            <div className="bg-purple-200 text-purple-800 px-4 py-2 rounded-lg inline-block">
              Available in Q3 2025
            </div>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  // Función para generar el PDF
  const generatePDF = () => {
    alert('Descargando PDF...');
    // Aquí iría la lógica para generar y descargar el PDF
    console.log('PDF generation triggered');
  };

  // Función para generar el PPT
  const generatePPT = () => {
    alert('Descargando PPT...');
    // Aquí iría la lógica para generar y descargar el PPT
    console.log('PPT generation triggered');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center">
          <img 
            src="/Wells-Fargo-Embleme.svg" 
            alt="Wells Fargo Logo" 
            className="h-12 w-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Wells_Fargo_Bank.svg';
            }}
          />
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold">
              <span className="text-red-700">Money Mind</span>
              <span className="text-gray-800"> Dashboard</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generatePDF}
              className="flex items-center bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              <span className="mr-2">PDF</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={generatePPT}
              className="flex items-center bg-[#00C49F] hover:bg-[#00A080] text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              <span className="mr-2">PPT</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation - Fixed below header */}
      <div className="fixed top-20 left-0 right-0 bg-white shadow z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Executive Summary
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'millennials' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('millennials')}
            >
              Millennials
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'genZ' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('genZ')}
            >
              Gen Z
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'hispanics' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('hispanics')}
            >
              Hispanic
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'smallbusiness' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('smallbusiness')}
            >
              Small Business
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'emergingaffluent' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('emergingaffluent')}
            >
              Emerging Affluent
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed`}
              disabled={true}
            >
              Affluent*
            </button>
            <div className="ml-4 border-l border-gray-200"></div>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                activeTab === 'aiAgent' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                : 'text-purple-600 hover:text-purple-800'
              } rounded-lg mx-2 transition-all duration-300`}
              onClick={() => setActiveTab('aiAgent')}
              disabled
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              AI Agent*
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Coming Soon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Now with ref */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-36">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default WellsFargoDashboard;
