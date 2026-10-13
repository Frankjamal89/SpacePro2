import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Clock, ArrowLeft, Bookmark, Heart, Share2, CornerDownRight, BookOpen } from 'lucide-react';
import { JournalPost, JournalCategory } from '../types';
import { JOURNAL_POSTS } from '../data';

interface JournalSectionProps {
  posts?: JournalPost[];
}

export default function JournalSection({ posts }: JournalSectionProps) {
  const JOURNAL_POSTS_LIST = posts || JOURNAL_POSTS;
  const [activeCategory, setActiveCategory] = useState<JournalCategory | 'All'>('All');
  const [readingPost, setReadingPost] = useState<JournalPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const categories: (JournalCategory | 'All')[] = [
    'All',
    'Design Inspiration',
    'Luxury Living',
    'Interior Trends',
    'Architecture',
    'Property Enhancement',
    'Design Guides'
  ];

  // Filter posts based on category
  const filteredPosts = activeCategory === 'All' 
    ? JOURNAL_POSTS_LIST 
    : JOURNAL_POSTS_LIST.filter(post => post.category === activeCategory);

  const toggleLike = (postId: string, e: MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const shareArticle = (post: JournalPost, e: MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      alert(`Copied link for: "${post.title}" to clipboard.`);
    }
  };

  return (
    <div id="journal-comp" className="w-full">
      <AnimatePresence mode="wait">
        {readingPost ? (
          /* DEEP ARTICLE READER VIEW (MAGAZINE SPREAD) */
          <motion.div
            key="reader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto text-left space-y-12 font-sans"
          >
            {/* Header / Back Action */}
            <button
              onClick={() => {
                setReadingPost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-brand-green focus:outline-none transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Journal Compendium</span>
            </button>

            {/* Title / Meta block */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] bg-brand-green/10 text-brand-green px-3.5 py-1.5 rounded-full font-medium">
                {readingPost.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-medium text-brand-charcoal tracking-tight leading-tight">
                {readingPost.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 border-y border-brand-border py-4 font-sans">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-green" />
                  <span>{readingPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-green" />
                  <span>{readingPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-green" />
                  <span>{readingPost.readTime}</span>
                </div>
              </div>
            </div>

            {/* Immersive Splash Image */}
            <div className="h-[400px] md:h-[500px] w-full overflow-hidden bg-brand-gray border border-brand-border rounded-sm">
              <img 
                src={readingPost.previewImage} 
                alt={readingPost.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Drop cap and lead summary */}
            <p className="text-xl font-editorial font-light text-brand-charcoal leading-relaxed border-l-4 border-brand-green pl-6 italic">
              {readingPost.summary}
            </p>

            {/* Article Paragraphs */}
            <div className="space-y-6 text-sm font-light text-gray-600 leading-relaxed max-w-3xl">
              {readingPost.paragraphs.map((para, i) => (
                <p key={i}>
                  {i === 0 ? (
                    <span className="float-left text-6xl font-display font-semibold text-brand-green pr-3 -mt-2 leading-none">
                      {para.charAt(0)}
                    </span>
                  ) : null}
                  {i === 0 ? para.slice(1) : para}
                </p>
              ))}
            </div>

            {/* Premium Editorial Callout Quote */}
            {readingPost.quote && (
              <div className="bg-brand-gray p-8 border border-brand-border text-center rounded-sm space-y-3 my-12">
                <p className="text-lg font-editorial italic text-brand-charcoal leading-relaxed max-w-xl mx-auto">
                  "{readingPost.quote}"
                </p>
                <div className="text-[10px] uppercase tracking-widest text-brand-green font-semibold">— Editorial Extract</div>
              </div>
            )}

            {/* Article Action Share Bar */}
            <div className="flex items-center justify-between border-t border-brand-border pt-8 mt-12">
              <div className="flex gap-4">
                <button
                  onClick={(e) => toggleLike(readingPost.id, e)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-green focus:outline-none transition-colors"
                >
                  <Heart className={`w-4 h-4 ${likedPosts[readingPost.id] ? 'text-red-600 fill-red-600' : ''}`} />
                  <span>{likedPosts[readingPost.id] ? 'Bookmarked' : 'Saves'}</span>
                </button>
                <button
                  onClick={(e) => shareArticle(readingPost, e)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-green focus:outline-none transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Article</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setReadingPost(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-green font-medium"
              >
                Return to Directory
              </button>
            </div>
          </motion.div>
        ) : (
          /* MAGAZINE ARCHIVE VIEW */
          <motion.div
            key="directory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Category Navigation Ribbon */}
            <div className="flex flex-wrap gap-2 justify-center border-b border-brand-border pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all focus:outline-none rounded-full ${
                    activeCategory === cat 
                      ? 'bg-brand-green text-white font-medium' 
                      : 'bg-brand-gray text-gray-500 hover:text-brand-charcoal hover:bg-brand-border/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Layout grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              
              {/* PRIMARY FEATURE STORY (Left Column - Spans 7 cols if all, or full width if filtered) */}
              <div className={`${filteredPosts.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
                {filteredPosts.length > 0 ? (
                  <div 
                    onClick={() => {
                      setReadingPost(filteredPosts[0]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer space-y-6"
                  >
                    <div className="relative h-[360px] md:h-[450px] w-full overflow-hidden bg-brand-gray border border-brand-border rounded-sm">
                      <img 
                        src={filteredPosts[0].previewImage} 
                        alt={filteredPosts[0].title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.015]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute left-6 top-6 bg-white/95 text-brand-charcoal text-[10px] uppercase tracking-widest px-3 py-1 font-sans rounded-xs border border-brand-border shadow-sm">
                        {filteredPosts[0].category}
                      </div>
                    </div>

                    <div className="space-y-3 font-sans">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{filteredPosts[0].author}</span>
                        <span>•</span>
                        <span>{filteredPosts[0].date}</span>
                      </div>
                      <h3 className="text-3xl font-display font-medium text-brand-charcoal tracking-tight group-hover:text-brand-green transition-colors leading-tight">
                        {filteredPosts[0].title}
                      </h3>
                      <p className="text-sm font-light text-gray-500 leading-relaxed">
                        {filteredPosts[0].summary}
                      </p>
                      <div className="pt-2 text-xs uppercase tracking-widest text-brand-charcoal group-hover:text-brand-green font-semibold flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-brand-green" /> Read Full Article
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-brand-gray border border-brand-border">
                    <p className="text-sm text-gray-400 font-light">No articles published in this category yet.</p>
                  </div>
                )}
              </div>

              {/* SECONDARY FEED STORIES (Right Column - Spans 4 cols) */}
              {filteredPosts.length > 1 && (
                <div className="lg:col-span-4 space-y-8 border-t lg:border-t-0 lg:border-l border-brand-border lg:pl-8 pt-8 lg:pt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <CornerDownRight className="w-4 h-4 text-brand-green" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Secondary Compilations</span>
                  </div>

                  <div className="space-y-8 divide-y divide-brand-border/60">
                    {filteredPosts.slice(1).map((post, index) => (
                      <div 
                        key={post.id}
                        onClick={() => {
                          setReadingPost(post);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`group cursor-pointer text-left space-y-4 ${index > 0 ? 'pt-8' : ''}`}
                      >
                        <div className="relative h-48 w-full overflow-hidden bg-brand-gray border border-brand-border rounded-xs">
                          <img 
                            src={post.previewImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        <div className="space-y-2 font-sans">
                          <div className="text-[10px] uppercase tracking-wider text-brand-green font-medium">
                            {post.category}
                          </div>
                          <h4 className="text-base font-display text-brand-charcoal font-medium group-hover:text-brand-green transition-colors leading-snug">
                            {post.title}
                          </h4>
                          <p className="text-xs font-light text-gray-400 line-clamp-2 leading-relaxed">
                            {post.summary}
                          </p>
                          <div className="text-[10px] uppercase tracking-widest text-brand-charcoal group-hover:text-brand-green font-semibold flex items-center gap-1 mt-1">
                            <span>Open Spread</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
