"use client"

import React from "react"
import * as THREE from "three"
import { SpeedInsights } from "@vercel/speed-insights/next"
import GridAnimation from "@/components/GridAnimation"
import ResearchBentoGrid from "@/components/BentoGrid"
import dynamic from "next/dynamic"
import emailjs from 'emailjs-com'
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useAnimation} from "framer-motion"
import { Stars, Sphere, Ring } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCallback } from "react"
import { MutableRefObject } from "react"
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Download,
  ExternalLink,
  Award,
  BookOpen,
  Code,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Plane,
  Trophy,
  Spline,
} from "lucide-react"


const FlipClock = dynamic(() => import("@/components/FlipClock"), { ssr: false })

// Add this component to your existing InfiniteStarField
function RandomComets() {
  const cometsRef = useRef<THREE.Group>(null)
  const [comets, setComets] = useState<Array<{
    id: number
    startPos: [number, number, number]
    endPos: [number, number, number]
    progress: number
    speed: number
    trailLength: number
  }>>([])

  // Generate random comet
  const createComet = useCallback(() => {
    const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    let startPos: [number, number, number]
    let endPos: [number, number, number]
    
    switch(side) {
      case 0: // from top
        startPos = [Math.random() * 200 - 100, 100, Math.random() * 100 - 50]
        endPos = [Math.random() * 200 - 100, -100, Math.random() * 100 - 50]
        break
      case 1: // from right  
        startPos = [100, Math.random() * 200 - 100, Math.random() * 100 - 50]
        endPos = [-100, Math.random() * 200 - 100, Math.random() * 100 - 50]
        break
      case 2: // from bottom
        startPos = [Math.random() * 200 - 100, -100, Math.random() * 100 - 50]
        endPos = [Math.random() * 200 - 100, 100, Math.random() * 100 - 50]
        break
      default: // from left
        startPos = [-100, Math.random() * 200 - 100, Math.random() * 100 - 50]
        endPos = [100, Math.random() * 200 - 100, Math.random() * 100 - 50]
    }

    return {
      id: Date.now() + Math.random(),
      startPos,
      endPos,
      progress: 0,
      speed: 0.008 + Math.random() * 0.012, // Random speed
      trailLength: 8 + Math.random() * 12
    }
  }, [])

  // Spawn comets at random intervals
  useEffect(() => {
    const spawnComet = () => {
      setComets(prev => [...prev, createComet()].slice(-5)) // Keep max 5 comets
      
      // Schedule next comet (2-8 seconds)
      const nextDelay = 2000 + Math.random() * 6000
      setTimeout(spawnComet, nextDelay)
    }
    
    // Start spawning
    const initialDelay = 1000 + Math.random() * 3000
    setTimeout(spawnComet, initialDelay)
  }, [createComet])

  // Animate comets
  useFrame(() => {
    setComets(prev => prev.map(comet => ({
      ...comet,
      progress: comet.progress + comet.speed
    })).filter(comet => comet.progress < 1)) // Remove completed comets
  })

  return (
    <group ref={cometsRef}>
      {comets.map(comet => {
        const currentPos = [
          comet.startPos[0] + (comet.endPos[0] - comet.startPos[0]) * comet.progress,
          comet.startPos[1] + (comet.endPos[1] - comet.startPos[1]) * comet.progress,
          comet.startPos[2] + (comet.endPos[2] - comet.startPos[2]) * comet.progress
        ] as [number, number, number]

        // Create realistic comet tail with tapering effect
        const trailPoints = []
        const trailColors = []
        
        for (let i = 0; i < comet.trailLength; i++) {
          const trailFactor = i / comet.trailLength
          const trailProgress = Math.max(0, comet.progress - (trailFactor * 0.15))
          
          if (trailProgress > 0) {
            const trailPos = [
              comet.startPos[0] + (comet.endPos[0] - comet.startPos[0]) * trailProgress,
              comet.startPos[1] + (comet.endPos[1] - comet.startPos[1]) * trailProgress,
              comet.startPos[2] + (comet.endPos[2] - comet.startPos[2]) * trailProgress
            ]
            trailPoints.push(...trailPos)
            
            // Color gradient from white/blue to orange/red
            const intensity = 1 - trailFactor
            trailColors.push(intensity, intensity * 0.8, intensity * 0.3) // RGB
          }
        }

        return (
          <group key={comet.id}>
            {/* Comet nucleus (bright white core) */}
            <mesh position={currentPos}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshBasicMaterial 
                color="#ffffff" 
                transparent 
                opacity={1 - comet.progress * 0.3} 
              />
            </mesh>
            
            {/* Comet coma (glowing halo) */}
            <mesh position={currentPos}>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshBasicMaterial 
                color="#88ddff" 
                transparent 
                opacity={0.3 * (1 - comet.progress * 0.5)} 
              />
            </mesh>

            {/* Main ion tail (blue-white) */}
            {trailPoints.length > 0 && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={trailPoints.length / 3}
                    array={new Float32Array(trailPoints)}
                    itemSize={3}
                  />
                  <bufferAttribute
                    attach="attributes-color"
                    count={trailColors.length / 3}
                    array={new Float32Array(trailColors)}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial 
                  vertexColors
                  transparent 
                  opacity={0.8 * (1 - comet.progress * 0.6)}
                  linewidth={2}
                />
              </line>
            )}

            {/* Dust tail (yellowish, slightly offset) */}
            {trailPoints.length > 0 && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={trailPoints.length / 3}
                    array={new Float32Array(trailPoints.map((coord, i) => 
                      i % 3 === 0 ? coord + Math.sin(comet.progress * 10) * 0.5 : coord
                    ))}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial 
                  color="#ffaa44" 
                  transparent 
                  opacity={0.4 * (1 - comet.progress * 0.7)}
                  linewidth={1}
                />
              </line>
            )}
          </group>
        )
      })}
    </group>
  )
}

