"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Link, Loader2Icon, Send } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState, useCallback, memo } from 'react';
import { useMutation } from 'convex/react';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const MessageItem = memo(({ msg, index }) => (
    <div
        className={`p-4 rounded-lg ${
            msg.role === 'user' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-gray-800/30 border border-gray-700'
        }`}
    >
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
                msg.role === 'user' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-purple-500/20 text-purple-400'
            }`}>
                {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <ReactMarkdown className="prose prose-invert flex-1 overflow-auto">
                {msg.content}
            </ReactMarkdown>
        </div>
    </div>
));

MessageItem.displayName = 'MessageItem';

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateWorkspace);

    const GetWorkSpaceData = useCallback(async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages);
    }, [id, convex, setMessages]);

    useEffect(() => {
        id && GetWorkSpaceData();
    }, [id, GetWorkSpaceData]);

    const GetAiResponse = useCallback(async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        
        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: PROMPT }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            // Add placeholder AI message for streaming
            const aiMessageIndex = messages.length;
            setMessages(prev => [...prev, { role: 'ai', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.chunk) {
                                fullText += data.chunk;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[aiMessageIndex] = { role: 'ai', content: fullText };
                                    return updated;
                                });
                            }
                            if (data.done && data.result) {
                                fullText = data.result;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[aiMessageIndex] = { role: 'ai', content: fullText };
                                    return updated;
                                });
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            const finalMessages = [...messages, { role: 'ai', content: fullText }];
            await UpdateMessages({
                messages: finalMessages,
                workspaceId: id
            });
        } catch (error) {
            console.error('Error getting AI response:', error);
        } finally {
            setLoading(false);
        }
    }, [messages, id, UpdateMessages, setMessages]);

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages, GetAiResponse]);

    const onGenerate = useCallback((input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }]);
        setUserInput('');
    }, [setMessages]);

    return (
        <div className="relative h-[85vh] flex flex-col bg-gray-900">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {Array.isArray(messages) && messages?.map((msg, index) => (
                        <MessageItem key={index} msg={msg} index={index} />
                    ))}
                    
                    {loading && (
                        <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Loader2Icon className="animate-spin h-5 w-5" />
                                <p className="font-medium">Generating response...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Section */}
            <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        <div className="flex gap-3">
                            <textarea
                                placeholder="Type your message here..."
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none h-32"
                            />
                            {userInput && (
                                <button
                                    onClick={() => onGenerate(userInput)}
                                    className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-4 transition-all duration-200"
                                >
                                    <Send className="h-6 w-6 text-white" />
                                </button>
                            )}
                        </div>
                        <div className="flex justify-end mt-3">
                            <Link className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors duration-200" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;