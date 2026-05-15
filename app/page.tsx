"use client";

import { useState, useEffect, useRef } from "react";
import {
  Database,
  Globe,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  Zap,
  TrendingUp,
  Code2,
  Cpu,
  BrainCircuit,
  Send,
  Phone,
} from "lucide-react";

// ─── Datos ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Resultados", href: "#resultados" },
  { label: "Equipo", href: "#equipo" },
];

const SERVICES = [
  {
    icon: Database,
    tag: "Datos",
    title: "Depuración y Migración de Datos",
    description:
      "Convertimos tus archivos de Excel y procesos en papel a bases de datos SQL organizadas, limpias y listas para crecer. El caos de la información tiene un precio; nosotros te lo eliminamos.",
    highlights: [
      "Limpieza de duplicados y errores",
      "Migración Excel → SQL/PostgreSQL",
      "Modelo de datos escalable",
    ],
    accentColor: "from-cyan-500 to-blue-600",
    bgGlow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: Globe,
    tag: "Presencia Web",
    title: "Desarrollo Web de Conversión",
    description:
      "Landing pages rápidas, modernas y optimizadas para convertir visitantes en clientes. Si tu negocio no existe en Google, tus competidores están tomando tus ventas.",
    highlights: [
      "Carga en menos de 2 segundos",
      "Diseño Mobile First",
      "SEO local (Quito / Ecuador)",
    ],
    accentColor: "from-violet-500 to-purple-700",
    bgGlow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: MessageSquare,
    tag: "Automatización",
    title: "Chatbots Inteligentes WhatsApp",
    description:
      "Tu negocio atiende clientes a las 2am sin pagar horas extra. Integración con WhatsApp Business API conectada a tu inventario en tiempo real mediante arquitectura RAG.",
    highlights: [
      "Respuestas automáticas 24/7",
      "Consulta de inventario en tiempo real",
      "Integración WhatsApp Business API",
    ],
    accentColor: "from-emerald-400 to-teal-600",
    bgGlow: "group-hover:shadow-emerald-500/20",
  },
];

const STATS = [
  { value: "70%", label: "Reducción de tiempo en consultas repetitivas" },
  { value: "3x", label: "Más pedidos atendidos con el mismo equipo" },
  { value: "48h", label: "Entrega de primer módulo funcional" },
  { value: "$0", label: "Costo de mantenimiento el primer mes" },
];

