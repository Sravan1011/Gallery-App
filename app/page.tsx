'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Camera, Globe, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">PixelSync</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/gallery" className="hidden md:block text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Gallery
            </Link>
            <Link href="/feed" className="hidden md:block text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Global Feed
            </Link>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Real-time Interaction Engine
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
              Experience visual <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                storytelling synchronized.
              </span>
            </h1>
            <p className="text-xl text-neutral-400 mb-10 max-w-lg leading-relaxed font-light">
              A real-time gallery where every reaction, comment, and look happens instantly across user sessions. No refreshes. Just pure sync.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-indigo-600 text-white rounded-full text-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 px-8 h-12 transition-all hover:scale-105">
                <Link href="/gallery" className="group flex items-center gap-2">
                  Start Exploring
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full text-lg bg-transparent text-white border-white/10 hover:bg-white/5 px-8 h-12 backdrop-blur-sm hover:border-white/20">
                <Link href="/feed">View Activity</Link>
              </Button>
            </div>
          </motion.div>

          {/* New Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
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
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6" >
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
