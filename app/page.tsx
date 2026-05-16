"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Database, Globe, MessageSquare, ArrowRight, CheckCircle,
  Menu, X, ChevronDown, BarChart3, TrendingUp, Code2,
  Cpu, BrainCircuit, Send, Phone,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Background:  #111118 / #16161f / #1c1c28
// Violet:      #7c3aed / #8b5cf6 / #a78bfa
// Surface:     rgba(255,255,255,0.04)
// Border:      rgba(139,92,246,0.18)
// Text hi:     #f1f5f9
// Text mid:    #64748b
// Text lo:     #334155

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Resultados", href: "#resultados" },
  { label: "Equipo",    href: "#equipo"    },
];

const SERVICES = [
  {
    icon: Database,
    tag: "Datos",
    title: "Depuración y Migración de Datos",
    description: "Convertimos Excel y papel en bases de datos SQL limpias, ordenadas y listas para escalar. El desorden de la información tiene un costo diario; nosotros te lo eliminamos.",
    highlights: ["Limpieza de duplicados y errores", "Migración Excel → SQL / PostgreSQL", "Modelo de datos escalable"],
    accent: "#8b5cf6",
    iconFrom: "#7c3aed", iconTo: "#6d28d9",
  },
  {
    icon: Globe,
    tag: "Presencia Web",
    title: "Desarrollo Web de Conversión",
    description: "Sitios rápidos, modernos y optimizados para convertir visitas en ventas. Si tu negocio no aparece en Google, tus competidores están cobrando lo que debería ser tuyo.",
    highlights: ["Carga en menos de 2 segundos", "Diseño Mobile First", "SEO local — Quito / Ecuador"],
    accent: "#a78bfa",
    iconFrom: "#8b5cf6", iconTo: "#7c3aed",
  },
  {
    icon: MessageSquare,
    tag: "Automatización",
    title: "Chatbots Inteligentes WhatsApp",
    description: "Atención 24/7 sin pagar horas extra. Integración con WhatsApp Business API conectada a tu inventario en tiempo real mediante arquitectura RAG.",
    highlights: ["Respuestas automáticas 24 / 7", "Consulta de inventario en tiempo real", "WhatsApp Business API"],
    accent: "#c4b5fd",
    iconFrom: "#a78bfa", iconTo: "#8b5cf6",
  },
];

const STATS = [
  { value: "70%", label: "Menos tiempo en consultas repetitivas" },
  { value: "3x",  label: "Más pedidos con el mismo equipo"       },
  { value: "48h", label: "Primer módulo funcional entregado"     },
  { value: "$0",  label: "Mantenimiento el primer mes"           },
];

const TEAM = [
  {
    name: "Alejandro Camino", role: "Fundador · Ing. de Software",
    focus: "Bases de datos, Arquitectura Web y Modelos de Datos",
    skills: ["Next.js & React", "PostgreSQL / SQL", "Python", "REST APIs", "Arquitectura RAG"],
    icon: Code2,
  },
  {
    name: "Valeria Molina", role: "Developer · Ing. de Software",
    focus: "Automatización de conversaciones y WhatsApp Business",
    skills: ["WhatsApp Business API", "LLM Integrations", "RAG Pipelines", "N8N", "CRM Integration"],
    icon: BrainCircuit,
  },
];

// ─── Particle Star 3D ─────────────────────────────────────────────────────────

