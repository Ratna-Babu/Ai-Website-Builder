"use client"
import React, { use, useContext } from 'react';
import { useState } from 'react';
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useEffect } from 'react';
import { UpdateFiles } from '@/convex/workspace';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download } from 'lucide-react';
import JSZip from 'jszip';

function CodeView() {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files,setFiles]=useState(Lookup?.DEFAULT_FILE);
    const {messages,setMessages}=useContext(MessagesContext);
    const UpdateFiles=useMutation(api.workspace.UpdateFiles);
    const convex=useConvex();
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        id&&GetFiles();
    }, [id])

    const GetFiles=async()=>{
        const result=await convex.query(api.workspace.GetWorkspace,{
            workspaceId:id
        });
        // Preprocess and validate files before merging
        const processedFiles = preprocessFiles(result?.fileData || {});
        const mergedFiles = {...Lookup.DEFAULT_FILE, ...processedFiles};
        setFiles(mergedFiles);
    }

    // Add file preprocessing function
    const preprocessFiles = (files) => {
        const processed = {};
        Object.entries(files).forEach(([path, content]) => {
            // Ensure the file has proper content structure
            if (typeof content === 'string') {
                processed[path] = { code: content };
            } else if (content && typeof content === 'object') {
                if (!content.code && typeof content === 'object') {
                    processed[path] = { code: JSON.stringify(content, null, 2) };
                } else {
                    processed[path] = content;
                }
            }
        });
        return processed;
    }

    useEffect(() => {
            if (messages?.length > 0) {
                const role = messages[messages?.length - 1].role;
                if (role === 'user') {
                    GenerateAiCode();
                }
            }
        }, [messages])

    const GenerateAiCode=async()=>{
        setLoading(true);
        const PROMPT=JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT;
        const result=await axios.post('/api/gen-ai-code',{
            prompt:PROMPT
        });
        
        // Preprocess AI-generated files
        const processedAiFiles = preprocessFiles(result.data?.files || {});
        const mergedFiles = {...Lookup.DEFAULT_FILE, ...processedAiFiles};
        setFiles(mergedFiles);

        await UpdateFiles({
            workspaceId:id,
            files:result.data?.files
        });
        setLoading(false);
    }
    
    const downloadFiles = async () => {
        try {
            // Create a new JSZip instance
            const zip = new JSZip();
            
            // Add each file to the zip
            Object.entries(files).forEach(([filename, content]) => {
                // Handle the file content based on its structure
                let fileContent;
                if (typeof content === 'string') {
                    fileContent = content;
                } else if (content && typeof content === 'object') {
                    if (content.code) {
                        fileContent = content.code;
                    } else {
                        // If it's an object without code property, stringify it
                        fileContent = JSON.stringify(content, null, 2);
                    }
                }

                // Only add the file if we have content
                if (fileContent) {
                    // Remove leading slash if present
                    const cleanFileName = filename.startsWith('/') ? filename.slice(1) : filename;
                    zip.file(cleanFileName, fileContent);
                }
            });

            // Add package.json with dependencies
            const packageJson = {
                name: "generated-project",
                version: "1.0.0",
                private: true,
                dependencies: Lookup.DEPENDANCY,
                scripts: {
                    "dev": "vite",
                    "build": "vite build",
                    "preview": "vite preview"
                }
            };
            zip.file("package.json", JSON.stringify(packageJson, null, 2));

            // Generate the zip file
            const blob = await zip.generateAsync({ type: "blob" });
            
            // Create download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'project-files.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    };

    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full p-2 sm:p-3 border rounded-t-lg'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0'>
                    <div className='flex items-center flex-wrap shrink-0 bg-black p-1 justify-center
                    w-full sm:w-[140px] gap-2 sm:gap-3 rounded-full'>
                        <h2 onClick={() => setActiveTab('code')}
                            className={`text-xs sm:text-sm cursor-pointer px-2 py-1 rounded-full transition-all
                        ${activeTab == 'code' ? 'text-blue-500 bg-blue-500 bg-opacity-25' : 'hover:bg-gray-700'}`}>
                            Code</h2>

                        <h2 onClick={() => setActiveTab('preview')}
                            className={`text-xs sm:text-sm cursor-pointer px-2 py-1 rounded-full transition-all
                        ${activeTab == 'preview' ? 'text-blue-500 bg-blue-500 bg-opacity-25' : 'hover:bg-gray-700'}`}>
                            Preview</h2>
                    </div>
                    
                    {/* Download Button */}
                    <button
                        onClick={downloadFiles}
                        className="flex items-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full transition-colors duration-200 text-xs sm:text-sm mobile-touch-target"
                    >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Download Files</span>
                        <span className="sm:hidden">Download</span>
                    </button>
                </div>
            </div>
            <SandpackProvider 
            files={files}
            template="react" 
            theme={'dark'}
            customSetup={{
                dependencies: {
                    ...Lookup.DEPENDANCY
                },
                entry: '/index.js'
            }}
            options={{
                externalResources: ['https://cdn.tailwindcss.com'],
                bundlerTimeoutSecs: 120,
                recompileMode: "immediate",
                recompileDelay: 300
            }}
            >
                <div className="relative">
                    <SandpackLayout>
                        {activeTab=='code'?<>
                            <SandpackFileExplorer style={{ height: '50vh', minHeight: '400px' }} />
                            <SandpackCodeEditor 
                            style={{ height: '50vh', minHeight: '400px' }}
                            showTabs
                            showLineNumbers
                            showInlineErrors
                            wrapContent />
                        </>:
                        <>
                            <SandpackPreview 
                                style={{ height: '50vh', minHeight: '400px' }} 
                                showNavigator={true}
                                showOpenInCodeSandbox={false}
                                showRefreshButton={true}
                            />
                        </>}
                    </SandpackLayout>
                </div>
            </SandpackProvider>

            {loading&&<div className='p-10 bg-gray-900 opacity-80 absolute top-0 
            rounded-lg w-full h-full flex items-center justify-center'>
                <Loader2Icon className='animate-spin h-10 w-10 text-white'/>
                <h2 className='text-white'> Generating files...</h2>
            </div>}
        </div>
    );
}

export default CodeView;