const TEAM = [
  {
    name: "Alejandro Camino",
    role: "Fundador · Ingeniería de Software",
    university: "Universidad de las Américas, Quito — Ecuador",
    focus: "Bases de datos, Arquitectura Web y Modelos de Datos",
    skills: [
      "Next.js & React",
      "PostgreSQL / SQL",
      "Python & Data Modeling",
      "REST APIs",
      "Tailwind CSS",
      "Arquitectura RAG",
    ],
    icon: Code2,
  },
  {
    name: "David Panchi",
    role: "Socio · Ingeniería en Automatización y Robotica",
    university: "Universidad Técnica de Ambato, Quito — Ecuador",
    focus: "Automatización de conversaciones y WhatsApp Business",
    skills: [
      "WhatsApp Business API",
      "LLM Integrations",
      "RAG Pipelines",
      "Automatización N8N",
      "Chatbot Design",
      "CRM Integration",
    ],
    icon: BrainCircuit,
  },
];

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: any, suffix?: any }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const isNumeric = !isNaN(parseInt(target));
          if (!isNumeric) {
            setCount(target);
            return;
          }
          const end = parseInt(target);
          const duration = 1500;
          const step = Math.ceil(end / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, end);
            setCount(current);
            if (current >= end) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleContact = () => {
    const msg = encodeURIComponent(
      "Hola, vi su landing page y me interesa conocer cómo pueden ayudar a mi negocio. ¿Podemos agendar una llamada?"
    );
    window.open(`https://wa.me/593999999999?text=${msg}`, "_blank");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Lumi<span className="text-cyan-400">na</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA desktop */}
        <button
          onClick={handleContact}
          className="hidden md:flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
        >
          <Phone size={14} />
          Contactar
        </button>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-400 hover:text-white p-1"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-950/98 backdrop-blur-md border-b border-slate-800 px-4 pb-6 pt-2 space-y-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white py-2 text-base font-medium border-b border-slate-800/50"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={handleContact}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl mt-2"
          >
            <Phone size={16} />
            Hablar por WhatsApp
          </button>
        </div>
      )}
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const handleCTA = () => {
    const msg = encodeURIComponent(
      "Hola, quiero digitalizar mi negocio. ¿Me pueden dar más información sobre sus servicios?"
    );
    window.open(`https://wa.me/593999999999?text=${msg}`, "_blank");
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-950">
      {/* Radial vignette — no grid, clean background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          Agencia tecnológica · Quito, Ecuador
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
          La tecnología que{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
              tu negocio necesita
            </span>
          </span>
          <br className="hidden sm:block" />
          {" "}para vender más
          <br />
          <span className="text-slate-500">y trabajar menos.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Digitalizamos PyMEs en Ecuador: organizamos tus datos, creamos tu
          presencia web y automatizamos la atención al cliente por WhatsApp.{" "}
          <strong className="text-slate-200">
            La tecnología que implementamos se paga sola en semanas, no en años.
          </strong>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <button
            onClick={handleCTA}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-cyan-600/30 hover:shadow-cyan-500/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            <MessageSquare size={18} />
            Quiero digitalizar mi negocio
            <ArrowRight size={16} />
          </button>
          <a
            href="#servicios"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200"
          >
            Ver servicios
            <ChevronDown size={16} />
          </a>
        </div>

        {/* Social proof bar */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-slate-500">
          {[
            "✓ Sin contratos largos",
            "✓ Primer entregable en 48h",
            "✓ Soporte en español",
          ].map((t) => (
            <span key={t} className="text-slate-400 font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 animate-bounce">
        <ChevronDown size={20} />
      </div>
    </section>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section id="resultados" className="bg-slate-900 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-widest mb-10">
          Resultados que nuestros clientes empiezan a ver
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="text-center p-4 rounded-2xl bg-slate-800/50 border border-slate-700/40"
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                {s.value.includes("%") ? (
                  <>
                    <AnimatedCounter target={parseInt(s.value)} />%
                  </>
                ) : s.value === "3x" ? (
                  "3x"
                ) : s.value === "48h" ? (
                  "48h"
                ) : (
                  "$0"
                )}
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-snug">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

function Services() {
  return (
    <section id="servicios" className="bg-slate-950 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-3">
            Servicios
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Soluciones independientes para cada necesidad
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Cada servicio funciona por sí solo. Contrata el que resuelve tu
            problema hoy — y suma los demás cuando tu negocio lo pida.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${s.bgGlow}`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.accentColor} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <Icon size={22} className="text-white" />
                </div>

                {/* Tag */}
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  {s.tag}
                </p>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {s.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-cyan-500 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-slate-300">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bonus service teaser */}
        <div className="mt-6 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <BarChart3 size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              Próximamente
            </p>
            <h3 className="text-white font-bold text-lg mb-1">
              Análisis Predictivo con IA
            </h3>
            <p className="text-slate-400 text-sm">
              Usando los datos ya saneados, predecimos stock, picos de demanda y
              oportunidades de venta. Para negocios listos para escalar.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
            <TrendingUp size={12} />
            En desarrollo
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────

function Team() {
  return (
    <section id="equipo" className="bg-slate-900 border-t border-slate-800 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-3">
            El equipo
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Ingenieros, no vendedores de software
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Somos un equipo técnico fundado en Quito, especializado en
            convertir procesos manuales en sistemas que trabajan por ti.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TEAM.map((member) => {
            const Icon = member.icon;
            return (
              <div
                key={member.name}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 sm:p-8 hover:border-slate-600 transition-colors"
              >
                {/* Avatar placeholder */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Icon size={26} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{member.role}</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      {member.university}
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                  <span className="text-slate-500">Enfoque: </span>
                  {member.focus}
                </p>

                {/* Skills */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-slate-700/80 border border-slate-600/50 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT / CTA FINAL ─────────────────────────────────────────────────────

function ContactCTA() {
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    need: "",
  });
  const [sent, setSent] = useState(false);

  const handleWhatsApp = () => {
    const { name, business, need } = formData;
    const msg = encodeURIComponent(
      `Hola, me llamo ${name || "…"} y tengo un negocio llamado "${business || "…"}". Necesito ayuda con: ${need || "digitalizar mis procesos"}. ¿Podemos hablar?`
    );
    window.open(`https://wa.me/593999999999?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <section id="contacto" className="bg-slate-950 border-t border-slate-800 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
              Hablemos
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Una conversación de 15 min puede ahorrarle a tu negocio{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                horas cada semana.
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8">
              Cuéntanos brevemente en qué está tu negocio. Te respondemos en
              menos de 2 horas por WhatsApp con una propuesta concreta y sin
              compromiso.
            </p>
            <div className="space-y-3">
              {[
                "Diagnóstico gratuito de tu situación actual",
                "Propuesta con precio fijo, sin sorpresas",
                "Primer entregable en 48 horas",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  ¡Perfecto, te abrimos WhatsApp!
                </h3>
                <p className="text-slate-400 text-sm">
                  Si no se abrió automáticamente, escríbenos al{" "}
                  <span className="text-cyan-400">+593 99 999 9999</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-xl mb-1">
                  Cuéntanos sobre tu negocio
                </h3>
                <p className="text-slate-500 text-sm mb-5">
                  Responderemos por WhatsApp en menos de 2 horas.
                </p>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Andrade"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">
                    Nombre de tu negocio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ferretería El Constructor"
                    value={formData.business}
                    onChange={(e) =>
                      setFormData({ ...formData, business: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">
                    ¿Qué proceso quieres mejorar?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ej. Tengo mi inventario en Excel y siempre me quedan sin stock los productos que más se venden..."
                    value={formData.need}
                    onChange={(e) =>
                      setFormData({ ...formData, need: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 mt-2"
                >
                  <Send size={18} />
                  Enviar por WhatsApp
                </button>

                <p className="text-slate-600 text-xs text-center">
                  Al continuar, abriremos WhatsApp con tu mensaje pre-llenado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <span className="text-slate-400 text-sm font-semibold">
            Lumi<span className="text-cyan-400">na</span>
          </span>
        </div>
        <p className="text-slate-600 text-xs text-center">
          © {new Date().getFullYear()} Lumina · Quito, Ecuador · Digitalizando PyMEs
        </p>
        <div className="flex items-center gap-1 text-slate-600 text-xs">
          <Cpu size={12} />
          <span>Hecho con Next.js & Tailwind</span>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-slate-950 min-h-screen">
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