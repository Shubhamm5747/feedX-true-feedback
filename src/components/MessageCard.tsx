'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from "sonner"
import { ApiResponse } from '@/types/ApiResponse';
import mongoose from 'mongoose';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId : string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );
            toast(response.data.message)
            onMessageDelete(message._id)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(<div>
                <strong className="text-base font-medium">Error</strong>
                <p className="text-sm text-gray-600">{axiosError.response?.data.message ?? 'Failed to delete message'}!</p>
            </div>)
        }
    };

    return (
        <Card className="card-bordered shadow-sm hover:shadow transition-shadow">
            <CardHeader className="p-4 sm:p-6">
                <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-base sm:text-lg break-words flex-1 leading-snug">
                        {message.content}
                    </CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive' size='icon' className="shrink-0 size-8 sm:size-9">
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[90vw] max-w-md rounded-lg">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm">
                                    This action cannot be undone. This will permanently delete
                                    this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                <AlertDialogCancel className="mt-0">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
        </Card>
    );
}