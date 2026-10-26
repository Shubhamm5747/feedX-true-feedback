'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner"
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(<div>
                <strong className="text-base font-medium">Error</strong>
                <p className="text-sm text-gray-600">{axiosError.response?.data.message ??
                    'Failed to fetch message settings'}!</p>
            </div>)
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setIsSwitchLoading(false);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast.success("Refreshed Messages");
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(<div>
                    <strong className="text-base font-medium">Error</strong>
                    <p className="text-sm text-gray-600">{axiosError.response?.data.message ?? 'Failed to fetch messages'}!</p>
                </div>)
            } finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages, toast]
    );

    // Fetch initial state from the server
    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();

        fetchAcceptMessages();
    }, [session, setValue, fetchAcceptMessages, fetchMessages]);

    // Handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(<div>
                <strong className="text-base font-medium">Error</strong>
                <p className="text-sm text-gray-600">{axiosError.response?.data.message ??
                    'Failed to update message settings'}!</p>
            </div>)
        }
    };

    if (!session || !session.user) {
        return <div></div>;
    }

    const { username } = session.user as User;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = async () => {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(profileUrl);
                toast.success(<div>
                    <strong className="text-base font-medium">URL Copied!</strong>
                    <p className="text-sm text-gray-600">Profile URL has been copied to clipboard!</p>
                </div>);
                return;
            } catch (err) {
                console.error("Clipboard API failed, falling back to execCommand", err);
            }
        }

        // Fallback for non-secure contexts (like accessing via local IP)
        const textArea = document.createElement("textarea");
        textArea.value = profileUrl;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        textArea.style.pointerEvents = "none";
        document.body.appendChild(textArea);
        textArea.focus({ preventScroll: true });
        textArea.select();
        try {
            document.execCommand('copy');
            toast.success(<div>
                <strong className="text-base font-medium">URL Copied!</strong>
                <p className="text-sm text-gray-600">Profile URL has been copied to clipboard!</p>
            </div>);
        } catch (err) {
            toast.error("Failed to copy URL");
        } finally {
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="my-6 sm:my-8 mx-3 sm:mx-6 md:mx-8 lg:mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm w-full max-w-6xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">User Dashboard</h1>

            <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2.5 text-xs sm:text-sm bg-gray-50 border rounded-md truncate"
                    />
                    <Button onClick={copyToClipboard} className="w-full sm:w-auto shrink-0">
                        Copy
                    </Button>
                </div>
            </div>

            <div className="mb-6 flex items-center gap-2">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="text-sm sm:text-base font-medium">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <div className="flex items-center justify-between mt-6 mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Your Messages</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchMessages(true);
                    }}
                    title="Refresh Messages"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p className="text-sm sm:text-base text-gray-500 py-4 col-span-full text-center">
                        No messages to display.
                    </p>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;