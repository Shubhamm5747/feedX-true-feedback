'use client'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from 'zod'

const page = () => {
    const router = useRouter()
    const param = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: param.username,
                code: data.code,
            });

            toast.success(response.data.message)

            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            // toast({
            //     title: 'Verification Failed',
            //     description:
            //         axiosError.response?.data.message ??
            //         'An error occurred. Please try again.',
            //     variant: 'destructive',
            // });
            toast.error(
                <div>
                    <strong className="text-base font-medium">Verification Failed</strong>
                    <p className="text-sm text-gray-600">An error occurred. Please try again!</p>
                </div>
            )
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
            <div className="w-full max-w-md p-6 sm:p-8 space-y-6 sm:space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-4">
                        Verify Your Account
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} placeholder="Enter 6-digit code" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page
