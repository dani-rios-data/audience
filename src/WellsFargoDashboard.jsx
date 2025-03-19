import React, { useState, useEffect, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import { Presentation, Slide, Text, Shape } from 'react-pptx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

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
      <div>
        {/* Overview Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Honing Money Mind with Wells Fargo</h2>
          <p className="mb-4">Analysis of financial improvisers across audience segments who create unique mental strategies - the "money mind" - to navigate their finances.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Total Respondents</h3>
              <p className="text-3xl font-bold text-gray-800">1,145</p>
              <p className="text-sm text-gray-500">Across 5 audience segments</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Average Sentiment</h3>
              <p className="text-3xl font-bold text-green-500">+14.2%</p>
              <p className="text-sm text-gray-500">Cautiously optimistic outlook</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Top Barrier</h3>
              <p className="text-3xl font-bold text-gray-800">Invisible Spending</p>
              <p className="text-sm text-gray-500">63% report difficulty tracking recurring expenses</p>
            </div>
          </div>

          {/* Strategic Focus Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">Strategic Focus: Honing Money Mind with Wells Fargo</h3>
            <p className="mb-4">A partnership that helps customers gain certainty while sharpening their financial decision-making skills.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <h4 className="font-semibold mb-2 text-red-800">The Problem</h4>
                <p className="text-sm">Wells Fargo needs to rebuild trust and demonstrate its ability to deliver on basic fundamentals while solving unmet category needs. 58% of customers express need for more transparency in banking.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <h4 className="font-semibold mb-2 text-yellow-800">The Insight</h4>
                <p className="text-sm">Financial improvisation means individuals create unique mental strategies - their "money mind". As humans, they seek certainty and expertise to sharpen these skills. 71% of Hispanic customers emphasize family financial security.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-semibold mb-2 text-green-800">Strategy</h4>
                <p className="text-sm">Wells Fargo positioned as a partnership powered by empathy, simplicity and expertise to help customers navigate myriad money journeys. 67% of small business owners prioritize financial stability and growth.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Money Mind Comparison Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Money Mind Comparison Across Segments</h2>
          
          {/* Understanding this Chart Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Understanding this Chart</h3>
            <p className="text-sm text-gray-600 mb-4">This chart shows how each audience segment values different aspects of their "Money Mind" on a scale of 0-100%, where higher numbers indicate stronger importance.</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">✓</div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Security Focused:</span> Prioritizes financial stability and safety
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">✓</div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Growth Oriented:</span> Focuses on increasing wealth
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">✓</div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Control Seekers:</span> Wants hands-on management
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 flex items-center justify-center text-yellow-500 mr-2">✓</div>
                <span className="text-sm text-gray-900">
                  <span className="font-semibold">Day-to-Day Focused:</span> Concerned with immediate finances
                </span>
              </div>
            </div>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.overview.moneyMind}
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
                  domain={calculateDomain(data.overview.moneyMind, item => 
                    Math.max(item.millennials, item.genZ, item.hispanic, item.smallBusiness))}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                  grid={{ stroke: '#e5e7eb', strokeDasharray: '5 5' }}
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
                <Bar dataKey="millennials" name="Millennials" fill={COLORS.blue} radius={[6, 6, 6, 6]}>
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`millennials-${index}`} fill={`${COLORS.blue}dd`} />
                  ))}
                </Bar>
                <Bar dataKey="genZ" name="Gen Z" fill={COLORS.green} radius={[6, 6, 6, 6]}>
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`genZ-${index}`} fill={`${COLORS.green}dd`} />
                  ))}
                </Bar>
                <Bar dataKey="hispanic" name="Hispanic" fill={COLORS.yellow} radius={[6, 6, 6, 6]}>
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`hispanic-${index}`} fill={`${COLORS.yellow}dd`} />
                  ))}
                </Bar>
                <Bar dataKey="smallBusiness" name="Small Business" fill={COLORS.orange} radius={[6, 6, 6, 6]}>
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`smallBusiness-${index}`} fill={`${COLORS.orange}dd`} />
                  ))}
                </Bar>
                <Bar dataKey="emergingAffluent" name="Emerging Affluent" fill={COLORS.purple} radius={[6, 6, 6, 6]}>
                  {data.overview.moneyMind.map((entry, index) => (
                    <Cell key={`emergingAffluent-${index}`} fill={`${COLORS.purple}dd`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Key Takeaways Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-red-700">Key Findings</h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-700">
                <li>Small Business owners show the highest focus on control (32%) and security (26%). 43% consider money as a means of business stability.</li>
                <li>Gen Z shows growth orientation (33%) and significant day-to-day focus (30%). 65% use digital tools for money management.</li>
                <li>Hispanic segment prioritizes security (45%) and growth (35%). 37% mention financial freedom as their primary money motivation.</li>
                <li>Millennials emphasize growth (45%) with balanced overall distribution. 52% value digital banking solutions with human support options.</li>
                <li>Emerging Affluent strongly prioritize growth (40%) with minimal day-to-day focus (10%). 78% invest regularly as part of their financial strategy.</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-red-700">Strategic Implications</h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-700">
                <li>Wells Fargo should customize control tools for small business segment, as 39% cite better cash flow management as their primary need.</li>
                <li>The bank needs to develop growth-focused products for Gen Z, with 54% expressing interest in automated investing platforms.</li>
                <li>Security features should be enhanced for Hispanic customers, where 42% rank security as their top banking priority.</li>
                <li>Flexible solutions are required for millennials' diverse needs, with 61% seeking personalized financial guidance.</li>
                <li>Wealth-building products with premium features would benefit Emerging Affluent customers, 73% of whom are actively planning for early retirement.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Top Money Management Strategies */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Top Money Management Strategies</h2>
          <p className="text-sm text-gray-600 mb-4">Analysis of the most common financial management techniques used across all segments, with 82% employing at least two strategies simultaneously</p>

          {/* Understanding these strategies */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Understanding these strategies:</h3>
            <div className="space-y-4">
              {data.overview.strategies.map((strategy, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-3 h-3 flex items-center justify-center text-[#20B2AA] mt-1 mr-2">✓</div>
                  <div className="text-sm text-gray-900">
                    <span className="font-semibold">{strategy.name} ({strategy.value}%):</span> {strategy.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Data Highlights:</h3>
            <ul className="list-disc pl-4 space-y-2 text-gray-700">
              <li>47% of Hispanic respondents emphasize family-focused financial planning</li>
              <li>59% of small business owners prioritize separating personal and business finances</li>
              <li>38% of Gen Z report using automated savings apps to manage their money</li>
              <li>43% across all segments cite budgeting as their most effective money management tool</li>
              <li>31% of respondents report difficulty maintaining their financial strategies during economic uncertainty</li>
            </ul>
          </div>
          
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
                        <Cell key={`cell-${index}`} fill={`#20B2AA${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Implications Section */}
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Implications for Wells Fargo</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#20B2AA] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">High adoption strategies:</span> Wells Fargo needs to offer budget management and expense tracking tools as core offerings, with advanced features that differentiate them from competitors
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#20B2AA] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Growth opportunity:</span> Subscription management represents an emerging concern (34%) and an unmet need that Wells Fargo can address with new dedicated tools
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#20B2AA] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Education need:</span> The bank has an opportunity to educate customers about automated savings approaches, which are currently underutilized despite their proven effectiveness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools and Pain Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-700">Desired Banking Tools</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...data.overview.tools].sort((a, b) => b.value - a.value)}
                  margin={{ top: 30, right: 40, left: 40, bottom: 70 }}
                  layout="vertical"
                >
                  <XAxis
                    type="number"
                    domain={calculateDomain([...data.overview.tools].sort((a, b) => b.value - a.value), "value")}
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
                    {[...data.overview.tools].sort((a, b) => b.value - a.value).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`${COLORS.secondary}${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Key Insights Section for Desired Banking Tools */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Key Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Mobile Banking:</span> High demand across all segments (82%), particularly Gen Z (94%) and Millennials (89%) who prefer digital-first solutions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Goal Tracking:</span> Most valued by Millennials (76%) for balancing current lifestyle with future planning. 68% of Hispanic respondents seek family-oriented savings goals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Subscription Management:</span> Growing need (63%) as customers struggle with "invisible spending" from digital subscriptions. 71% of Small Business owners want integrated business/personal expense tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-700">Key Pain Points</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...data.overview.painPoints].sort((a, b) => b.value - a.value)}
                  margin={{ top: 30, right: 40, left: 40, bottom: 70 }}
                  layout="vertical"
                >
                  <XAxis
                    type="number"
                    domain={calculateDomain([...data.overview.tools].sort((a, b) => b.value - a.value), "value")}
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
                    {[...data.overview.painPoints].sort((a, b) => b.value - a.value).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`#D71E28${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Opportunity Areas Section for Key Pain Points */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Opportunity Areas</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Invisible Spending:</span> 63% of customers need automated tools to identify pattern-based spending they often miss. 39% of Hispanic respondents specifically mention difficulty tracking digital expenses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Investing Complexity:</span> 57% report investing intimidation. 44% of Small Business owners cite lack of investment knowledge as a major barrier to business growth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Financial Guidance:</span> 72% want balance between digital guidance and human expertise across segments. 68% of Gen Z prefer digital-first but with human backup for complex decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Point Framework */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Wells Fargo Proof Point Framework</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barrier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof Point</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role for Wells Fargo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Invisible" spending</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Manage subscriptions through the WF app</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Effortless transparency</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Perceived barrier to investment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Stock fractions with as little as $10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Helping you buy-in your way</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Getting sidetracked from goals</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Planning/goal setting in the WF app</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Persistence in your pursuit</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Looming vulnerability</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Card on/off feature</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Omni-present protection</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Personal money blind spots</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Human Bankers</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Empathetic expertise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Focus Areas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Recommended Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-red-800">Immediate Opportunities</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Subscription management tools to address "invisible spending" - 63% of respondents report this need</li>
                <li>Micro-investing options with educational component - 57% express interest in starting with small amounts</li>
                <li>Enhanced goal tracking with visual progress indicators - 76% find visual feedback motivating</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-yellow-800">Strategic Positioning</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Position as a partner in financial improvisation - 82% value banking relationships that adapt to their changing needs</li>
                <li>Emphasize the combination of digital tools with human expertise - 72% prefer this hybrid approach</li>
                <li>Focus on building financial confidence - 69% cite lack of confidence as a barrier to financial decision-making</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-green-800">Segment-Specific Focus</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Gen Z: Education + micro-tools with immediate feedback - 65% use digital tools for money management</li>
                <li>Millennials: Goal-based tools balanced with lifestyle management - 52% value digital banking with human support</li>
                <li>Hispanic: Family-oriented financial tools and bilingual support - 47% emphasize family financial planning</li>
                <li>Small Business: Clear separation of business/personal with specialized advice - 59% prioritize this separation</li>
                <li>Emerging Affluent: Wealth-building tools with premium features - 78% invest regularly as part of their financial strategy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMillennialsTab = () => {
    return (
      <div>
        {/* Header Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2">Millennials Money Mind Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">Understanding how Millennials think about and manage their finances</p>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-8">
              <div>
                <span className="text-sm text-gray-600">Respondents</span>
                <p className="text-2xl font-bold">500</p>
                <span className="text-xs text-gray-500">survey participants</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Age Range</span>
                <p className="text-2xl font-bold">28-42</p>
                <span className="text-xs text-gray-500">millennial generation</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Average Age</span>
                <p className="text-2xl font-bold">35.2</p>
                <span className="text-xs text-gray-500">years</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Gender Distribution
              </h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm mb-1">Male</p>
                  <p className="text-lg font-bold">254 (50.8%)</p>
                </div>
                <div>
                  <p className="text-sm mb-1">Female</p>
                  <p className="text-lg font-bold">246 (49.2%)</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Device Usage
              </h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm mb-1">iOS</p>
                  <p className="text-lg font-bold">260 (52.0%)</p>
                </div>
                <div>
                  <p className="text-sm mb-1">Android</p>
                  <p className="text-lg font-bold">240 (48.0%)</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Avg Sentiment</h3>
              <p className="text-2xl font-bold text-green-600">+10.3%</p>
              <span className="text-xs text-gray-500">Slightly positive attitude toward financial matters</span>
            </div>
          </div>

          <div className="bg-[#0088FE]/10 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Primary Financial Concern</h3>
            <p>"Managing student debt while saving" - highlighting the dual challenge millennials face</p>
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
                    data={data.millennials.moneyMind}
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
                <span className="font-bold">Key findings:</span> Millennials show a strong orientation toward financial growth (45%) while maintaining security (30%) and control (35%). Daily focus (40%) indicates attention to immediate financial needs.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Interpretation:</span> This generation prioritizes growth opportunities while maintaining a balanced approach to financial management, reflecting their career stage and desire for financial stability.
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
                    data={data.millennials.strategies}
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
                      domain={calculateDomain(data.millennials.strategies, 'sentiment')}
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
                      fill={COLORS.blue}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {data.millennials.strategies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.sentiment > 0 ? '#0088FE' : '#D71E28'} />
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
                    <div className="w-2 h-2 bg-[#0088FE] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(1) What does money mean to you?:</span> Money is seen primarily as security and a means for basic needs
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#0088FE] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(2) What makes managing your money easier?:</span> Basic budgeting and higher income are viewed as key factors
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#D71E28] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Q(3) What tricks help you make your money last?:</span> Struggle to balance current lifestyle with future saving goals
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sample Survey Responses */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Sample Survey Responses</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Q1 Responses */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-md mb-3 text-blue-700">What does money mean to you?</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"A means of living"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Life"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"It means something that lets us live everyday"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Safety"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"It means security. Less stress about where basic needs will come from"</p>
                </div>
                <div className="mt-3 text-right">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">+23.6% sentiment</span>
                </div>
              </div>
              
              {/* Q2 Responses */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-md mb-3 text-blue-700">What makes managing your money easier?</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Budgeting"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Having money"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"I save it until I need it"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Having more of it"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Well it's easier that we don't have a lot of it to manage"</p>
                </div>
                <div className="mt-3 text-right">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">+12.2% sentiment</span>
                </div>
              </div>
              
              {/* Q3 Responses */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-md mb-3 text-blue-700">What tricks help you make your money last?</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Coupons and discounts"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Not browsing"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"I don't pay too much attention to things I don't need"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"Thinking about money as time"</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">"I'm incredibly frugal and rarely buy wants"</p>
                </div>
                <div className="mt-3 text-right">
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">-5.0% sentiment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Millennials Manage Their Money Section */}
        <div className="bg-blue-50/50 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">How Millennials Manage Their Money</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Strategy 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg">Basic budgeting and higher income are viewed as key factors</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Simple budgeting practices and having more money would make management easier
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+12.2%</p>
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg">Struggle to balance current lifestyle with future saving goals</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Need visualization tools that show long-term impact of small daily spending decisions on major goals
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-red-600">-5.0%</p>
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg">Combining multiple financial tools</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Using budgeting apps alongside banking tools to manage different aspects of their finances
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+8.0%</p>
              </div>
            </div>

            {/* Strategy 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">4</span>
                </div>
                <h3 className="font-semibold text-lg">Value-based investing</h3>
              </div>
              <p className="text-gray-600 ml-12 mb-2">
                Prefer to invest in companies and funds aligned with their social and environmental values
              </p>
              <div className="ml-12">
                <p className="text-sm text-gray-500">Sentiment:</p>
                <p className="text-lg font-semibold text-green-600">+15.0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Millennials Financial Strategy Insights */}
        <div className="bg-blue-50/50 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-6">Millennials Financial Strategy Insights</h2>
          
          {/* Relationship with Money */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Relationship with Money</h3>
            <p className="text-gray-700 mb-2">Money is seen primarily as security and a means for basic needs</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+23.6%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Millennials view money as a necessity for security and reducing stress around basic needs rather than for experiences or possessions
            </p>
          </div>

          {/* Money Management */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Money Management</h3>
            <p className="text-gray-700 mb-2">Basic budgeting and higher income are viewed as key factors</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-green-600">+12.2%</span>
            </div>
            <p className="text-gray-600 text-sm">
              Many express that simple budgeting practices and having more money would make management easier, suggesting a need for both financial education and income growth
            </p>
          </div>

          {/* Saving Strategies */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Saving Strategies</h3>
            <p className="text-gray-700 mb-2">Struggle to balance current lifestyle with future saving goals</p>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Sentiment Score:</span>
              <span className="text-lg font-semibold text-red-600">-5.0%</span>
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
              Product Relevance Understanding: Measures how well a banking product addresses the specific financial needs and pain points of millennials
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Goal-based savings tools", relevance: 85, description: "Tools that visualize progress toward specific goals" },
                      { name: "Automated investing", relevance: 78, description: "Simple, low-cost entry to investing markets" },
                      { name: "Subscription management", relevance: 72, description: "Tools to track and manage recurring expenses" },
                      { name: "Debt optimization", relevance: 68, description: "Strategies to manage and reduce various debts" }
                    ]}
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
                      domain={[0, 100]}
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
                      fill={COLORS.blue}
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      label={{
                        position: 'top',
                        formatter: (value) => `${value}%`,
                        fill: '#666',
                        fontSize: 12
                      }}
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <Cell key={`cell-${index}`} fill={`${COLORS.blue}${Math.round((100 - (index * 15)) / 100 * 255).toString(16).padStart(2, '0')}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-200 self-center">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Product Impact Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#0088FE] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Goal-based savings tools:</span> Tools that visualize progress toward specific goals
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#0088FE] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Automated investing:</span> Simple, low-cost entry to investing markets
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#0088FE] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Subscription management:</span> Tools to track and manage recurring expenses
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1">
                    <div className="w-2 h-2 bg-[#0088FE] rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">Debt optimization:</span> Strategies to manage and reduce various debts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights for Wells Fargo */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Key Insights for Wells Fargo</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-[#0088FE]/10 rounded-full flex items-center justify-center mr-3">
                <span className="text-[#0088FE] font-semibold">1</span>
              </div>
              <p className="text-gray-700">Millennials show strong interest in goal-tracking tools that help balance current enjoyment with future security</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-[#0088FE]/10 rounded-full flex items-center justify-center mr-3">
                <span className="text-[#0088FE] font-semibold">2</span>
              </div>
              <p className="text-gray-700">They value transparency in banking and want to understand fee structures clearly</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-[#0088FE]/10 rounded-full flex items-center justify-center mr-3">
                <span className="text-[#0088FE] font-semibold">3</span>
              </div>
              <p className="text-gray-700">Digital-first approach is essential, with 92% preferring to handle finances via mobile app</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-[#0088FE]/10 rounded-full flex items-center justify-center mr-3">
                <span className="text-[#0088FE] font-semibold">4</span>
              </div>
              <p className="text-gray-700">Investment tools with educational components address their desire to grow wealth while learning</p>
            </div>
          </div>
        </div>

        {/* Key Insights & Opportunity */}
        <div className="bg-[#0088FE]/10 p-4 rounded-lg">
          <h3 className="font-bold text-[#0088FE] mb-2">Wells Fargo Opportunity</h3>
          <p className="text-sm text-gray-700">
            Position Wells Fargo as a partner in balancing present enjoyment with future security through goal-based tools, automated investing options, and debt optimization strategies that respect Millennials' desire for experiences while building financial stability.
          </p>
        </div>
      </div>
    );
  };

  const renderGenZTab = () => {
    return (
      <div>
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2">Gen Z Money Mind Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">Understanding how Gen Z thinks about and manages their finances</p>
        </div>
      </div>
    );
  };

  const renderHispanicsTab = () => {
    return (
      <div>
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2">Hispanic Money Mind Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">Understanding how Hispanic customers think about and manage their finances</p>
        </div>
      </div>
    );
  };

  const renderSmallbusinessTab = () => {
    return (
      <div>
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2">Small Business Money Mind Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">Understanding how small business owners think about and manage their finances</p>
        </div>
      </div>
    );
  };

  const renderEmergingaffluentTab = () => {
    return (
      <div>
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-2">Emerging Affluent Money Mind Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">Understanding how emerging affluent professionals think about and manage their finances</p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
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
      default:
        return null;
    }
  };

  return (
    <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-36">
      {renderTabContent()}
    </div>
  );
};

export default WellsFargoDashboard;
