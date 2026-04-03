import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, ZoomIn, Move, Terminal, Share2 } from "lucide-react";

// --- Konstanten & Presets ---
const PRESETS = [
  { label: "#FIRING", text: "#FIRING", color: "#dc2626", humorText: { en: "Boss who discovered Agentic-Coding?", de: "Chef, der Agentic-Coding entdeckt hat?" }, descriptionText: { en: "Show your network that you've discovered AI agents and are now showing half the team the door. You'll get this frame for your profile.", de: "Zeigen Sie Ihrem Netzwerk, dass Sie KI-Agenten entdeckt haben und nun das halbe Team vor die Tür setzen. Sie erhalten diesen Rahmen für Ihr Profil." }, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
  { label: "#WORKSONMYMCHN", text: "#WORKSONMYMCHN", color: "#0d9488", humorText: { en: "Docker container crashed again?", de: "Docker-Container schon wieder abgestürzt?" }, descriptionText: { en: "Let all members know that the bug is definitely not in your code. You'll get this frame for your profile.", de: "Lassen Sie alle Mitglieder wissen, dass der Bug definitiv nicht an Ihrem Code liegt. Sie erhalten diesen Rahmen für Ihr Profil." }, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
  { label: "#YOLODEPLOY", text: "#YOLODEPLOY", color: "#db2777", humorText: { en: "Pushing to production on a Friday at 5 PM?", de: "Freitags um 17 Uhr in Produktion pushen?" }, descriptionText: { en: "Inform your network about your brave move to push untested code live on a Friday afternoon. You'll get this frame for your profile.", de: "Informieren Sie Ihr Netzwerk über Ihren mutigen Schritt, am Freitagnachmittag ungetesteten Code live zu schalten. Sie erhalten diesen Rahmen für Ihr Profil." }, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },
  { label: "#LGTM", text: "#LGTM", color: "#10b981", humorText: { en: "Approved the PR without reading the code?", de: "PR ohne Code-Review freigegeben?" }, descriptionText: { en: "Show everyone that you basically approve pull requests blindly. You'll get this frame for your profile.", de: "Zeigen Sie allen, dass Sie Pull Requests grundsätzlich blind durchwinken. Sie erhalten diesen Rahmen für Ihr Profil." }, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
  { label: "#STACKOVERFLOW", text: "#STACKOVERFLOW", color: "#f97316", humorText: { en: "Copy-pasted the entire architecture?", de: "Die komplette Architektur kopiert?" }, descriptionText: { en: "Openly admit that your entire architecture is copy-pasted from the internet. You'll get this frame for your profile.", de: "Geben Sie offen zu, dass Ihre gesamte Architektur aus dem Internet kopiert ist. Sie erhalten diesen Rahmen für Ihr Profil." }, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
  { label: "#GITBLAME", text: "#GITBLAME", color: "#6366f1", humorText: { en: "Trying to find out who wrote this spaghetti code?", de: "Auf der Suche nach dem Autor dieses Spaghetti-Codes?" }, descriptionText: { en: "Let your network know that you are desperately looking for the culprit behind this code. You'll get this frame for your profile.", de: "Lassen Sie Ihr Netzwerk wissen, dass Sie gerade verzweifelt den Schuldigen für diesen Code suchen. Sie erhalten diesen Rahmen für Ihr Profil." }, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
  { label: "#RM-RF", text: "#RM-RF", color: "#e11d48", humorText: { en: "Accidentally wiped the production database?", de: "Aus Versehen die Produktionsdatenbank gelöscht?" }, descriptionText: { en: "Warn your contacts that you just accidentally deleted the production database. You'll get this frame for your profile.", de: "Warnen Sie Ihre Kontakte, dass Sie soeben versehentlich die Produktionsdatenbank gelöscht haben. Sie erhalten diesen Rahmen für Ihr Profil." }, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
];

const TRANSLATIONS = {
  en: {
    title: "Profile Badge",
    generator: "Generator",
    subtitle: "LinkedIn-Style Profile Picture with Developer Humor",
    clickForPhoto: "Click for photo",
    dragToMove: "Drag image to move",
    zoom: "Zoom",
    presets: "Developer Presets",
    customText: "Custom Text",
    color: "Color",
    btnChoose: "Choose Photo",
    btnExport: "Export",
    btnShare: "Share",
    customHumor: "Custom developer mode activated?",
    customDesc: (text: string) => `Show your network your individual developer status. You'll get this frame with the text "${text}" for your profile.`,
    getStarted: "Get started",
    shareTitle: "Developer Profile Badge",
    shareText: (text: string) => `Check out my new ${text} status!`,
    shareError: "Sharing files is not supported on this browser. Please download the image and share it manually."
  },
  de: {
    title: "Profile Badge",
    generator: "Generator",
    subtitle: "LinkedIn-Style Profilbild mit Developer Humor",
    clickForPhoto: "Klick für Foto",
    dragToMove: "Bild ziehen zum Verschieben",
    zoom: "Zoom",
    presets: "Developer Presets",
    customText: "Eigener Text",
    color: "Farbe",
    btnChoose: "Foto wählen",
    btnExport: "Export",
    btnShare: "Teilen",
    customHumor: "Custom developer mode activated?",
    customDesc: (text: string) => `Zeigen Sie Ihrem Netzwerk Ihren individuellen Entwickler-Status. Sie erhalten diesen Rahmen mit dem Schriftzug „${text}“ für Ihr Profil.`,
    getStarted: "Jetzt starten",
    shareTitle: "Developer Profile Badge",
    shareText: (text: string) => `Schau dir meinen neuen ${text} Status an!`,
    shareError: "Das Teilen von Dateien wird von diesem Browser nicht unterstützt. Bitte lade das Bild herunter und teile es manuell."
  }
};

function isImageFile(file: File | null | undefined) {
  return !!file && typeof file.type === "string" && file.type.startsWith("image/");
}

function hexToRgb(hex: string) {
  const match = /^#([a-f\d]{6})$/i.exec(hex);
  if (!match) return { r: 220, g: 38, b: 38 };
  return {
    r: parseInt(match[1].slice(0, 2), 16),
    g: parseInt(match[1].slice(2, 4), 16),
    b: parseInt(match[1].slice(4, 6), 16),
  };
}

function isValidHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

// --- Präzise & Bug-Freie Canvas Zeichenlogik ---

function drawBannerArc(ctx: CanvasRenderingContext2D, offscreenCanvas: HTMLCanvasElement, size: number, center: number, color: string) {
  const octx = offscreenCanvas.getContext("2d");
  if (!octx) return;

  octx.clearRect(0, 0, size, size);

  const thickness = 180; 
  const strokeRadius = center - thickness / 2; 

  const startAngleDeg = 220;
  const endAngleDeg = 30;
  const fadeDeg = 24;

  const startAngle = startAngleDeg * (Math.PI / 180);
  const endAngle = endAngleDeg * (Math.PI / 180);

  const rgb = hexToRgb(color);
  
  function adjustColor(rgb: {r: number, g: number, b: number}, amount: number) {
    return {
      r: Math.max(0, Math.min(255, rgb.r + amount)),
      g: Math.max(0, Math.min(255, rgb.g + amount)),
      b: Math.max(0, Math.min(255, rgb.b + amount)),
    };
  }
  const lightRgb = adjustColor(rgb, 40);
  const darkRgb = adjustColor(rgb, -40);

  const colorGrad = octx.createLinearGradient(0, 0, size, size);
  colorGrad.addColorStop(0, `rgb(${lightRgb.r},${lightRgb.g},${lightRgb.b})`);
  colorGrad.addColorStop(1, `rgb(${darkRgb.r},${darkRgb.g},${darkRgb.b})`);

  octx.save();
  octx.beginPath();
  octx.arc(center, center, strokeRadius, startAngle, endAngle, true);
  octx.lineWidth = thickness;
  octx.strokeStyle = colorGrad;
  octx.lineCap = "butt";
  
  octx.shadowColor = "rgba(0, 0, 0, 0.5)";
  octx.shadowBlur = 25;
  octx.shadowOffsetX = 5;
  octx.shadowOffsetY = 5;
  
  octx.stroke();
  octx.restore();

  // THE FIX: Switch to Eraser Mode
  octx.globalCompositeOperation = "destination-out";
  
  // ==========================================
  // ERASER 1: Left Tip
  // ==========================================
  const lx1 = center + strokeRadius * Math.cos((startAngleDeg - fadeDeg) * (Math.PI/180));
  const ly1 = center + strokeRadius * Math.sin((startAngleDeg - fadeDeg) * (Math.PI/180));
  const lx2 = center + strokeRadius * Math.cos(startAngleDeg * (Math.PI/180));
  const ly2 = center + strokeRadius * Math.sin(startAngleDeg * (Math.PI/180));

  const leftEraser = octx.createLinearGradient(lx1, ly1, lx2, ly2);
  leftEraser.addColorStop(0, "rgba(0,0,0,0)"); 
  leftEraser.addColorStop(1, "rgba(0,0,0,1)"); 

  octx.beginPath();
  octx.arc(
    center, 
    center, 
    strokeRadius, 
    (startAngleDeg + 5) * (Math.PI/180), 
    (startAngleDeg - fadeDeg - 5) * (Math.PI/180), 
    true
  );
  octx.lineWidth = thickness + 100; // +100px to erase the drop shadow too
  octx.strokeStyle = leftEraser;
  octx.stroke();

  // ==========================================
  // ERASER 2: Right Tip
  // ==========================================
  const rx1 = center + strokeRadius * Math.cos((endAngleDeg + fadeDeg) * (Math.PI/180));
  const ry1 = center + strokeRadius * Math.sin((endAngleDeg + fadeDeg) * (Math.PI/180));
  const rx2 = center + strokeRadius * Math.cos(endAngleDeg * (Math.PI/180));
  const ry2 = center + strokeRadius * Math.sin(endAngleDeg * (Math.PI/180));

  const rightEraser = octx.createLinearGradient(rx1, ry1, rx2, ry2);
  rightEraser.addColorStop(0, "rgba(0,0,0,0)"); 
  rightEraser.addColorStop(1, "rgba(0,0,0,1)"); 

  octx.beginPath();
  octx.arc(
    center, 
    center, 
    strokeRadius, 
    (endAngleDeg + fadeDeg + 5) * (Math.PI/180), 
    (endAngleDeg - 5) * (Math.PI/180), 
    true
  );
  octx.lineWidth = thickness + 100;
  octx.strokeStyle = rightEraser;
  octx.stroke();

  octx.globalCompositeOperation = "source-over";
  ctx.drawImage(offscreenCanvas, 0, 0);

  return {
    bannerRadius: strokeRadius,
    bannerThickness: thickness
  };
}

function drawCurvedText(ctx: CanvasRenderingContext2D, text: string, center: number, bannerThickness: number, bannerRadius: number) {
  const txt = text.trim().toUpperCase();
  if (!txt) return;

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lenScale = Math.max(0.5, 1 - Math.max(0, txt.length - 7) * 0.05);
  const fontSize = bannerThickness * 0.55 * lenScale;

  ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.translate(center, center);

  const spacingAngle = 4.0 / bannerRadius; 
  const charAngles = [];
  let totalAngle = 0;

  for (let i = 0; i < txt.length; i++) {
    const charWidth = ctx.measureText(txt[i]).width;
    const charAngle = charWidth / bannerRadius;
    charAngles.push(charAngle);
    totalAngle += charAngle;
  }
  totalAngle += spacingAngle * (txt.length - 1);

  // Position exakt ausgerichtet
  const centerPolarAngle = (135 * Math.PI) / 180;
  let currentPolarAngle = centerPolarAngle + totalAngle / 2;

  for (let i = 0; i < txt.length; i++) {
    const halfCharAngle = charAngles[i] / 2;
    currentPolarAngle -= halfCharAngle;

    ctx.save();
    ctx.rotate(currentPolarAngle - Math.PI / 2);
    
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(txt[i], 0, bannerRadius);
    ctx.restore();

    currentPolarAngle -= halfCharAngle + spacingAngle;
  }
  ctx.restore();
}

// --- Hauptkomponente ---

export default function App() {
  const [lang, setLang] = useState<"en" | "de">("en");
  const t = TRANSLATIONS[lang];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("#WORKSONMYMCHN");
  const [color, setColor] = useState("#0d9488");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // UI States
  const [isDragOver, setIsDragOver] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  const lastPanPoint = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  // Render Engine
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!offscreenCanvasRef.current && typeof document !== "undefined") {
      offscreenCanvasRef.current = document.createElement("canvas");
    }
    const offscreenCanvas = offscreenCanvasRef.current!;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    const center = size / 2;

    // 1. Basis & Foto
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.clip();

    if (image) {
      const baseScale = Math.max(size / image.width, size / image.height);
      const finalScale = baseScale * scale;
      const cx = center + offset.x;
      const cy = center + offset.y;
      const ox = cx - (image.width / 2) * finalScale;
      const oy = cy - (image.height / 2) * finalScale;
      ctx.drawImage(image, ox, oy, image.width * finalScale, image.height * finalScale);
    } else {
      const gradient = ctx.createRadialGradient(center, center * 0.8, 0, center, center, center);
      gradient.addColorStop(0, "#1e293b");
      gradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(center, center * 0.75, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(center, center * 1.6, size * 0.3, 0, Math.PI, true);
      ctx.fill();
    }
    ctx.restore();

    // 2. Banner
    const hexColor = isValidHexColor(color) ? color : "#dc2626";
    const bannerMetrics = drawBannerArc(ctx, offscreenCanvas, size, center, hexColor);
    
    // 3. Text
    if (bannerMetrics) {
      drawCurvedText(ctx, text, center, bannerMetrics.bannerThickness, bannerMetrics.bannerRadius);
    }
    
    setPreviewUrl(canvas.toDataURL("image/png"));
  }, [color, image, text, scale, offset]);

  useEffect(() => {
    draw();
  }, [draw]);

  // --- Interaction Handler ---
  function loadFile(file: File | null | undefined) {
    if (!isImageFile(file)) return;
    const reader = new FileReader();
    reader.onerror = () => console.error("Datei konnte nicht gelesen werden.");
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== "string") return;

      const img = new Image();
      img.onload = () => {
        setImage(img);
        setScale(1);
        setOffset({ x: 0, y: 0 });
      };
      img.onerror = () => console.error("Bild konnte nicht geladen werden.");
      img.src = result;
    };
    reader.readAsDataURL(file!);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    loadFile(event.target.files?.[0]);
    if (event.target) event.target.value = "";
  }

  function handleDragOver(e: React.DragEvent) { e.preventDefault(); setIsDragOver(true); }
  function handleDragLeave() { setIsDragOver(false); }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    loadFile(e.dataTransfer.files?.[0]);
  }

  function handlePanStart(e: React.MouseEvent | React.TouchEvent) {
    if (!image) return;
    setIsPanning(true);
    hasMoved.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPanPoint.current = { x: clientX, y: clientY };
  }

  function handlePanMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isPanning || !image) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - lastPanPoint.current.x;
    const dy = clientY - lastPanPoint.current.y;
    
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved.current = true;

    const rect = canvasRef.current!.getBoundingClientRect();
    const displayScale = 1000 / rect.width;

    setOffset(prev => ({ x: prev.x + dx * displayScale, y: prev.y + dy * displayScale }));
    lastPanPoint.current = { x: clientX, y: clientY };
  }

  function handlePanEnd() {
    setIsPanning(false);
  }

  function handleCanvasClick() {
    if (hasMoved.current || image) return; 
    fileInputRef.current?.click();
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const filename = text.replace(/[^a-z0-9]/gi, "").toLowerCase() || "badge";
      const link = document.createElement("a");
      link.download = `profile-${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("PNG-Generierung fehlgeschlagen.", error);
    }
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not generate image blob");
      
      const filename = text.replace(/[^a-z0-9]/gi, "").toLowerCase() || "badge";
      const file = new File([blob], `profile-${filename}.png`, { type: "image/png" });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: t.shareTitle,
          text: t.shareText(text),
          files: [file]
        });
      } else {
        alert(t.shareError);
      }
    } catch (error) {
      console.error("Sharing failed.", error);
    }
  }

  const currentPreset = PRESETS.find(p => p.text === text) || {
    label: text, 
    text: text, 
    color: color, 
    humorText: { en: t.customHumor, de: t.customHumor }, 
    descriptionText: { en: t.customDesc(text), de: t.customDesc(text) },
    image: ""
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 flex flex-col items-center p-4 md:p-8 font-sans relative">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 flex gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/50 z-10">
        <button 
          onClick={() => setLang("en")} 
          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${lang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLang("de")} 
          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${lang === "de" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
        >
          DE
        </button>
      </div>

      <div className="w-full max-w-md space-y-8 mt-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
            <Terminal className="text-blue-500" /> {t.title} <span style={{ color: isValidHexColor(color) ? color : "#dc2626" }}>{t.generator}</span>
          </h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>

        {/* Canvas Area */}
        <div 
          className={`relative group rounded-full overflow-hidden aspect-square mx-auto w-[280px] sm:w-[320px] transition-all duration-200 ${
            isDragOver ? "ring-4 ring-blue-500 scale-105" : "ring-1 ring-slate-800 shadow-2xl"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onTouchStart={handlePanStart}
          onTouchMove={handlePanMove}
          onTouchEnd={handlePanEnd}
          onClick={handleCanvasClick}
          style={{ touchAction: image ? "none" : "auto" }}
        >
          <canvas
            ref={canvasRef}
            className={`w-full h-full ${image ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'}`}
            style={{ width: '100%', height: '100%' }}
          />
          
          {!image && (
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
               <span className="text-slate-300 font-medium tracking-wide drop-shadow-md">{t.clickForPhoto}</span>
             </div>
          )}
        </div>

        {image && (
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 space-y-4">
            <div className="flex items-center text-xs text-slate-400">
              <Move size={14} className="mr-1.5" /> 
              {t.dragToMove}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><ZoomIn size={14}/> {t.zoom}</span>
                <span>{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Settings */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {t.presets}
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => {
                const isActive = preset.text === text && preset.color.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={preset.label}
                    onClick={() => { setText(preset.text); setColor(preset.color); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive ? "bg-slate-700 text-white ring-1" : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
                    }`}
                    style={{ ringColor: isActive ? preset.color : "transparent" }}
                  >
                    <span className="mr-1.5 inline-block w-2 h-2 rounded-full" style={{ backgroundColor: preset.color }} />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {t.customText}
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="#CUSTOM"
                maxLength={18}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{t.color}</label>
              <div className="relative h-[38px] w-[50px] rounded-lg overflow-hidden border border-slate-700">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-[-10px] w-[70px] h-[60px] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={18} /> {t.btnChoose}
          </button>
          <button
            onClick={handleDownload}
            disabled={!image && text === ""}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download size={18} /> {t.btnExport}
          </button>
          <button
            onClick={handleShare}
            disabled={!image && text === ""}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={18} /> {t.btnShare}
          </button>
        </div>

        {/* Realistic LinkedIn Preview */}
        <div className="pt-8 border-t border-slate-800">
          <div className="bg-[#1d2226] rounded-xl p-4 sm:p-6 border border-slate-700/50 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center shadow-xl">
            {previewUrl && (
              <img src={previewUrl} alt="Profile Preview" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md shrink-0" />
            )}
            <div className="flex-1 space-y-3">
              <p className="text-[#e9e9df] text-sm sm:text-base leading-snug">
                <span className="font-semibold block mb-1">{currentPreset.humorText[lang]}</span>
                {currentPreset.descriptionText[lang]}
              </p>
              <button className="px-4 py-1.5 rounded-full border border-[#e9e9df] text-[#e9e9df] font-semibold text-sm hover:bg-slate-800 transition-colors">
                {t.getStarted}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
