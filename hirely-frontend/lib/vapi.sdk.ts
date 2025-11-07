import Vapi from "@vapi-ai/web";

// Check if token is loaded
const vapiToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
console.log('🔑 VAPI Token loaded:', vapiToken ? `${vapiToken.substring(0, 10)}...` : 'NOT FOUND');
console.log('🔑 VAPI Token length:', vapiToken?.length || 0);

export const vapi = new Vapi(vapiToken!);