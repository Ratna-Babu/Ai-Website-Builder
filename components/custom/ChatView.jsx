"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Link, Loader2Icon, Send } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateWorkspace);

    useEffect(() => {
        id && GetWorkSpaceData();
    }, [id])

    const GetWorkSpaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages);
        console.log(result);
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages])

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT
        });

        const aiResp = {
            role: 'ai',
            content: result.data.result
        }
        setMessages(prev => [...prev, aiResp]);
        await UpdateMessages({
            messages: [...messages, aiResp],
            workspaceId: id
        })
        setLoading(false);
    }

    const onGenerate = (input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }]);
        setUserInput('');
    }

    return (
        <div className="relative h-[50vh] lg:h-[85vh] flex flex-col bg-gray-900 rounded-lg">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-3 sm:p-4">
                <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 sm:p-4 rounded-lg ${
                                msg.role === 'user' 
                                    ? 'bg-gray-800/50 border border-gray-700' 
                                    : 'bg-gray-800/30 border border-gray-700'
                            }`}
                        >
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-500/20 text-blue-400' 
                                        : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                    <span className="text-xs sm:text-sm font-medium">
                                        {msg.role === 'user' ? 'You' : 'AI'}
                                    </span>
                                </div>
                                <ReactMarkdown className="prose prose-invert prose-sm sm:prose flex-1 overflow-auto text-sm sm:text-base">
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="p-3 sm:p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                            <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
                                <Loader2Icon className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                                <p className="font-medium text-sm sm:text-base">Generating response...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Section */}
            <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <textarea
                                placeholder="Type your message here..."
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 sm:p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none h-20 sm:h-24 lg:h-32 mobile-input"
                            />
                            {userInput && (
                                <button
                                    onClick={() => onGenerate(userInput)}
                                    className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-4 py-3 sm:px-4 sm:py-4 transition-all duration-200 self-end sm:self-auto mobile-touch-target"
                                >
                                    <Send className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </button>
                            )}
                        </div>
                        <div className="flex justify-end mt-2 sm:mt-3">
                            <Link className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300 transition-colors duration-200" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;