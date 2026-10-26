"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { MessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";

export default function SendMessagePage() {
  const params = useParams<{ username: string }>();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });

      toast.success(response.data.message || "Message sent successfully!");
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        <div>
          <strong className="text-base font-medium">Error</strong>
          <p className="text-sm text-gray-600">
            {axiosError.response?.data.message ?? "An error occurred. Please try again!"}
          </p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setIsSuggesting(true);
    setSuggestedMessages("");
    try {
      const res = await fetch("/api/suggest-messages", { method: "POST" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSuggestedMessages(data.text);
    } catch (e) {
      toast.error("Failed to fetch suggestions");
    } finally {
      setIsSuggesting(false);
    }
  };

  /*
  // ============================================================================
  // ALTERNATIVE: REAL-TIME STREAMING CONSUMER (FOR OPENAI STREAMING)
  // ============================================================================
  // This function demonstrates how to read a streamed response chunk-by-chunk.
  //
  // React State Variables Used (defined at lines 17-18 of this component):
  // - `isSuggesting` (boolean): Controls loading spinner on the "Suggest Messages" button.
  //   -> `setIsSuggesting(true)`: Disables the button and shows "Suggesting..."
  //   -> `setIsSuggesting(false)`: Re-enables the button when done.
  // - `suggestedMessages` (string): Holds the raw concatenated questions string (e.g., "Q1? || Q2? || Q3?").
  //   -> `setSuggestedMessages("")`: Clears previous suggestions before new ones arrive.
  //   -> `setSuggestedMessages(prev => prev + chunk)`: Appends incoming text tokens in real time.
  //
  // How to enable this:
  // 1. Comment out the `fetchSuggestions` function above.
  // 2. Uncomment `fetchSuggestionsStream` below and rename it to `fetchSuggestions` (or update the button onClick).

  const fetchSuggestionsStream = async () => {
    // Step 1: Set UI to loading state and reset any previous suggestions
    setIsSuggesting(true);
    setSuggestedMessages("");

    try {
      // Step 2: Request the streamed response from our API route
      const response = await fetch("/api/suggest-messages", { method: "POST" });
      
      // Step 3: Verify the server responded with OK (status 200-299) and has a readable stream body
      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch suggestions from server");
      }

      // Step 4: Access the native Web Stream reader and a text decoder
      // - reader: Reads raw incoming binary chunks (Uint8Array) from the HTTP stream
      // - decoder: Converts binary Uint8Array chunks into readable UTF-8 string text
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Step 5: Read incoming chunks continuously in a loop until the stream is complete
      while (true) {
        const { done, value } = await reader.read();

        // If `done` is true, the server has finished sending all tokens
        if (done) break;

        // Decode the binary bytes into a text string
        const chunk = decoder.decode(value, { stream: true });

        // Progressively append each newly received token to the React state.
        // Because `parsedSuggestions` splits this state by '||', questions will
        // appear and complete in real time on the screen!
        setSuggestedMessages((prev) => prev + chunk);
      }
    } catch (error) {
      toast.error("Failed to fetch suggestions");
      console.error("Streaming error:", error);
    } finally {
      // Step 6: Reset loading state so user can click the button again
      setIsSuggesting(false);
    }
  };
  */

  const handleSuggestionClick = (message: string) => {
    form.setValue("content", message.trim());
  };

  // Split the streamed result by '||'
  const parsedSuggestions = suggestedMessages
    .split("||")
    .map((msg) => msg.trim())
    .filter((msg) => msg.length > 0);

  return (
    <div className="my-6 sm:my-8 mx-3 sm:mx-6 md:mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm max-w-4xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">
                  Send Anonymous Message to <span className="font-semibold break-all">@{params.username}</span>
                </FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Write your anonymous message here..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background p-3 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="w-full sm:w-auto px-8">
                Please wait...
              </Button>
            ) : (
              <Button type="submit" className="w-full sm:w-auto px-8">
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button onClick={fetchSuggestions} className="w-full sm:w-auto" disabled={isSuggesting}>
            {isSuggesting ? "Suggesting..." : "Suggest Messages"}
          </Button>
          <p className="text-xs sm:text-sm text-gray-500">Click on any message below to select it.</p>
        </div>

        <div className="p-3 sm:p-4 border border-input rounded-lg bg-gray-50 flex flex-col gap-2.5 sm:gap-3 min-h-[100px]">
          {parsedSuggestions.length > 0 ? (
            parsedSuggestions.map((message, index) => (
              <div
                key={index}
                className="p-3 sm:p-3.5 border rounded-md cursor-pointer bg-white shadow-xs hover:bg-gray-100 transition-colors text-xs sm:text-sm break-words leading-relaxed"
                onClick={() => handleSuggestionClick(message)}
              >
                {message}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center text-xs sm:text-sm py-4">
              {isSuggesting ? "Generating suggestions..." : "No suggestions yet. Click the button to generate some."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
