"use client"

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaDiscord, FaKey, FaListAlt, FaClipboardList, FaTable } from 'react-icons/fa';

const steps = [
  {
    icon: <FaDiscord size={24} className="text-[#7289DA]" />,
    title: 'Add Your Discord ID',
    description: (
      <>
  After logging in or signing up, navigate to Account Settings, then go to Discord ID, click Add, and save the changes. After that, join this...
<a href="https://discord.gg/TwU88nZceT" className="text-[#7289DA] hover:text-[#5b6eae] underline transition-colors">
          DISCORD SERVER
        </a>.
      </>
    ),
  },
  {
    icon: <FaListAlt size={24} className="text-orange-500" />,
    title: 'Create Events & their Categories',
    description: 'Create events & categories to organize the data you want to TRACK. Alternatively, use the Quick Start option to get pre-configured setups for commonly tracked data.',
  },
  {
    icon: <FaKey size={24} className="text-yellow-500" />,
    title: 'Retrieve Your API Key',
    description: 'Go to the API Key section in your dashboard. Copy your unique API key. This key will be used to authenticate requests made to our platform.',
  },
  {
    icon: <FaClipboardList size={24} className="text-green-500" />,
    title: 'Integrate the API',
    description: (
      <>
        Integrate the API into your SaaS application or tools like Postman or Bruno. Replace <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">YOUR_API_KEY</code> in the provided snippet and configure fields as needed.
      </>
    ),
  },
  {
    icon: <FaTable size={24} className="text-blue-500" />,
    title: 'View Results',
    description: 'Once you send the POST request, our bot will send a customized Discord message. The data will also appear in your dashboard table for effective tracking.',
  },
];

const Page = () => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['category', 'quick-start', 'hasEvents'],
    queryFn: async () => {
      const res = await client.category.pollCategory.$get({
        name: 'quick-start',
      });
      return await res.json();
    },
    refetchInterval(query) {
      return query.state.data?.hasEvents ? false : 2000;
    },
  });

  const hasEvents = data?.hasEvents;

  useEffect(() => {
    if (hasEvents) router.refresh();
  }, [hasEvents, router]);

  const codeSnippet = `await fetch('http://localhost:3000/api/events', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      category: 'quick-start',
      fields: {
        field1: 'value1', // for example: user id
        field2: 'value2' // for example: user email
      }
    })
  })`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 font-sans tracking-tight">
          Step-by-Step Guide to Get Started
        </h1>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {`${index + 1}. ${step.title}`}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-400 text-sm font-mono">smit-api-snippet.js</span>
          </div>
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              borderRadius: '0'
            }}
          >
            {codeSnippet}
          </SyntaxHighlighter>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-lg text-gray-600 font-medium">
              Please don't forget to set your API_KEY...
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Need help? Check out our{' '}
            <a 
              href="https://github.com/Shahsmit075/Koalayst" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Demo
            </a>{' '}
            here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;