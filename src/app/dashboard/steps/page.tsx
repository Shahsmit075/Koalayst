"use client"

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaDiscord, FaKey, FaListAlt, FaClipboardList, FaTable } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

const initialSteps = [
  {
    icon: <FaDiscord size={24} className="text-[#7289DA]" />,
    title: 'Add Your Discord ID',
    description: (
      <>
        After logging in or signing up, navigate to Account Settings, then go to Discord ID, click Add, and save the changes. After that, join this:{' '}
        <a href="https://discord.gg/TwU88nZceT" className="text-[#7289DA] hover:text-[#5b6eae] underline transition-colors">
          DISCORD SERVER
        </a>.
      </>
    ),
    image: '/1_1.png'
  },
  {
    icon: <FaListAlt size={24} className="text-orange-500" />,
    title: 'Create Events & their Categories',
    description: 'Create events & categories to organize the data you want to TRACK. Alternatively, use the Quick Start option to get pre-configured setups for commonly tracked data.',
    image: '/1_3.png'
  },
  {
    icon: <FaKey size={24} className="text-yellow-500" />,
    title: 'Retrieve Your API Key',
    description: 'Go to the API Key section in your dashboard. Copy your unique API key. This key will be used to authenticate requests made to our platform.',
    image: '/1_2.png'
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

  const codeSnippet = `await fetch('https://koalayst.vercel.app/api/v1/events', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      category: 'your_category_name',
      fields: {
        field1: 'value1', // for example: user id
        field2: 'value2' // for example: user email
      }
    })
  })`;

  const postmanGuide = `{
    "url": "https://koalayst.vercel.app/api/v1/events",
    "method": "POST",
    "headers": {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    "body": {
        "category": "your_category_name",
        "fields": {
            "field1": "value1",
            "field2": "value2"
        }
    }
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 font-sans tracking-tight">
            Getting Started Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to integrate Koalayst into your application
          </p>
        </div>
        
        <div className="space-y-8">
          {/* First 3 steps */}
          {initialSteps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                        {step.icon}
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {`${index + 1}. ${step.title}`}
                      </h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      {step.description}
                    </p>
                  </div>
                  
                  {step.image && (
                    <div className="lg:w-2/5">
                      <div className="relative rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={step.image}
                          alt={`${step.title} visualization`}
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Step 4 with Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                  <FaClipboardList size={24} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  4. Integrate the API
                </h2>
              </div>

              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="code">Code Integration - for developers usecase</TabsTrigger>
                  <TabsTrigger value="postman">Postman Testing - for quick testing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code">
                  <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <div className="size-3 rounded-full bg-red-500" />
                        <div className="size-3 rounded-full bg-yellow-500" />
                        <div className="size-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-gray-400 text-sm">smit-api-snippet.js</span>
                    </div>
                    <SyntaxHighlighter
                      language="javascript"
                      style={atomDark}
                      customStyle={{
                        borderRadius: "0px",
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {codeSnippet}
                    </SyntaxHighlighter>
                  </div>
                </TabsContent>

                <TabsContent value="postman">
                  <div className="space-y-4">
                    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <div className="size-3 rounded-full bg-red-500" />
                          <div className="size-3 rounded-full bg-yellow-500" />
                          <div className="size-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-gray-400 text-sm">postman-config.json</span>
                      </div>
                      <SyntaxHighlighter
                        language="json"
                        style={atomDark}
                        customStyle={{
                          borderRadius: "0px",
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.875rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {postmanGuide}
                      </SyntaxHighlighter>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                      <h3 className="font-semibold mb-2">Quick Postman Setup Guide:</h3>
                      <ol className="list-decimal pl-4 space-y-2">
                        <li>Open Postman and create a new request</li>
                        <li>Set the request method to <span className="font-mono bg-blue-100 px-1 rounded">POST</span></li>
                        <li>Enter the URL: <span className="font-mono bg-blue-100 px-1 rounded">https://koalayst.vercel.app/api/v1/events</span></li>
                        <li>In Headers, add:
                          <ul className="pl-4 mt-1 space-y-1">
                            <li>• <span className="font-mono bg-blue-100 px-1 rounded">Authorization: Bearer YOUR_API_KEY</span></li>
                            <li>• <span className="font-mono bg-blue-100 px-1 rounded">Content-Type: application/json</span></li>
                          </ul>
                        </li>
                        <li>In the Body tab, select "raw" and "JSON", then paste the request body from above</li>
                        <li>Click "Send" to test your request</li>
                      </ol>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                      <FaTable size={24} className="text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      5. View Results
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      After sending your request, you'll see results in two places:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 size-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                          <span className="text-green-600 font-medium">1</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Discord Notification</h3>
                          <p className="text-gray-600">
                            Our bot will instantly send a formatted message to your Discord channel with the event details
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 size-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <span className="text-blue-600 font-medium">2</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Dashboard Table</h3>
                          <p className="text-gray-600">
                            Your event will appear in the dashboard with timestamp, category, and all field values
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-2 items-center mb-2">
                        <div className="size-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="font-medium text-blue-900">Real-time Updates</span>
                      </div>
                      <p className="text-sm text-blue-900">
                        All events are processed and displayed in real-time. You should see your test event appear within seconds of making the API request.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-2/5">
                  <div className="relative rounded-lg overflow-hidden shadow-md">
                    <Image
                      src="/1_4.png"
                      alt="Dashboard results view"
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="mt-4 relative rounded-lg overflow-hidden shadow-md">
                    <Image
                      src="/1_5.png"
                      alt="Discord notification example"
                      width={400}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white rounded-full shadow-md mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-lg text-gray-600 font-medium">
              Remember to secure your API key!
            </span>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <a 
              href="https://github.com/Shahsmit075/Koalayst"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Demo
            </a>
            <a 
              href="https://github.com/Shahsmit075/Koalayst"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;