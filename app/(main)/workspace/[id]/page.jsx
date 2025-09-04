import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React from 'react';

const Workspace = () => {
    return (
        <div className="min-h-screen bg-gray-950 relative overflow-hidden mobile-container">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle_400px_at_50%_300px,#3b82f625,transparent)]" />
            </div>

            {/* Content */}
            <div className='relative z-10 mobile-safe-padding py-4 sm:py-6 lg:py-10'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10'>
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <ChatView />
                    </div>
                    <div className='lg:col-span-3 order-1 lg:order-2'>
                        <CodeView />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;