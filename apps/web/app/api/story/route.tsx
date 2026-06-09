import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Sunder Journal";
    const category = searchParams.get("category") || "Journey";
    const location = searchParams.get("location") || "Planet Earth";
    const readTime = searchParams.get("readTime") || "5 min read";
    const image = searchParams.get("image") || "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2670&auto=format&fit=crop";
    const slug = searchParams.get("slug") || "";
    
    const url = `https://sunder.dev/journal/atlas?category=${encodeURIComponent(category)}&post=${slug}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

    let Template;

    // --- TEMPLATE 1: REFLECTION ---
    if (category.toLowerCase() === "reflections" || category.toLowerCase() === "thoughts") {
      Template = (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#0b0d0f", color: "#f5f5f5", padding: "80px", justifyContent: "space-between", backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
          {/* Overlay */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", backgroundColor: "rgba(11, 13, 15, 0.85)" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontFamily: "Inter", fontSize: 28, letterSpacing: "0.2em", color: "#FFD700", textTransform: "uppercase" }}>{category}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <h1 style={{ fontFamily: "Cormorant", fontSize: 110, lineHeight: 1.1, color: "#fff", margin: 0 }}>
              "{title}"
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: 32, color: "#a5a5a5", letterSpacing: "0.1em" }}>
              From: {location}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255, 215, 0, 0.2)", paddingTop: "60px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontFamily: "Inter", fontSize: 36, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>Sunder Journal</span>
              <span style={{ fontFamily: "Inter", fontSize: 24, color: "#888", letterSpacing: "0.1em" }}>Journey • Reflection • Exploration</span>
            </div>
            <div style={{ display: "flex", backgroundColor: "#fff", padding: "16px", borderRadius: "16px", width: "150px", height: "150px", backgroundImage: `url(${qrCodeUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
        </div>
      );
    } 
    // --- TEMPLATE 2: CURRENT AFFAIRS ---
    else if (category.toLowerCase() === "current affairs" || category.toLowerCase() === "projects") {
      Template = (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F5F3EE", color: "#111111", padding: "80px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", width: "100%", borderBottom: "2px solid #111", paddingBottom: "40px" }}>
            <span style={{ fontFamily: "Inter", fontSize: 28, letterSpacing: "0.2em", color: "#8C6A4A", textTransform: "uppercase" }}>Research Note / {category}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <h1 style={{ fontFamily: "Cormorant", fontSize: 120, lineHeight: 1, color: "#111", margin: 0, textTransform: "uppercase" }}>
              {title}
            </h1>
            <div style={{ display: "flex", gap: "40px" }}>
              <p style={{ fontFamily: "Inter", fontSize: 32, color: "#666", letterSpacing: "0.1em" }}>My Analysis</p>
              <p style={{ fontFamily: "Inter", fontSize: 32, color: "#666", letterSpacing: "0.1em" }}>⏱ {readTime}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #111", paddingTop: "60px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontFamily: "Inter", fontSize: 36, letterSpacing: "0.1em", color: "#111", textTransform: "uppercase" }}>Sunder Journal</span>
              <span style={{ fontFamily: "Inter", fontSize: 24, color: "#666", letterSpacing: "0.1em" }}>Read Full Journal →</span>
            </div>
            <div style={{ display: "flex", backgroundColor: "#fff", padding: "16px", border: "2px solid #111", borderRadius: "16px", width: "150px", height: "150px", backgroundImage: `url(${qrCodeUrl}&color=111111)`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
        </div>
      );
    }
    // --- TEMPLATE 3: TRAVEL / DEFAULT ---
    else {
      Template = (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#000", position: "relative", backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          
          {/* Solid Overlay */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", backgroundColor: "rgba(0,0,0,0.5)" }} />

          <div style={{ display: "flex", width: "100%", padding: "80px", justifyContent: "space-between", zIndex: 10 }}>
            <span style={{ fontSize: 28, letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase", backgroundColor: "rgba(0,0,0,0.5)", padding: "12px 24px", borderRadius: "30px" }}>
              {location}
            </span>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em" }}>
              48°51'N 2°21'E
            </span>
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          <div style={{ display: "flex", flexDirection: "column", padding: "80px", gap: "40px", zIndex: 10 }}>
            <h1 style={{ fontSize: 130, lineHeight: 1.0, color: "#fff", margin: 0 }}>
              {title}
            </h1>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: "60px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: 36, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>Sunder Journal</span>
                <span style={{ fontSize: 24, color: "#aaa", letterSpacing: "0.1em" }}>Journey • Reflection • Exploration</span>
              </div>
              <div style={{ display: "flex", backgroundColor: "#fff", padding: "16px", borderRadius: "16px", width: "150px", height: "150px", backgroundImage: `url(${qrCodeUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </div>
          </div>
        </div>
      );
    }

    return new ImageResponse(Template, {
      width: 1080,
      height: 1920,
    });
  } catch (e: any) {
    return new Response(`Failed to generate story image: ${e.message}`, { status: 500 });
  }
}
