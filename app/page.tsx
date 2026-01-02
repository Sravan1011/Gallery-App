'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, MessageSquare, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <Zap className="w-6 h-6 text-indigo-600" />
            <span>PixelSync</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200">
              <Link href="/gallery">Launch App</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Experience logic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                at the speed of light.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              A real-time gallery where every reaction, comment, and look happens instantly across the globe. No refreshes. Just sync.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-slate-900 text-white rounded-full text-lg hover:bg-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                <Link href="/gallery" className="group flex items-center gap-2">
                  Start Exploring
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-lg bg-white hover:bg-slate-50 text-slate-900 border-slate-200">
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {/* Mockup Images - using placeholders creatively */}
              <div className="space-y-4 translate-y-8">
                <div className="h-64 bg-indigo-100 rounded-2xl overflow-hidden shadow-lg border border-indigo-50 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-sm font-medium">✨ Sarah liked this</span>
                  </div>
                </div>
                <div className="h-48 bg-purple-100 rounded-2xl overflow-hidden shadow-lg border border-purple-50"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-pink-100 rounded-2xl overflow-hidden shadow-lg border border-pink-50"></div>
                <div className="h-64 bg-slate-200 rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative">
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm text-indigo-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for instant gratification.</h2>
            <p className="text-lg text-slate-600">
              Why wait for a reload? PixelSync keeps everyone on the same page, literally and figuratively.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ImageIcon className="w-8 h-8 text-indigo-600" />}
              title="Beautiful Gallery"
              description="Explore high-quality images from Unsplash in a seamless, infinite-scrolling grid layout."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-purple-600" />}
              title="Real-time Reactions"
              description="See emojis fly across the screen as users react to images instantly. No latency."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-pink-600" />}
              title="Live Comments"
              description="Engage in conversations that update live. Chat with others viewing the same masterpiece."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-24 text-center overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to sync up?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Join the real-time gallery experience today and start interacting with art and people in a whole new way.
            </p>
            <Button asChild size="lg" className="rounded-full text-lg font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-xl h-auto py-4 px-8">
              <Link href="/gallery" className="flex items-center gap-2">
                Get Started Now
              </Link>
            </Button>
          </div>

          {/* Background effects */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900 to-slate-900"></div>
        </div>
      </section>

      <footer className="py-12 text-center text-slate-500 text-sm">
        <p>© 2026 PixelSync. Built with Next.js & InstantDB.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all hover:translate-y-[-4px] group">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