function ParticleStar() {
  const mountRef = useRef<any>(null);
  const frameRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 4.5;

    // ── Build star-burst target positions ──
    const TOTAL   = 1800;
    const ARMS    = 6;      // spike count
    const targets = new Float32Array(TOTAL * 3);
    const origins = new Float32Array(TOTAL * 3);
    const speeds  = new Float32Array(TOTAL);
    const phases  = new Float32Array(TOTAL);

    for (let i = 0; i < TOTAL; i++) {
      // Random starting cloud
      origins[i * 3]     = (Math.random() - 0.5) * 10;
      origins[i * 3 + 1] = (Math.random() - 0.5) * 10;
      origins[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Star shape target
      const arm     = Math.floor(Math.random() * ARMS);
      const angle   = (arm / ARMS) * Math.PI * 2 + (Math.random() - 0.5) * 0.38;
      const dist    = 0.08 + Math.pow(Math.random(), 1.6) * 1.55;
      const spread  = (1 - dist / 1.55) * 0.13 + 0.02;
      targets[i * 3]     = Math.cos(angle) * dist + (Math.random() - 0.5) * spread;
      targets[i * 3 + 1] = Math.sin(angle) * dist + (Math.random() - 0.5) * spread;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.18;

      speeds[i] = 0.3 + Math.random() * 0.7;
      phases[i] = Math.random() * Math.PI * 2;
    }

    // ── Geometry & live positions ──
    const geo = new THREE.BufferGeometry();
    const live = new Float32Array(TOTAL * 3);
    for (let i = 0; i < TOTAL * 3; i++) live[i] = origins[i];
    geo.setAttribute("position", new THREE.BufferAttribute(live, 3));

    // Per-particle color  — violet → white core
    const colors = new Float32Array(TOTAL * 3);
    for (let i = 0; i < TOTAL; i++) {
      const dist = Math.sqrt(targets[i*3]**2 + targets[i*3+1]**2);
      const t    = Math.min(dist / 1.5, 1);
      // core = white, tips = violet
      colors[i * 3]     = 0.55 + (1 - t) * 0.45;  // R
      colors[i * 3 + 1] = 0.36 + (1 - t) * 0.44;  // G
      colors[i * 3 + 2] = 0.98;                     // B always high
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Phase state ──
    // 0 = assembling, 1 = formed (pulsing), 2 = dissolving, 3 = re-assembling
    let phase    = 0;
    let progress = 0; // 0→1 within each phase
    const PHASE_SPEED = { 0: 0.004, 1: 0, 2: 0.003, 3: 0.005 };
    const HOLD_TIME   = 180; // frames to hold the star
    let   holdFrames  = 0;

    // Easing
    const easeInOut = (t: any) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    const easeOut   = (t: any) => 1 - Math.pow(1 - t, 3);

    // Mouse
    const onMouse = (e: any) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 0.6;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.6;
    };

    const onResize = () => {
      if (!el) return;
      
      const target = el as any; // 👈 Le decimos a TS que ignore el tipo de dato aquí
      
      camera.aspect = target.clientWidth / target.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(target.clientWidth, target.clientHeight);
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize",    onResize);

    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate) as any; // 👈 Agregamos 'as any' aquí
      t++;

      const pos = geo.attributes.position.array;

      if (phase === 0) {
        // Particles fly in from chaos → star shape
        progress = Math.min(progress + PHASE_SPEED[0], 1);
        const e  = easeOut(progress);
        mat.opacity = Math.min(e * 1.6, 1);

        for (let i = 0; i < TOTAL; i++) {
          const sp = speeds[i];
          const local = Math.min(easeOut(Math.max(0, progress * 1.4 - sp * 0.35)), 1);
          pos[i*3]   = origins[i*3]   + (targets[i*3]   - origins[i*3])   * local;
          pos[i*3+1] = origins[i*3+1] + (targets[i*3+1] - origins[i*3+1]) * local;
          pos[i*3+2] = origins[i*3+2] + (targets[i*3+2] - origins[i*3+2]) * local;
        }
        if (progress >= 1) { phase = 1; holdFrames = 0; }

      } else if (phase === 1) {
        // Hold — gentle pulse & float
        holdFrames++;
        const pulse = 1 + Math.sin(t * 0.025) * 0.018;
        for (let i = 0; i < TOTAL; i++) {
          pos[i*3]   = targets[i*3]   * pulse + Math.sin(phases[i] + t * 0.012) * 0.004;
          pos[i*3+1] = targets[i*3+1] * pulse + Math.cos(phases[i] + t * 0.012) * 0.004;
          pos[i*3+2] = targets[i*3+2];
        }
        // Slow mouse-driven rotation
        points.rotation.z += (mouseRef.current.x * 0.4 - points.rotation.z) * 0.04;
        points.rotation.x += (mouseRef.current.y * 0.3 - points.rotation.x) * 0.04;

        if (holdFrames > HOLD_TIME) { phase = 2; progress = 0; }

      } else if (phase === 2) {
        // Dissolve — explode outward
        progress = Math.min(progress + PHASE_SPEED[2], 1);
        const e  = easeInOut(progress);
        mat.opacity = 1 - e;

        for (let i = 0; i < TOTAL; i++) {
          const explode = 1 + e * (1.5 + speeds[i] * 1.2);
          pos[i*3]   = targets[i*3]   * explode + (Math.random()-0.5)*e*0.1;
          pos[i*3+1] = targets[i*3+1] * explode + (Math.random()-0.5)*e*0.1;
          pos[i*3+2] = targets[i*3+2] * explode;
        }
        if (progress >= 1) {
          // Reset to new random origin cloud
          for (let i = 0; i < TOTAL; i++) {
            origins[i*3]   = (Math.random()-0.5)*10;
            origins[i*3+1] = (Math.random()-0.5)*10;
            origins[i*3+2] = (Math.random()-0.5)*10;
            pos[i*3]   = origins[i*3];
            pos[i*3+1] = origins[i*3+1];
            pos[i*3+2] = origins[i*3+2];
          }
          phase = 3; progress = 0;
          points.rotation.z = 0; points.rotation.x = 0;
        }

      } else if (phase === 3) {
        // Re-assemble with slight rotation offset
        progress = Math.min(progress + PHASE_SPEED[3], 1);
        const e  = easeOut(progress);
        mat.opacity = Math.min(e * 1.8, 1);

        const rotOffset = (Math.PI * 2) / ARMS / 2; // half-arm offset each cycle
        for (let i = 0; i < TOTAL; i++) {
          const sp    = speeds[i];
          const local = Math.min(easeOut(Math.max(0, progress * 1.4 - sp * 0.35)), 1);
          // rotate targets for variety
          const tx = targets[i*3]  * Math.cos(rotOffset) - targets[i*3+1] * Math.sin(rotOffset);
          const ty = targets[i*3]  * Math.sin(rotOffset) + targets[i*3+1] * Math.cos(rotOffset);
          pos[i*3]   = origins[i*3]   + (tx - origins[i*3])   * local;
          pos[i*3+1] = origins[i*3+1] + (ty - origins[i*3+1]) * local;
          pos[i*3+2] = origins[i*3+2] + (targets[i*3+2] - origins[i*3+2]) * local;
        }
        if (progress >= 1) { phase = 1; holdFrames = 0; progress = 1; }
      }

      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

// ─── Hero content ─────────────────────────────────────────────────────────────

function HeroContent() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const tt = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2100),
      setTimeout(() => setPhase(4), 2700),
    ];
    return () => tt.forEach(clearTimeout);
  }, []);

  const handleCTA = () => {
    const msg = encodeURIComponent("Hola, quiero digitalizar mi negocio. ¿Me pueden dar más información?");
    window.open(`https://wa.me/593999999999?text=${msg}`, "_blank");
  };

  const show = (p: any, delay = 0) => ({
    opacity:    phase >= p ? 1 : 0,
    transform:  phase >= p ? "translateY(0px)" : "translateY(22px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  const letters = "LUMINA".split("");

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20 pb-16">

      {/* Eyebrow */}
      <div
        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-12 uppercase tracking-[0.2em]"
        style={{
          border:     "1px solid rgba(139,92,246,0.35)",
          color:      "#a78bfa",
          background: "rgba(139,92,246,0.07)",
          ...show(1),
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        Agencia tecnológica B2B · Quito, Ecuador
      </div>

      {/* LUMINA — letter spring */}
      <h1 className="flex items-end gap-[0.01em] mb-5 leading-none" aria-label="Lumina">
        {letters.map((l, i) => (
          <span
            key={i}
            style={{
              fontWeight: 900,
              fontSize:   "clamp(4.5rem, 15vw, 9.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              background: "linear-gradient(160deg, #f1f5f9 0%, #c4b5fd 55%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
              display:    "inline-block",
              opacity:    phase >= 1 ? 1 : 0,
              transform:  phase >= 1 ? "translateY(0) rotateX(0deg)" : "translateY(60px) rotateX(40deg)",
              transition: `opacity 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i*0.06+0.05}s,
                           transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i*0.06+0.05}s`,
            }}
          >
            {l}
          </span>
        ))}
      </h1>

      {/* Eslogan — large, impactful, split into two lines */}
      <div style={show(2)} className="mb-4">
        <p
          className="font-semibold leading-tight tracking-tight"
          style={{
            fontSize: "clamp(1.4rem, 3.8vw, 2.6rem)",
            color:    "#f1f5f9",
          }}
        >
          Deja de administrar el caos.
        </p>
        <p
          className="font-light leading-tight"
          style={{
            fontSize: "clamp(1.4rem, 3.8vw, 2.6rem)",
            background: "linear-gradient(90deg, #a78bfa, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
            backgroundClip:       "text",
          }}
        >
          Empieza a escalar tu negocio.
        </p>
      </div>

      {/* Subline */}
      <p
        className="max-w-lg text-base sm:text-lg font-light leading-relaxed mb-12"
        style={{ color: "#475569", ...show(3) }}
      >
        Datos, presencia web y automatización WhatsApp — tres palancas que
        convierten una PyME tradicional en un negocio que compite en digital.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-14" style={show(4)}>
        <button
          onClick={handleCTA}
          className="group w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color:      "#f1f5f9",
            boxShadow:  "0 0 40px rgba(124,58,237,0.45), 0 4px 20px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 60px rgba(124,58,237,0.65), 0 4px 20px rgba(0,0,0,0.4)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 40px rgba(124,58,237,0.45), 0 4px 20px rgba(0,0,0,0.4)"}
        >
          <MessageSquare size={16} />
          Quiero crecer con tecnología
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        <a
          href="#servicios"
          className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          style={{
            border:     "1px solid rgba(139,92,246,0.3)",
            color:      "#a78bfa",
            background: "rgba(139,92,246,0.06)",
          }}
        >
          Ver servicios <ChevronDown size={15} />
        </a>
      </div>

      {/* Trust bar */}
      <div
        className="flex flex-wrap justify-center gap-6"
        style={{ ...show(4, 0.15) }}
      >
        {["✓ Sin contratos largos", "✓ Primer entregable en 48h", "✓ Soporte en español"].map(t => (
          <span key={t} className="text-xs font-medium" style={{ color: "#334155" }}>{t}</span>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: "#1e293b" }}>
        <ChevronDown size={20} />
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleContact = () => {
    window.open(`https://wa.me/593999999999?text=${encodeURIComponent("Hola, vi su web y me interesa saber más sobre sus servicios.")}`, "_blank");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background:    scrolled ? "rgba(17,17,24,0.94)" : "transparent",
        backdropFilter:scrolled ? "blur(20px)" : "none",
        borderBottom:  scrolled ? "1px solid rgba(139,92,246,0.12)" : "1px solid transparent",
        boxShadow:     scrolled ? "0 4px 40px rgba(0,0,0,0.6)" : "none",
      }}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#">
          <span
            className="font-black text-lg tracking-wider uppercase"
            style={{
              background:         "linear-gradient(135deg, #f1f5f9 20%, #a78bfa 100%)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor: "transparent",
              backgroundClip:      "text",
            }}
          >Lumina</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#475569" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a78bfa"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >{l.label}</a>
          ))}
        </div>

        <button
          onClick={handleContact}
          className="hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color:      "#f1f5f9",
            boxShadow:  "0 0 20px rgba(124,58,237,0.3)",
          }}
        >
          <Phone size={13} /> Contactar
        </button>

        <button onClick={() => setOpen(!open)} className="md:hidden p-1" style={{ color: "#475569" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          className="md:hidden px-5 pb-6 pt-2 space-y-2"
          style={{ background: "rgba(17,17,24,0.98)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}
        >
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-base font-medium border-b"
              style={{ color: "#64748b", borderColor: "rgba(255,255,255,0.05)" }}
            >{l.label}</a>
          ))}
          <button onClick={handleContact}
            className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl mt-3"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#f1f5f9" }}
          >
            <Phone size={16} /> Hablar por WhatsApp
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "#111118" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(124,58,237,0.1) 0%, rgba(109,40,217,0.04) 40%, transparent 70%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-52 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, #111118)" }}
      />
      <ParticleStar />
      <HeroContent />
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Stats() {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="resultados" ref={ref}
      style={{ background: "#16161f", borderTop: "1px solid rgba(139,92,246,0.1)", borderBottom: "1px solid rgba(139,92,246,0.1)" }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-10" style={{ color: "#334155" }}>
          Lo que nuestros clientes empiezan a ver
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s, i) => (
            <div key={s.label}
              className="text-center p-6 rounded-2xl transition-all duration-700"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(139,92,246,0.12)",
                opacity:   vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(28px)",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="text-3xl sm:text-4xl font-black mb-2"
                style={{
                  background: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                }}
              >{s.value}</div>
              <p className="text-xs sm:text-sm leading-snug" style={{ color: "#475569" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="servicios" ref={ref} className="py-24 sm:py-32" style={{ background: "#111118" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        <div className="max-w-xl mb-16 transition-all duration-700"
          style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>Servicios</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Soluciones independientes, resultados inmediatos
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#475569" }}>
            Contrata lo que necesitas hoy. Suma más cuando tu negocio lo pida.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title}
                className="rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1.5 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  opacity:   vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(32px)",
                  transitionDelay: `${0.1 + i * 0.12}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid ${s.accent}45`;
                  e.currentTarget.style.boxShadow = `0 0 40px ${s.accent}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `linear-gradient(135deg, ${s.iconFrom}, ${s.iconTo})`,
                    boxShadow:  `0 0 22px ${s.accent}35`,
                  }}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: s.accent, opacity: 0.7 }}>{s.tag}</p>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{s.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#475569" }}>{s.description}</p>
                <ul className="space-y-1.5">
                  {s.highlights.map(h => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: s.accent }} />
                      <span style={{ color: "#64748b" }}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* IA teaser */}
        <div className="mt-5 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all duration-700"
          style={{
            background: "rgba(124,58,237,0.04)",
            border: "1px solid rgba(139,92,246,0.16)",
            opacity: vis ? 1 : 0,
            transitionDelay: "0.5s",
          }}
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: "0 0 24px rgba(124,58,237,0.4)" }}>
            <BarChart3 size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#7c3aed" }}>Próximamente</p>
            <h3 className="font-bold text-white mb-0.5">Análisis Predictivo con IA</h3>
            <p className="text-sm" style={{ color: "#475569" }}>
              Predicción de stock, demanda y oportunidades de venta con los datos ya saneados.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.28)", color: "#a78bfa" }}>
            <TrendingUp size={12} /> En desarrollo
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────

function Team() {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="equipo" ref={ref} className="py-24 sm:py-32"
      style={{ background: "#16161f", borderTop: "1px solid rgba(139,92,246,0.08)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-xl mb-14 transition-all duration-700"
          style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>El equipo</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
            Ingenieros, no vendedores
          </h2>
          <p className="text-base" style={{ color: "#475569" }}>
            Equipo técnico fundado en Quito. Convertimos procesos manuales en sistemas que trabajan por ti.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {TEAM.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={m.name}
                className="rounded-2xl p-7 transition-all duration-700 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(139,92,246,0.09)",
                  opacity:   vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${i * 0.15}s`,
                }}
                onMouseEnter={e => e.currentTarget.style.border = "1px solid rgba(139,92,246,0.25)"}
                onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(139,92,246,0.09)"}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #4c1d95, #6d28d9)", boxShadow: "0 0 24px rgba(109,40,217,0.25)" }}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{m.name}</h3>
                    <p className="text-sm" style={{ color: "#475569" }}>{m.role}</p>
                  </div>
                </div>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: "#475569" }}>
                  <span style={{ color: "#334155" }}>Enfoque: </span>{m.focus}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: "#334155" }}>Skills</p>
                <div className="flex flex-wrap gap-2">
                  {m.skills.map(sk => (
                    <span key={sk} className="text-xs font-medium px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(124,58,237,0.06)",
                        border:     "1px solid rgba(139,92,246,0.18)",
                        color:      "#64748b",
                      }}
                    >{sk}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactCTA() {
  const [form, setForm] = useState<any>({ name: "", business: "", need: "" });
  const [sent, setSent]   = useState(false);
  const [vis,  setVis]    = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  const submit = () => {
    const msg = encodeURIComponent(
      `Hola, soy ${form.name || "…"} de "${form.business || "…"}". Necesito: ${form.need || "digitalizar mis procesos"}. ¿Hablamos?`
    );
    window.open(`https://wa.me/593999999999?text=${msg}`, "_blank");
    setSent(true);
  };

  const inp = {
    width: "100%", borderRadius: "12px", padding: "11px 14px",
    fontSize: "14px", outline: "none", color: "white",
    background: "rgba(255,255,255,0.04)",
    border:     "1px solid rgba(139,92,246,0.15)",
    transition: "border-color 0.2s",
  };

  return (
    <section id="contacto" ref={ref} className="py-24 sm:py-32"
      style={{ background: "#111118", borderTop: "1px solid rgba(139,92,246,0.08)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="transition-all duration-700"
            style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>Hablemos</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
              15 minutos pueden cambiar{" "}
              <span style={{
                background: "linear-gradient(90deg, #a78bfa, #c4b5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                la trayectoria de tu negocio.
              </span>
            </h2>
            <p className="text-base leading-relaxed mb-7" style={{ color: "#475569" }}>
              Cuéntanos dónde está tu negocio hoy. Respondemos en menos de 2 horas
              con una propuesta concreta, sin compromiso.
            </p>
            <div className="space-y-2.5">
              {["Diagnóstico gratuito", "Precio fijo sin sorpresas", "Primer entregable en 48h"].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: "#7c3aed", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "#64748b" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-7 transition-all duration-700"
            style={{
              background: "rgba(255,255,255,0.025)",
              border:     "1px solid rgba(139,92,246,0.14)",
              opacity:    vis ? 1 : 0,
              transform:  vis ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.15s",
            }}
          >
            {sent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(124,58,237,0.12)" }}>
                  <CheckCircle size={28} style={{ color: "#a78bfa" }} />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">¡Abrimos WhatsApp!</h3>
                <p className="text-sm" style={{ color: "#475569" }}>
                  Si no se abrió, escríbenos al <span style={{ color: "#a78bfa" }}>+593 99 999 9999</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white mb-0.5">Cuéntanos sobre tu negocio</h3>
                <p className="text-xs mb-4" style={{ color: "#334155" }}>Respondemos en menos de 2 horas por WhatsApp.</p>

                {[
                  { k: "name",     label: "Tu nombre",            ph: "Ej. Carlos Andrade"          },
                  { k: "business", label: "Tu negocio",           ph: "Ej. Ferretería El Constructor"},
                ].map(f => (
                  <div key={f.k}>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#334155" }}>{f.label}</label>
                    <input type="text" placeholder={f.ph} value={form[f.k]}
                      onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                      style={inp}
                      onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.5)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(139,92,246,0.15)"}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#334155" }}>¿Qué proceso quieres mejorar?</label>
                  <textarea rows={3} placeholder="Ej. Llevo el inventario en Excel y siempre me quedo sin stock..."
                    value={form.need} onChange={e => setForm({ ...form, need: e.target.value })}
                    style={{ ...inp, resize: "none" }}
                    onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.5)"}
                    onBlur={e  => e.target.style.borderColor = "rgba(139,92,246,0.15)"}
                  />
                </div>

                <button onClick={submit}
                  className="w-full flex items-center justify-center gap-2 font-bold text-base py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 mt-1"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    color:      "#f1f5f9",
                    boxShadow:  "0 0 32px rgba(124,58,237,0.35)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.55)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.35)"}
                >
                  <Send size={16} /> Enviar por WhatsApp
                </button>
                <p className="text-xs text-center" style={{ color: "#1e293b" }}>
                  Abriremos WhatsApp con tu mensaje pre-llenado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-7" style={{ background: "#111118", borderTop: "1px solid rgba(139,92,246,0.07)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-black text-sm tracking-wider uppercase"
          style={{
            background: "linear-gradient(135deg, #f1f5f9 20%, #a78bfa 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >Lumina</span>
        <p className="text-xs text-center" style={{ color: "#1e293b" }}>
          © {new Date().getFullYear()} Lumina Software · Quito, Ecuador
        </p>
        <div className="flex items-center gap-1 text-xs" style={{ color: "#1e293b" }}>
          <Cpu size={11} /><span>Next.js & Tailwind</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main style={{ background: "#111118", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Team />
      <ContactCTA />
      <Footer />
    </main>
  );
}