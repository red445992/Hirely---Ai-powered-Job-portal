// import { testGoogleAIConnection } from "@/actions/dashboard";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default async function TestAPIPage() {
//   const result = await testGoogleAIConnection();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
//       <div className="max-w-2xl mx-auto">
//         <Card>
//           <CardHeader>
//             <CardTitle>Google AI API Connection Test</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="p-4 bg-slate-100 rounded-lg">
//               <p className="font-semibold mb-2">Status:</p>
//               <p className={`text-lg font-bold ${result.success ? "text-green-600" : "text-red-600"}`}>
//                 {result.success ? "✅ Connected" : "❌ Failed"}
//               </p>
//             </div>

//             <div className="p-4 bg-slate-100 rounded-lg">
//               <p className="font-semibold mb-2">API Key Found:</p>
//               <p className="text-lg">{result.apiKeyFound ? "✅ Yes" : "❌ No"}</p>
//             </div>

//             {result.modelUsed && (
//               <div className="p-4 bg-slate-100 rounded-lg">
//                 <p className="font-semibold mb-2">Model Used:</p>
//                 <p className="text-sm font-mono">{result.modelUsed}</p>
//               </div>
//             )}

//             <div className="p-4 bg-slate-100 rounded-lg">
//               <p className="font-semibold mb-2">Message:</p>
//               <p className="text-sm">{result.message}</p>
//             </div>

//             {result.response && (
//               <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <p className="font-semibold mb-2">AI Response:</p>
//                 <p className="text-sm text-green-800">{result.response}</p>
//               </div>
//             )}

//             {result.availableModels && result.availableModels.length > 0 && (
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="font-semibold mb-2">Available Models:</p>
//                 <ul className="list-disc list-inside text-xs text-blue-800 space-y-1">
//                   {result.availableModels.map((modelName: string) => (
//                     <li key={modelName} className="font-mono">{modelName}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {result.suggestion && (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="font-semibold mb-2">💡 Suggestion:</p>
//                 <p className="text-sm text-yellow-800">{result.suggestion}</p>
//               </div>
//             )}

//             {result.error && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="font-semibold mb-2">Error Details:</p>
//                 <pre className="text-xs text-red-800 overflow-auto whitespace-pre-wrap">{result.error}</pre>
//               </div>
//             )}

//             <div className="pt-4 border-t">
//               <p className="text-sm text-slate-600">
//                 <strong>Note:</strong> Common Gemini model names:
//               </p>
//               <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
//                 <li><code className="bg-slate-200 px-1 rounded">gemini-pro</code> - Standard model (recommended)</li>
//                 <li><code className="bg-slate-200 px-1 rounded">gemini-1.5-pro</code> - Latest enhanced model</li>
//                 <li><code className="bg-slate-200 px-1 rounded">gemini-1.5-flash</code> - Fast model (may not be available)</li>
//               </ul>
//               <p className="text-sm text-slate-600 mt-3">
//                 If you see an error, make sure you've restarted the dev server after changing the model name.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
