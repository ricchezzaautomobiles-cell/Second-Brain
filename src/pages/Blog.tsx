import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Share2, Sparkles, User } from "lucide-react";
import { SEO } from "../components/SEO";
import { blogPosts, BlogPost } from "../data/blogPosts";
import { Button } from "../components/ui/Base";

export default function Blog() {
  const { slug } = useParams<{ slug?: string }>();
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (slug) {
      const post = blogPosts.find((p) => p.slug === slug);
      setActivePost(post || null);
      window.scrollTo(0, 0);
    } else {
      setActivePost(null);
    }
  }, [slug]);

  // Handle article reading scroll progress
  useEffect(() => {
    if (!activePost) return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activePost]);

  // General Blog schema markup
  const indexSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Beyond Chronicles - Mind & Focus Blog",
    "description": "Leading research on dopamine overload, cognitive enhancement, mental optimization, and digital overstimulation.",
    "publisher": {
      "@type": "Organization",
      "name": "Beyond"
    }
  };

  // Render Single Post
  if (activePost) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": activePost.title,
      "description": activePost.description,
      "datePublished": "2026-05-24T12:00:00Z",
      "author": {
        "@type": "Person",
        "name": activePost.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "Beyond",
        "logo": "https://beyond.openminded.vercel.app/logo.png"
      },
      "image": activePost.image,
      "mainEntityOfPage": `https://beyond.openminded.vercel.app/blog/${activePost.slug}`
    };

    return (
      <article className="relative min-h-screen bg-[#050505] text-[#f5f5f7] pb-32">
        <SEO 
          title={activePost.title} 
          description={activePost.description}
          keywords={activePost.keywords.join(", ")}
          canonical={`https://beyond.openminded.vercel.app/blog/${activePost.slug}`}
          schema={articleSchema}
        />

        {/* Scroll Progress Bar */}
        <div className="fixed top-20 left-0 right-0 h-1 bg-white/5 z-50">
          <div 
            className="h-full bg-blue-500 transition-all duration-75" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Hero image header */}
        <section className="relative h-[60vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
          <img 
            src={activePost.image} 
            alt={activePost.title}
            className="w-full h-full object-cover brightness-50 z-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="max-w-4xl mx-auto px-6 w-full pb-12 space-y-4">
              <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors mb-4">
                <ArrowLeft size={14} />
                Return to Chronicles
              </Link>
              <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white leading-tight">
                {activePost.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-light text-white/40">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{activePost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{activePost.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-3xl mx-auto px-6 pt-16 grid grid-cols-1 gap-10">
          {/* Author Block */}
          <div className="flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex items-center gap-4">
              <img 
                src={activePost.author.avatar} 
                alt={activePost.author.name}
                className="w-12 h-12 rounded-full object-cover border border-white/10"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-medium text-sm text-white">{activePost.author.name}</h4>
                <p className="text-xs text-white/40">{activePost.author.role}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("URL copied to clipboard!");
              }}
              className="p-2 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              title="Share article"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Article Paragraphs */}
          <div className="space-y-8 text-base md:text-lg font-light text-white/70 leading-relaxed tracking-wide">
            {activePost.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Quote block */}
          {activePost.quotes.map((quote, i) => (
            <div key={i} className="my-6 p-8 rounded-3xl border-l-4 border-blue-500 bg-white/[0.01]">
              <p className="text-lg md:text-xl font-light italic text-white/90">
                "{quote}"
              </p>
            </div>
          ))}

          {/* Footer tags */}
          <div className="border-t border-white/5 pt-8 flex flex-wrap gap-2">
            {activePost.keywords.map((kw, i) => (
              <span key={i} className="text-[10px] uppercase tracking-widest bg-white/5 text-white/40 px-3 py-1.5 rounded-full font-medium">
                #{kw}
              </span>
            ))}
          </div>

          {/* Related Articles */}
          <div className="border-t border-white/5 pt-16 space-y-8">
            <h3 className="text-xl font-light tracking-tight text-white">Recommended Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogPosts
                .filter((p) => p.id !== activePost.id)
                .slice(0, 2)
                .map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`}
                    className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all flex flex-col justify-between"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold">{post.readTime}</span>
                    <h4 className="font-light text-base text-white hover:underline mt-2 line-clamp-2">{post.title}</h4>
                  </Link>
                ))
              }
            </div>
          </div>
        </section>
      </article>
    );
  }

  // Render Index Grid
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7] pb-32">
      <SEO 
        title="Chronicles & Cognitive Research" 
        description="Escape the reaction treadmill of continuous scroll formats. Immerse in essays targeting dopamine loops, overthinking solutions, and AI-assisted clarity."
        keywords="dopamine overload, deep thinking, focus improvement, cognitive clarity, overthinking solution, modern distraction"
        canonical="https://beyond.openminded.vercel.app/blog"
        schema={indexSchema}
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-white/30 block pb-2">Cognitive Chronicles</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-gradient leading-none">
            The Signal.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            Delve into deeper inquiries about brain biology, systemic distractions, AI focus helpers, and returning to deep sustained thinking.
          </p>
        </motion.div>
      </section>

      {/* Blog Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.8 }}
              className="group rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden hover:border-white/10 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden shrink-0">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-white border border-white/10">
                  {post.readTime}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{post.date}</div>
                  <h3 className="text-xl font-light leading-snug text-white group-hover:text-blue-300 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light line-clamp-2 pt-1">{post.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                  <span className="text-[11px] font-light text-white/50 italic">By {post.author.name}</span>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-white/30 group-hover:text-white transition-colors"
                  >
                    Read Essay
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center relative overflow-hidden mt-16 border border-white/5 rounded-[3rem] bg-white/[0.01] glass-morphism">
        <div className="absolute inset-0 bg-blue-500/5 blur-[80px] pointer-events-none" />
        <div className="space-y-6 relative z-10 max-w-md mx-auto">
          <Sparkles size={24} className="mx-auto text-blue-400" />
          <h3 className="text-2xl font-light tracking-tight text-white">Subscribe to the Signal</h3>
          <p className="text-xs text-white/40 font-light leading-relaxed">
            Get analytical cognitive research and strategic thinking advice delivered straight to your inbox once a fortnight. Zero noise. Guaranteed.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Signal subscribed successfully!");
              (e.target as any).reset();
            }}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-white/20 outline-none flex-1 text-white text-xs"
            />
            <Button type="submit" size="sm" className="rounded-xl px-6 bg-white text-black hover:bg-white/90 shrink-0 text-xs py-2.5 h-auto font-bold">
              Join List
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