function InfiniteStarField() {
  const starsRef = useRef<THREE.Group>(null)
  const { scrollYProgress } = useScroll()

  useFrame((state) => {
    if (starsRef.current) {
      // Rotate based on scroll progress
      const rotation = scrollYProgress.get() * Math.PI * 2
      starsRef.current.rotation.y = rotation * 0.5
      starsRef.current.rotation.x = rotation * 0.2
    }
  })

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <RandomComets />
    </group>
  )
}

// 3D Floating Elements
function FloatingElements() {
  const mesh1 = useRef<THREE.Mesh>(null)
  const mesh2 = useRef<THREE.Mesh>(null)
  const mesh3 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh1.current) {
      mesh1.current.rotation.x = time * 0.3
      mesh1.current.rotation.y = time * 0.2
      mesh1.current.position.y = Math.sin(time) * 2
    }
    if (mesh2.current) {
      mesh2.current.rotation.x = time * 0.2
      mesh2.current.rotation.z = time * 0.3
      mesh2.current.position.y = Math.cos(time * 0.8) * 1.5
    }
    if (mesh3.current) {
      mesh3.current.rotation.y = time * 0.4
      mesh3.current.rotation.x = time * 0.1
      mesh3.current.position.y = Math.sin(time * 1.2) * 1.8
    }
  })

  return (
    <>
      <mesh ref={mesh1} position={[10, 5, -20]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#00d4ff" wireframe emissive="#00d4ff" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={mesh2} position={[-15, -8, -25]}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#00ff88" wireframe emissive="#00ff88" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={mesh3} position={[20, -5, -30]}>
        <tetrahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color="#ffaa00" wireframe emissive="#ffaa00" emissiveIntensity={0.3} />
      </mesh>
    </>
  )
}

// Grid Perspective Animation Component
function GridPerspective() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = ((state.clock.getElapsedTime() * 2) % 20) - 10
    }
  })

  // Create geometry for all lines at once
  const positions = []
  const colors = []
  
  for (let i = -100; i <= 100; i += 2) {
    // Vertical lines
    positions.push(i, -100, 0, i, 100, 0)
    
    // Horizontal lines  
    positions.push(-100, i, 0, 100, i, 0)
  }

  const positionArray = new Float32Array(positions)
  
  // Custom shader material for depth-based fading
  const fadeShader = {
    vertexShader: `
      varying float vDepth;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vDepth = position.y; // Use Y coordinate for depth
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vDepth;
      void main() {
        float normalizedDepth = (vDepth + 100.0) / 200.0; // Normalize -100 to 100 -> 0 to 1
        float opacity = 0.4 * (1.0 - normalizedDepth * normalizedDepth);
        opacity = max(0.0, opacity);
        gl_FragColor = vec4(color, opacity);
      }
    `,
    uniforms: {
      color: { value: new THREE.Color('#00d4ff') }
    },
    transparent: true
  }

  return (
    <group ref={gridRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -10, -50]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positionArray}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={fadeShader.vertexShader}
          fragmentShader={fadeShader.fragmentShader}
          uniforms={fadeShader.uniforms}
          transparent={true}
        />
      </lineSegments>
    </group>
  )
}

