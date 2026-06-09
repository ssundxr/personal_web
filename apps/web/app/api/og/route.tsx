import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Sunder Journal";
    const category = searchParams.get("category") || "Journey";
    const location = searchParams.get("location") || "Planet Earth";
    const readTime = searchParams.get("readTime") || "5 min read";
    const image = searchParams.get("image") || "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2670&auto=format&fit=crop";


    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0B0D0F",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Dark Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(11, 13, 15, 0.75)",
              display: "flex",
            }}
          />

          {/* Border Frame */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              right: 40,
              bottom: 40,
              border: "1px solid rgba(255, 215, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "60px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span style={{ color: "#FFD700", fontFamily: "Inter", fontSize: 24, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {category}
              </span>
              <span style={{ color: "#a5a5a5", fontFamily: "Inter", fontSize: 24, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Sunder Journal
              </span>
            </div>

            {/* Main Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h1
                style={{
                  fontSize: 90,
                  fontFamily: "Cormorant",
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  maxWidth: "800px",
                }}
              >
                {title}
              </h1>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
              <span style={{ color: "#e5e5e5", fontFamily: "Inter", fontSize: 24, display: "flex", alignItems: "center" }}>
                📍 {location}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#FFD700" }} />
              <span style={{ color: "#a5a5a5", fontFamily: "Inter", fontSize: 24 }}>
                ⏱ {readTime}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
