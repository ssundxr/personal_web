"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: "2002", team: "Sporting CP", text: ["Professional debut.", "A dream begins."] },
  { year: "2003", team: "Manchester United", text: ["Sir Alex Ferguson saw greatness.", "The world met Cristiano Ronaldo."] },
  { year: "2009", team: "Real Madrid", text: ["The biggest transfer in football history.", "The beginning of a legendary era."] },
  { year: "2016", team: "Portugal", text: ["UEFA European Champion.", "The greatest night in Portuguese football."] },
  { year: "2018", team: "Juventus", text: ["A new league.", "The same relentless mentality."] },
  { year: "2021", team: "Manchester United", text: ["The return home.", "Old Trafford welcomed its hero again."] },
  { year: "2023", team: "Al Nassr", text: ["A new challenge.", "Changing football beyond Europe."] },
  { year: "2026", team: "Portugal", text: ["Not every story ends with a trophy.", "But every legend leaves behind a legacy.", "Obrigado."] },
];

const quotes = [
  "Talent without work is nothing.",
  "Your love makes me strong.\nYour hate makes me unstoppable.",
  "Dreams are earned.",
  "Dedication beats talent.",
  "Never stop believing."
];

const stats = [
  { label: "Career Goals", value: 970, plus: true },
  { label: "Career Assists", value: 300, plus: true },
  { label: "Matches Played", value: 1320, plus: true },
  { label: "International Goals", value: 143, plus: true },
  { label: "Major Trophies", value: 35, plus: false },
  { label: "Ballon d'Or", value: 5, plus: false },
  { label: "UEFA Champions League Titles", value: 5, plus: false },
  { label: "UEFA European Championship", value: 1, plus: false },
  { label: "UEFA Nations League Titles", value: 2, plus: false },
  { label: "FIFA Club World Cups", value: 4, plus: false },
  { label: "European Golden Boots", value: 4, plus: false }
];


const FRAME_COUNT = 156;

export default function ScrollStory({ onFinish }: { onFinish: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  // Preload images
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // Format 001.gif to 156.gif
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames_cr7/extracted/ffout${frameNum}.gif`;
      img.onload = () => {
        loadedCount++;
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // 1. Image Sequence Animation
    if (images.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      const render = (index: number) => {
        if (!context || !images[index]) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        const img = images[index];
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;  
        
        context.drawImage(img, 0,0, img.width, img.height,
                           centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
      };
      
      if (images[0]?.complete) render(0);
      else if (images[0]) images[0].onload = () => render(0);

      const playhead = { frame: 0 };
      
      gsap.to(playhead, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: ".sequence-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: () => render(playhead.frame),
        }
      });
    }

    // 2. Timeline Elements Fade & Parallax
    gsap.utils.toArray(".timeline-item").forEach((el: any) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 100, filter: "blur(10px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          }
        }
      );
    });

    // 3. Stats Counters - FIXED: using object to tween number instead of innerHTML directly
    gsap.utils.toArray(".stat-number").forEach((el: any) => {
      const target = parseFloat(el.getAttribute("data-target"));
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        onUpdate: function() {
          el.innerHTML = Math.round(obj.val).toLocaleString();
        }
      });
    });


    // 5. Cinematic Background Transitions (Color shifts)
    gsap.to(containerRef.current, {
      backgroundColor: "#fafafa", 
      scrollTrigger: {
        trigger: ".sequence-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    });


    // Removed the timeout-based ending trigger for better UX.
    // The user will click a button to finish.
  }, { scope: containerRef, dependencies: [images] });

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-white text-black" 
      id="tribute-scroll"
    >
      <div className="sequence-container relative w-full">
        
        {/* Sticky Canvas (Right Side / Background) */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="sticky top-0 h-screen w-full flex items-center justify-end overflow-hidden pointer-events-none">
            <div className="w-full md:w-1/2 h-full relative">
              <canvas 
                ref={canvasRef} 
                width={1080} 
                height={1920}
                className="w-full h-full object-cover object-center opacity-90"
              />
              {/* Gradient mask to blend left edge of image sequence */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent md:via-transparent" />
              {/* Bottom gradient to smoothly transition into stats */}
              <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>
        </div>

        {/* Content (Left Side) */}
        <div className="relative z-10 w-full pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 py-[30vh]">
            
            {milestones.map((ms, i) => (
              <div key={ms.year} className="mb-[60vh] flex flex-col">
                <div className="timeline-item max-w-xl pointer-events-auto">
                  <h2 className="text-[100px] sm:text-[120px] md:text-[200px] font-bold leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: "2px rgba(0,0,0,0.15)" }}>
                    {ms.year}
                  </h2>
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 text-[#D4AF37]">
                    {ms.team}
                  </h3>
                  <div className="space-y-4">
                    {ms.text.map((line, j) => (
                      <p key={j} className="text-xl md:text-3xl text-neutral-800 font-light tracking-wide">{line}</p>
                    ))}
                  </div>
                </div>

                {i % 2 === 0 && quotes[i/2] && (
                  <div className="timeline-item max-w-xl mt-[25vh] md:mt-[35vh] pl-6 md:pl-8 border-l-2 border-[#D4AF37]/30 self-end md:self-start pointer-events-auto">
                    <p className="text-2xl md:text-4xl italic text-neutral-600 font-serif leading-relaxed whitespace-pre-line">
                      "{quotes[i/2]}"
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Final Quote - was previously missing */}
            <div className="timeline-item max-w-3xl mt-[10vh] mb-[20vh] text-center mx-auto pointer-events-auto">
              <p className="text-3xl md:text-6xl italic text-black font-serif leading-relaxed font-medium">
                "{quotes[4]}"
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 bg-transparent py-32 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col">
                <div className="flex items-baseline mb-2">
                  <span className="stat-number text-5xl md:text-7xl font-bold tracking-tighter" data-target={stat.value}>0</span>
                  {stat.plus && <span className="text-4xl md:text-6xl font-bold text-[#D4AF37] ml-1">+</span>}
                </div>
                <span className="text-sm md:text-base text-neutral-500 uppercase tracking-widest font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Ending Trigger Area */}
      <div className="ending-trigger relative z-10 bg-[#050505] flex flex-col items-center text-center px-6 pt-20 md:pt-32 pb-64">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.1, margin: "200px" }}
          className="max-w-4xl flex flex-col items-center"
        >
          <p className="text-xl md:text-3xl text-neutral-400 font-light mb-8">Legends don't need perfect endings.</p>
          <p className="text-3xl md:text-6xl font-medium text-white leading-tight mb-16">
            They become immortal through the people they inspire.
          </p>
          <p className="text-xl md:text-2xl text-neutral-500 uppercase tracking-widest mb-4">Thank you,</p>
          <p className="text-4xl md:text-7xl md:text-[100px] font-bold tracking-tighter text-[#D4AF37] mb-16 drop-shadow-2xl">Cristiano Ronaldo.</p>
          
          <button 
            onClick={onFinish}
            className="group relative px-10 py-5 bg-white text-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)]"
          >
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 uppercase tracking-[0.2em] text-sm md:text-base font-bold group-hover:text-black transition-colors duration-500">
              Complete Journey
            </span>
          </button>
        </motion.div>
      </div>

    </div>
  );
}