// Moving Skills Component
function MovingSkills() {
  const skills = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "HuggingFace", icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
    { name: "SQLite3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
    { name: "OpenAI", icon: "https://seeklogo.com/images/O/openai-logo-8B9BFEDC26-seeklogo.com.png" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" }
  ]

  return (
    <div className="flex items-center gap-12">
      {/* Text on the left */}
      <div className="flex-shrink-0">
        <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight font-roobert">
          Whatever your stack,<br />
          I can give it a try.
        </h3>
      </div>

      {/* Moving skills on the right */}
      <div className="flex-1 overflow-hidden">
        {/* First row - moving right */}
        <div className="flex animate-marquee-right items-center mb-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              {skills.map((skill, skillIndex) => (
                <div
                  key={`${skill.name}-${i}-${skillIndex}`}
                  className="flex-shrink-0 bg-gray-500 p-4 w-16 h-16 flex items-center justify-center"
                >
                  <img 
                    src={skill.icon}
                    alt={skill.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Second row - moving left */}
        <div className="flex animate-marquee-left items-center gap-4">
          {Array(8).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              {skills.slice().reverse().map((skill, skillIndex) => (
                <div
                  key={`${skill.name}-reverse-${i}-${skillIndex}`}
                  className="flex-shrink-0 bg-gray-500 p-4 w-16 h-16 flex items-center justify-center"
                >
                  <img 
                    src={skill.icon} 
                    alt={skill.name} 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

// About Section
function AboutSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-6 font-roobert">
            About Me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  <img
                    src="/IMG_1265.JPG"
                    alt="Profile"
                    className="w-72 h-72 rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* Atom orbits */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Orbit 1 */}
                <div className="absolute w-[450px] h-[450px] rounded-full border border-white/20 animate-spin" style={{animationDuration: '20s'}}></div>
                
                {/* Orbit 2 - rotated 60 degrees */}
                <div className="absolute w-[450px] h-[450px] rounded-full border border-white/15 animate-spin" style={{animationDuration: '25s', transform: 'rotateX(60deg) rotateY(60deg)'}}></div>
                
                {/* Orbit 3 - rotated 120 degrees */}
                <div className="absolute w-[450px] h-[450px] rounded-full border border-white/10 animate-spin" style={{animationDuration: '30s', transform: 'rotateX(-60deg) rotateY(120deg)'}}></div>
                
                {/* Electron dots */}
                <div className="absolute w-[450px] h-[450px] animate-spin" style={{animationDuration: '20s'}}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-white/40 rounded-full transform -translate-x-1/2"></div>
                </div>
                
                <div className="absolute w-[450px] h-[450px] animate-spin" style={{animationDuration: '25s', transform: 'rotateX(60deg) rotateY(60deg)'}}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-white/30 rounded-full transform -translate-x-1/2"></div>
                </div>
                
                <div className="absolute w-[450px] h-[450px] animate-spin" style={{animationDuration: '30s', transform: 'rotateX(-60deg) rotateY(120deg)'}}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-white/20 rounded-full transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-300 leading-relaxed font-roobert">
              Me? I'm a developer with a growing passion for AI and large language models.
              I enjoy exploring how these technologies can be applied to solve real-world problems and create smarter digital experiences.
              Having said that, computational finance also keeps me curious!
            </p>
            <p className="text-lg text-gray-300 leading-relaxed font-roobert">
              When I'm not coding, you can find me exploring the latest in AI & LLMs, researching in the field of transformers, or
              stargazing and drawing inspiration from the cosmos.
            </p>
          </motion.div>
        </div>

        {/* Moving Skills Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center text-white mb-8 font-jakarta"><br /></h3>
          <MovingSkills />
        </motion.div>
      </div>
    </section>
  )
}

// Projects Section with Creative Animation
function ProjectsSection() {
  const projects = [
    {
      title: "Corelabs - Interactive Visualizer Library",
      description: "An AI-powered web app that helps learners visualize complex concepts under diverse academic disciplines.",
      tech: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Gemini API", "Supabase", "OS", "DBMS"],
      image: "/corelabs.jpg",
      link: "https://corelabs.vercel.app",
      github: "https://github.com/NirmanPatel036/corelabs",
    },
    {
      title: "Semantic Book Recommender",
      description: "A sophisticated book recommendation system that combines semantic search with emotion analysis to provide personalized book suggestions.",
      tech: ["Python", "TensorFlow", "Hugging Face", "Transformers", "ChromaDB", "Gradio"],
      image: "/semantics.jpg",
      link: "https://huggingface.co/spaces/nirmanpatel/semantic-book-recommender",
      github: "https://github.com/NirmanPatel036/llm-playground/tree/main/semantic-book-recommendar",
    },
    {
      title: "SMS Spam Detector",
      description: "A machine learning-based SMS spam classifier that uses Support Vector Machine (SVM) with TF-IDF vectorization to detect spam messages.",
      tech: ["Support Vector Machine", "Python", "Scikit-learn", "NLTK", "TF-IDF"],
      image: "/sms.jpg",
      link: "https://v0-sms-spam.vercel.app/",
      github: "https://github.com/NirmanPatel036/machine-learning-implementations/tree/main/spam-detection-using-svm"
    },
    {
      title: "Video To Text Annotator",
      description: "An automated video description pipeline that extracts keyframes from videos and generates descriptive captions using the BLIP model and summarizes usinf T5.",
      tech: ["PyTorch", "Transformers", "OpenCV", "Hugging Face", "Pillow"],
      image: "/vidtotext.jpg",
      link: "https://huggingface.co/spaces/nirmanpatel/video-to-text-labelling",
      github: "https://github.com/NirmanPatel036/llm-playground/tree/main/video-to-text-LLM-labeling",
    },
    {
      title: "Anomaly Detection Pipeline with Hyperparameter Tuning",
      description: "An ML pipeline that uses a model trained on a financial dataset to detect fraudulent transactions.",
      tech: ["Python", "Isolation Forest", "PCA/t-SNE", "Scikit-learn", "Matplotlib", "Seaborn", "Joblib"],
      image: "/comingsoon2.png",
      link: "#",
      github: "",
    },
    {
      title: "Stock Market Portfolio Optimizer",
      description: "A historical stock performance analyzer, calculates risk-return metrics, and uses the Sharpe ratio maximization approach for optimization.",
      tech: ["yFinance", "Python", "Seaborn", "Matplotlib", "Seaborn"],
      image: "/comingsoon2.png",
      link: "#",
      github: "",
    },
  ]

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-6 font-roobert">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 100, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -20,
                rotateY: 5,
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              viewport={{ once: true }}
              className="perspective-1000"
            >
              <Card className="bg-gray-900/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group transform-gpu">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <motion.img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                      whileHover={{ scale: 1.2, rotate: 2 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                    <motion.div
                      className="absolute inset-0 bg-blue-500/20"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 font-roobert">{project.title}</h3>
                    <p className="text-gray-400 mb-4 font-roobert">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="border-cyan-500/30 text-cyan-300 font-roobert">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent font-roobert"
                        onClick={() => {
                          if (project.link && project.link !== "#") {
                            window.open(project.link, '_blank');
                          } else {
                            alert(`${project.title} project coming soon!`);
                          }
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Try Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/30 text-white/70 hover:bg-white/10 bg-white/5 font-roobert"
                        onClick={() => {
                          window.open(project.github, '_blank');}}
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View on GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Current Work
const CurrentWorkSection = () => {
 return (
   <section className="py-10 px-4 relative">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-2xl mb-4 font-roobert" style={{color: '#D2B48C'}}>Currently Working On</h2>
      <div className="overflow-hidden mt-2 max-w-6xl mx-auto">
        <div className="flex animate-marquee items-center">
            {Array(4).fill(0).map((_, i) => (
              <React.Fragment key={i}>
                <h3 className="text-3xl md:text-4xl font-bold font-roobert whitespace-nowrap" style={{color: '#F5F5DC'}}>
                  AI Interview Coach with Resume Parser 🧑🏻‍💼📑
                </h3>
                <span className="mx-10 text-4xl" style={{color: '#F5F5DC'}}>•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
   </section>
 );
};

// Coursework section with background images and globe
function RotatingEarth() {
  const earthRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.003
    }
  })

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    shininess: 10,
  })

  useEffect(() => {
    const loader = new THREE.TextureLoader()

    loader.load(
      '/textures/earth.jpg',
      (texture) => {
        earthMaterial.map = texture
        earthMaterial.needsUpdate = true
      },
      undefined,
      () => {
        earthMaterial.color.setHex(0x6b93d6) // Fallback color
      }
    )
  }, [earthMaterial])

  return (
    <mesh ref={earthRef} position={[0, 0, 0]} material={earthMaterial}>
      <sphereGeometry args={[8, 64, 64]} />
    </mesh>
  )
}

function CourseworkSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const courses = [
    {
      name: "Advanced Algorithms & Data Structures",
      description: "Mastered complex structures and algorithmic strategies for solving real-world problems efficiently and scalably",
      grade: "A",
      category: "Core",
      bgImage: "/dsa.png",
    },
    {
      name: "Machine Learning & Deep Learning",
      description: "Hands-on with supervised, unsupervised, and deep neural networks — from regression to CNNs and transformers",
      grade: "A",
      category: "AI/ML",
      bgImage: "/ml:dl.png",
    },
    {
      name: "Optimization Techniques for AI",
      description: "Studied linear, non-linear, and evolutionary optimization methods to power intelligent systems and fine-tune models",
      grade: "A+",
      category: "AI/ML",
      bgImage: "/opti.png",
    },
    {
      name: "Discrete Mathematical Structures & Probablilistic Computational Methods",
      description: "Built a strong base in graph theory, combinatorics, and probability to support algorithm design and randomized models",
      grade: "A+",
      category: "Mathematics",
      bgImage: "/confidence.png",
    },
    {
      name: "Theory of Computation",
      description: "Explored formal languages, automata theory, and computability to understand the limits of what machines can solve",
      grade: "A+",
      category: "Mathematics",
      bgImage: "/toc.png",
    },
    {
      name: "Digital Logic Design & Computer Architecture",
      description: "Designed and analyzed digital circuits and learned the architectural foundations behind modern computing systems",
      grade: "A+",
      category: "Electronics",
      bgImage: "/logic.jpg",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % courses.length)
  }

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setInterval(nextSlide, 3000)
    }
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current)
      }
    }
  }, [isPaused, currentIndex])

  return (
    <section className="py-20 px-4 relative min-h-screen">
      <div className="max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-16 items-center justify-between">
        {/* Left Side: Title + Earth */}
        <div className="flex flex-col items-start">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-8 font-roobert">
            Academic Coursework
          </h2>

          <div className="h-[500px] w-[500px] relative">
            <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
              <ambientLight intensity={1} />
              <pointLight position={[20, 20, 20]} intensity={0.6} />
              <Suspense fallback={null}>
                <RotatingEarth />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Right Side: Carousel */}
        <div className="relative w-full max-w-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Card container */}
          <div className="relative h-[500px] group">
            <AnimatePresence mode="wait">
              <motion.div
                key={courses[currentIndex].name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 50) {
                    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length)
                  } else if (info.offset.x < -50) {
                    nextSlide()
                  }
                }}
                className="absolute inset-0 z-10 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
              >
                {/* Background with hover zoom and blur */}
                <div
                  className="absolute inset-0 z-0 transition-all duration-700 group-hover:scale-110 group-hover:blur-sm"
                  style={{
                    backgroundImage: `url(${courses[currentIndex].bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium font-roobert">
                      {courses[currentIndex].category}
                    </div>
                    <div className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-roobert text-lg px-3 py-1 rounded-full">
                      {courses[currentIndex].grade}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-roobert leading-tight">
                      {courses[currentIndex].name}
                    </h3>
                    <p className="text-white/80 font-roobert">
                      {courses[currentIndex].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots BELOW the card */}
          <div className="mt-5 flex justify-center gap-2 z-30">
            {courses.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  i === currentIndex ? "bg-white" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Linear Timeline Component for Achievements
type Achievement = {
  title: string
  description: string
  year: string
  icon: React.ReactNode
}

type LinearTimelineProps = {
  achievements: Achievement[]
  scrollProgress: { get: () => number }
}

const TRAIL_LENGTH = 20

export function FlameTrail({ shuttleRef }: { shuttleRef: MutableRefObject<THREE.Group | null> }) {
  const trailRefs = useRef<{ position: THREE.Vector3; opacity: number }[]>([])

  useEffect(() => {
    // Initialize trail objects
    trailRefs.current = Array.from({ length: TRAIL_LENGTH }, () => ({
      position: new THREE.Vector3(),
      opacity: 0,
    }))
  }, [])

  useFrame(() => {
    if (!shuttleRef.current) return

    const pos = new THREE.Vector3()
    shuttleRef.current.getWorldPosition(pos)

    // Update trail positions and fade
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      trailRefs.current[i].position.copy(trailRefs.current[i - 1].position)
      trailRefs.current[i].opacity = Math.max(trailRefs.current[i - 1].opacity - 0.05, 0)
    }
    trailRefs.current[0].position.copy(pos)
    trailRefs.current[0].opacity = 1
  })

  return (
    <>
      {trailRefs.current.map((t, i) => (
        <mesh key={i} position={t.position}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color="#ff5500"
            transparent
            opacity={t.opacity}
            emissive="#ff2200"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </>
  )
}

function RealisticFlame() {
  const innerRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    const time = Date.now() * 0.005
    const flicker = 0.9 + Math.sin(time * 3) * 0.1

    if (innerRef.current && outerRef.current) {
      innerRef.current.scale.y = flicker;
      (innerRef.current.material as THREE.MeshStandardMaterial).opacity = 0.8 + Math.random() * 0.1

      outerRef.current.scale.y = flicker * 1.2;
      (outerRef.current.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.random() * 0.1
    }
  })

  return (
    <>
      {/* Core bright flame */}
      <mesh ref={innerRef} position={[0, -2.9, 0]}>
        <coneGeometry args={[0.3, 1.2, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ff9900"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer glow flame */}
      <mesh ref={outerRef} position={[0, -3.1, 0]}>
        <coneGeometry args={[0.6, 2, 16]} />
        <meshStandardMaterial
          color="#ff4500"
          emissive="#ff2200"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  )
}

function LinearTimeline({ achievements, scrollProgress }: LinearTimelineProps) {
  const timelineRef = useRef<THREE.Group>(null)
  const shuttleRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (timelineRef.current) {
      // Move timeline based on scroll
      const progress = scrollProgress.get()
      timelineRef.current.position.y = progress * 20 - 10
    }
  })

  return (
    <group ref={timelineRef}>
      {/* Main timeline line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -50, 0, 0, 50, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00d4ff" linewidth={3} />
      </line>

      {/* Achievement planets */}
      {achievements.map((achievement, index) => {
        const yPos = (index - 1) * 8
        return (
          <group key={index} position={[0, yPos, 0]}>
            {/* Planet */}
            <Sphere args={[0.8, 32, 32]} position={[3, 0, 0]}>
              <meshStandardMaterial
                color={index === 0 ? "#00d4ff" : index === 1 ? "#00ff88" : "#ffaa00"}
                emissive={index === 0 ? "#001a33" : index === 1 ? "#001a1a" : "#1a1100"}
                emissiveIntensity={0.3}
              />
            </Sphere>

            {/* White faded orbit */}
            <Ring args={[2.5, 3.5, 64]} rotation={[0, 0, 0]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </Ring>

            {/* Cross orbit rotating opposite */}
            <Ring args={[2.5, 3.5, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
            </Ring>

            {/* Connection to timeline */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, 2.5, 0, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00d4ff" opacity={0.5} transparent />
            </line>
          </group>
        )
      })}

      {/* Space shuttle at bottom */}
      <group position={[0, -2, 0]}>
        <mesh>
          <coneGeometry args={[0.3, 1.2, 8]} />
          <meshStandardMaterial color="#00d4ff" emissive="#001a33" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.8, 8]} />
          <meshStandardMaterial color="#0099cc" />
        </mesh>
        <RealisticFlame />
      </group>
      <FlameTrail shuttleRef={shuttleRef} />
    </group>
  )
}

// Achievements Section with Linear Timeline
function AchievementsSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const achievements = [
    {
      title: "Akai Space",
      description: "GenAI Automation Intern",
      year: "July-September 2025",
      icon: <Code className="h-8 w-8" />,
    },
    {
      title: "Leo9 Design & Digital Studio",
      description: "Web Development Intern",
      year: "June 2025",
      icon: <Spline className="h-8 w-8" />,
    },
    {
      title: "Aero Club (Drones & RC Planes)",
      description: "Software Development Team Member",
      year: "2023-Present",
      icon: <Plane className="h-8 w-8" />,
    },
    {
      title: "University Atheletics Team",
      description: "Relay & Long Jump Athlete",
      year: "2023-Present",
      icon: <Trophy className="h-8 w-8" />,
    },
  ]

  return (
    <section ref={containerRef} className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-6 font-roobert">
            Experiences<br/>So Far
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Cards moved to left side */}
          <div className="space-y-12 relative">
            {/* Vertical Connection Line */}
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 top-32 w-0.5 z-0 connection-line-pulse"
              style={{
                height: `${(achievements.length - 1) * 180}px`,
                background: `linear-gradient(to bottom, 
                  rgba(0, 212, 255, 0) 0%,
                  rgba(0, 212, 255, 0.6) 20%,
                  rgba(0, 212, 255, 0.8) 50%,
                  rgba(0, 212, 255, 0.6) 80%,
                  rgba(0, 212, 255, 0) 100%
                )`
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
            />

            {/* Connection Nodes between cards - ON THE LINE */}
            {achievements.slice(0, -1).map((_, index) => (
              <motion.div
                key={`node-${index}`}
                className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-gray-900 z-20"
                style={{
                  left: "48%",
                  top: `${120 + index * 160}px` // Between cards in the gap
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: (index + 1) * 0.3 + 0.5,
                  ease: "backOut"
                }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
              </motion.div>
            ))}

            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
                  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.3,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative z-10"
              >
                <div className="flex items-start gap-6 p-6 rounded-lg bg-gray-900/30 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm relative overflow-hidden group">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                  
                  <div className="text-blue-400 z-10 relative group-hover:scale-110 transition-transform duration-300">
                    {achievement.icon}
                  </div>
                  <div className="flex-1 z-10 relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white font-roobert group-hover:text-blue-100 transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <Badge variant="outline" className="border-blue-500/30 text-blue-300 font-roobert group-hover:border-blue-400/60 group-hover:text-blue-200 transition-all duration-300">
                        {achievement.year}
                      </Badge>
                    </div>
                    <p className="text-gray-300 font-roobert group-hover:text-gray-200 transition-colors duration-300">
                      {achievement.description}
                    </p>
                  </div>

                  {/* Particle Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    whileHover={{
                      background: [
                        "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3D Timeline moved to right side */}
          <div className="h-96">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <LinearTimeline achievements={achievements} scrollProgress={scrollYProgress} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const [user_name, setName] = useState('')
  const formRef = useRef<ContactFormElement | null>(null)
  const [buttonText, setButtonText] = useState("Send Message");
  interface EmailJSResponseStatus {
    status: number
    text: string
  }

  interface EmailJSError {
    text: string
    status: number
  }

  interface FormElements extends HTMLFormControlsCollection {}

  interface ContactFormElement extends HTMLFormElement {
    elements: FormElements
  }

  const handleSubmit = (e: React.FormEvent<ContactFormElement>) => {
    e.preventDefault()

    if (formRef.current) {
      emailjs.sendForm(
        'service_hrae7zf',    
        'template_039vr5o',   
        formRef.current,
        'iSmnwT4bqz-3HTt9i'    //public key
      )
      .then(() => {
        setButtonText("Message Sent!");
        formRef.current?.reset(); //  Clear fields
        setName('');
        setTimeout(() => setButtonText("Send Message"), 3000);
      })
      .catch(() => {
        setButtonText("Failed. Try Again ❌");
        setTimeout(() => setButtonText("Send Message"), 3000);
      });
    }

    console.log('Form submitted:', user_name)

    handleAfterSubmit()
  }

  const handleAfterSubmit = () => {
    alert('Thanks, ' + user_name + '! 🚀')
  }

  const socialLinks = [
    { icon: <Github className="h-6 w-6" />, label: "GitHub", href: "https://github.com/NirmanPatel036" },
    { icon: <Linkedin className="h-6 w-6" />, label: "LinkedIn", href: "https://linkedin.com/in/nirmanpatel" },
    { icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ), label: "Twitter", href: "https://x.com/nirman_patel_09?s=21" },
    { icon: <Mail className="h-6 w-6" />, label: "Email", href: "nirman0511[at]gmail[dot]com" },
    { icon: <MapPin className="h-6 w-6" />, label: "Hyderabad, IN", href: "https://maps.app.goo.gl/nzUa8vf9fpatQfkS7" },
  ]

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-6 font-roobert">
            Let's Connect
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-roobert">Ready to collaborate on something amazing?</p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto rounded-[180px] backdrop-blur-md bg-white/5 shadow-[0_0_20px_5px_rgba(255,255,255,0.4)]">
            <div className="relative rounded-full overflow-hidden">
              {/* Background image with low opacity */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url('/IMG_9110.JPG')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Content */}
              <div className="relative bg-black/40 p-8">
                <h3 className="text-3xl font-bold text-white mb-2 text-center font-roobert">Get In Touch</h3>
                <p className="text-white/80 mb-8 text-center font-roobert">I'd love to hear from you!</p>
                
                <form className="space-y-6 max-w-md mx-auto" ref={formRef} onSubmit={handleSubmit}>
                  <div>
                    <Input
                      name='user_name'
                      required
                      value={user_name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="bg-transparent border border-white/20 text-white placeholder-white/60 font-roobert h-12 rounded-full px-6 focus:border-white/40"
                    />
                  </div>
                  <div>
                    <Input
                      name='user_email'
                      type="email"
                      placeholder="Email"
                      className="bg-transparent border border-white/20 text-white placeholder-white/60 font-roobert h-12 rounded-full px-6 focus:border-white/40"
                    />
                  </div>
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white font-roobert h-12 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Social Media Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8 font-roobert"><br /><br />Contact Me 😇</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 50, rotateY: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 10,
                  transition: { duration: 0.2 },
                }}
                viewport={{ once: true }}
                className="perspective-1000"
              >
                <a
                  href={
                    link.label === "Mail"
                      ? "mailto:nirman0511@gmail.com"
                      : link.href
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="w-40 h-20 bg-gray-900/50 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer transform-gpu flex flex-col items-center justify-center">
                    <CardContent className="p-4 text-center">
                      <div className="text-cyan-400 mb-2 flex justify-center">{link.icon}</div>
                      <p className="text-gray-300 text-sm font-roobert">{link.label}</p>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}

          </div>

          <motion.div className="mt-12" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 hover:from-blue-700 hover:via-cyan-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg font-roobert"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/NirmanPatel_Resume.pdf';
                link.download = 'NirmanPatel_Resume.pdf';
                link.click();
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download My Resume
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Grid Perspective Footer with Flip Clock
function GridPerspectiveFooter() {
  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <GridPerspective />
            <ambientLight intensity={0.2} />
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <FlipClock />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-4xl font-bold text-white mb-4 font-roobert">Ready to Build the Future?</h3>
          <p className="text-xl text-gray-300 font-roobert">Let's create something extraordinary together</p>
        </motion.div>
      </div>
    </section>
  )
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <InfiniteStarField />
            <FloatingElements />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-6 font-roobert">
            Nirman Patel
          </h1>
          <p className="text-xl md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-roobert">
            AI/ML Developer & Quantum Computing Enthusiast
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-roobert"
              onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Explore My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent font-roobert"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/NirmanPatel_Resume.pdf';
                link.download = 'NirmanPatel_Resume.pdf';
                link.click();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// FAQ Section
const FAQSection = () => {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const faqs = [
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in C, Python, ML libs, and LangChain OpenAI. However, to my fair exposure, my frontend stack includes Figma, React, Next.js, & Tailwind CSS and backend stack covers Node.js, SQLite3, FastAPI, and Supabase."
    },
    {
      question: "How do you approach new projects?",
      answer: "I start by understanding the core problem, then research the best technologies and methodologies. I believe in iterative development and continuous learning throughout the process."
    },
    {
      question: "What makes your development process unique?",
      answer: "I combine technical expertise with creative problem-solving. My background in both frontend and backend development allows me to see the full picture and create cohesive solutions."
    },
    {
      question: "How do you stay updated with technology?",
      answer: "I constantly explore new technologies, contribute to research projects, and participate in the developer community. I believe continuous learning is essential in our field."
    }
  ]

  return (
    <section ref={containerRef} className="relative h-[90vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-6 font-roobert">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300 font-roobert">Everything you need to know</p>
          </div>
          
          <div className="relative h-96 flex items-center justify-center">
            {faqs.map((faq, index) => {
              const centerOffset = (faqs.length - 1) / 2

              const cardX = useTransform(
                scrollYProgress,
                [0, 0.5, 1],
                [0, (index - centerOffset) * 320, (index - centerOffset) * 320]
              )
              
              const cardY = useTransform(
                scrollYProgress,
                [0, 0.5, 1],
                [index * 8, 0, 0]
              )
              
              const cardRotation = useTransform(
                scrollYProgress,
                [0, 0.5, 1],
                [index * 3, 0, 0]
              )
              
              const cardScale = useTransform(
                scrollYProgress,
                [0, 0.3, 0.7, 1],
                [0.9, 1, 1, 0.9]
              )

              return (
                <motion.div
                  key={index}
                  style={{
                    x: cardX,
                    y: cardY,
                    rotate: cardRotation,
                    scale: cardScale,
                    zIndex: faqs.length - index
                  }}
                  className="absolute w-80 h-64"
                >
                  <div 
                    className="relative h-full bg-black border border-gray-600 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden">
                    <div className="p-6 h-full flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-4 font-roobert leading-tight">
                        {faq.question}
                      </h3>
                      <p className="text-white-300 font-roobert text-sm leading-relaxed flex-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}


export default function Portfolio() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen relative overflow-x-hidden font-roobert">
      {/* Fixed Background Stars that extend throughout the page */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <InfiniteStarField />
            <ambientLight intensity={0.1} />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-black to-green-900/10" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <GridAnimation />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <CurrentWorkSection />
        <CourseworkSection />
        <AchievementsSection />
        <ResearchBentoGrid />
        <FAQSection />
        <ContactSection />
        <GridPerspectiveFooter />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 font-roobert">© 2025 Nirman Patel. Crafted with passion and cosmic inspiration.</p>
        </div>
      </footer>
    </div>
  )
}
