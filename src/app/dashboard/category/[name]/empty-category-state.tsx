import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/client'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const EmptyCategoryState = ({categoryName}: {categoryName : string}) => {
    const router = useRouter()

    const {data} = useQuery({
        queryKey: ["category", categoryName, "hasEvents"],
        queryFn: async () => {
            const res = await client.category.pollCategory.$get({
                name: categoryName,
            })
            return await res.json()
        },
        refetchInterval(query) {
            return query.state.data?.hasEvents ? false : 2000
        },
    })

    const hasEvents = data?.hasEvents

    useEffect(() => {
        if(hasEvents) router.refresh()
    }, [hasEvents, router])

    const codeSnippet = `await fetch('https://koalayst.vercel.app/api/v1/events', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          category: '${categoryName}',
          fields: {
            field1: 'value1', // for example: user id
            field2: 'value2' // for example: user email
          }
        })
      })`

    const postmanGuide = `{
        "url": "https://koalayst.vercel.app/api/v1/events",
        "method": "POST",
        "headers": {
            "Authorization": "Bearer YOUR_API_KEY",
            "Content-Type": "application/json"
        },
        "body": {
            "category": "${categoryName}",
            "fields": {
                "field1": "value1",
                "field2": "value2"
            }
        }
    }`

    return (
        <Card
            contentClassName="max-w-2xl w-full flex flex-col items-center p-6"
            className="flex-1 flex items-center justify-center"
        >
            <h2 className="text-xl/8 font-medium text-center tracking-tight text-gray-950">
                Create your first {categoryName} event
            </h2>
            <p className="text-sm/6 text-gray-600 mb-8 max-w-md text-center text-pretty">
                Get started by sending a request to our tracking API:
            </p>

            <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="code">Code Integration</TabsTrigger>
                    <TabsTrigger value="postman">Postman Testing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code">
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
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
                        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
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

            <div className="mt-8 flex flex-col items-center space-x-2">
                <div className="flex gap-2 items-center">
                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-lg text-gray-600">
                        Listening to incoming events...
                    </span>
                </div>

                <div className="flex gap-2 items-center">
                    <div className="size-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-lg text-gray-600">
                        Please don't forget to set your API_KEY...
                    </span>
                </div>

                <p className="text-sm/6 text-gray-600 mt-2">
                    Need help? Check out our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        documentation
                    </a>{" "}
                    or{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        contact support
                    </a>
                    .
                </p>
            </div>
        </Card>
    )
}