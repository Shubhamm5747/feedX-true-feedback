'use client';

import { Card, CardContent, CardHeader} from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 md:px-24 py-8 sm:py-12 min-h-[calc(100vh-140px)]">
        <section className="text-center mb-6 sm:mb-10 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-700">
            FeedX - True Feedback
          </p>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Where your identity remains a secret
          </p>
        </section>

        {/* Carousel for Messages */}
        <div className="w-full flex justify-center px-2">
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2 sm:p-4">
                  <Card className="shadow-md">
                    <CardHeader className="text-base sm:text-lg font-semibold pb-2">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6 text-center">
                      <div>
                        <span className="text-sm sm:text-base leading-relaxed">{message.content}</span>
                        <p className="text-xs text-muted-foreground mt-3">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Hide buttons on small mobile to prevent horizontal page overflow, swipe works via touch */}
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white text-xs sm:text-sm">
        © 2025 FeedX - True Feedback. All rights reserved.
      </footer>
    </>
  );
}