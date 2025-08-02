import { link } from 'fs';
import React from 'react';

const ResearchBentoGrid = () => {
  const gridItems = [
    {
      id: 1,
      title: "Listening On Loop",
      subtitle: "Apple Music",
      bgImage: "/music.jpg",
      link: "https://music.apple.com/in/playlist/bluetooth-era/pl.u-vxy69yxCWpexVmd",
      gridArea: "1 / 1 / 4 / 2"
    },
    {
      id: 2,
      title: "What's Happening",
      subtitle: "AI · Buisness",
      bgImage: "/genai_articles.jpg",
      link: "https://aibusiness.com/generative-ai",
      gridArea: "1 / 2 / 2 / 4"
    },
    {
      id: 3,
      title: "Inside OpenAI: Coaching the People Creating AGI | Joe Hudson, Founder of The Art of Accomplishment",
      subtitle: "Apple Podcast",
      bgImage: "/podcast_ai_i.jpg",
      link: "https://podcasts.apple.com/in/podcast/ai-i/id1719789201?i=1000713446493",
      gridArea: "1 / 4 / 3 / 6"
    },
    {
      id: 4,
      title: "Transformer-Squared: Self-adaptive LLMs",
      subtitle: "Research Paper - Institute of Science, Tokyo",
      bgImage: "/research1.jpg",
      link: "https://arxiv.org/html/2501.06252v3",
      gridArea: "2 / 2 / 4 / 4"
    },
    {
      id: 5,
      title: "Pharmacy Management",
      subtitle: "SQLite3 Integrated with Tkinter - Local Project",
      bgImage: "/projectlogo.jpeg",
      link: "https://github.com/NirmanPatel036/sqlite3-with-tkinter-integration/tree/main/Project",
      gridArea: "3 / 4 / 4 / 5"
    },
    {
      id: 6,
      title: "Advancements",
      subtitle: "AI · Tools",
      bgImage: "/tools.jpg",
      link: "https://aiinsight.blog/generative-ai-advancements-in-2025",
      gridArea: "3 / 5 / 4 / 6"
    }
  ];

  return (
    <section className="pt-20 pb-5 -mb-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-6 font-roobert">
            <span>Research Station</span> <span className="text-white">🛰️</span>
          </h2>
          <p className="text-xl text-gray-300 font-roobert">
            My collection of articles, podcasts, research papers and ongoing explorations
          </p>
        </div>

        <div className="grid grid-cols-5 grid-rows-4 gap-2 h-[700px] w-full">
          {gridItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:border-white/50 hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] hover:shadow-white/40"
              style={{ gridArea: item.gridArea }}
              onClick={() => window.open(item.link, '_blank')}
            >
              {/* Background Image with Zoom and Blur Effect */}
              <div
                className="absolute inset-0 transition-all duration-700 group-hover:scale-110 group-hover:blur-sm"
                style={{
                  backgroundImage: `url(${item.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-end z-10">
                <h3 className="text-2xl font-bold text-white mb-1 transition-all duration-300 group-hover:text-white font-roobert">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm transition-all duration-300 group-hover:text-gray-200 font-roobert">
                  {item.subtitle}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                   style={{
                     background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                     mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                     maskComposite: 'xor',
                     WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                     WebkitMaskComposite: 'xor',
                     padding: '1px'
                   }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchBentoGrid;