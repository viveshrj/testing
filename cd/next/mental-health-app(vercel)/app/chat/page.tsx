// app/chat/page.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import {  Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const Chatbot = () => {
    return (
        <Card>
            <CardHeader>
                <MessageSquare />
                <h2>Chatbot</h2>
            </CardHeader>
            <CardContent>
                <p>Interact with our AI-powered chatbot to get instant support and guidance.</p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => window.location.href = '/chat'}>Start Chat</Button>
            </CardFooter>
        </Card>
    );
};

export default Chatbot;