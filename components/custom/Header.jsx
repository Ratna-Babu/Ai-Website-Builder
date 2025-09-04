import React from 'react';
import { Code, Sparkles } from 'lucide-react';

function Header() {
    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 sm:p-2 rounded-lg">
                            <Code className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-white leading-tight">
                            <span className="hidden sm:inline">AI Powered Website Builder</span>
                            <span className="sm:hidden">AI Builder</span>
                        </h1>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                        <div className="flex items-center space-x-1 sm:space-x-2 bg-green-500/10 text-green-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">AI Ready</span>
                            <span className="sm:hidden">Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;