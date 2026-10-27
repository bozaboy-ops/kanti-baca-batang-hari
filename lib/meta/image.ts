import { getTheme } from "../content/themes";

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function animalShape(highlight: string, accent: string): string {
  const h = highlight.toLowerCase();
  if (h.includes("gajah")) {
    return `<g opacity="0.95"><ellipse cx="400" cy="390" rx="95" ry="60" fill="#9b9b9b"/><circle cx="490" cy="365" r="42" fill="#a8a8a8"/><ellipse cx="470" cy="360" rx="22" ry="30" fill="#8a8a8a"/><path d="M520 380 q35 30 15 70" stroke="#8a8a8a" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="345" y="430" width="18" height="45" rx="8" fill="#8a8a8a"/><rect x="435" y="430" width="18" height="45" rx="8" fill="#8a8a8a"/></g>`;
  }
  if (h.includes("kura")) {
    return `<g opacity="0.95"><path d="M320 440 a80 55 0 0 1 160 0 z" fill="#6a994e"/><ellipse cx="400" cy="445" rx="85" ry="14" fill="#386641"/><circle cx="490" cy="430" r="20" fill="#a7c957"/><path d="M360 410 q40 -25 80 0" stroke="#386641" stroke-width="6" fill="none"/></g>`;
  }
  if (h.includes("ikan")) {
    return `<g opacity="0.95"><ellipse cx="400" cy="400" rx="75" ry="35" fill="${accent}"/><path d="M470 400 l55 -30 v60 z" fill="${accent}"/><circle cx="360" cy="390" r="7" fill="#ffffff"/></g>`;
  }
  if (h.includes("perahu")) {
    return `<g opacity="0.95"><path d="M300 430 h220 l-35 45 h-150 z" fill="#8a5a2b"/><rect x="405" y="370" width="10" height="60" fill="#6f4518"/><path d="M415 370 l55 45 h-55 z" fill="#ffffff" opacity="0.9"/></g>`;
  }
  if (h.includes("burung")) {
    return `<g opacity="0.95" stroke="${accent}" stroke-width="7" fill="none" stroke-linecap="round"><path d="M340 360 q30 -30 60 0 q30 -30 60 0"/><path d="M390 400 q20 -20 40 0 q20 -20 40 0"/></g>`;
  }
  return `<g opacity="0.9"><circle cx="400" cy="400" r="38" fill="${accent}"/><circle cx="400" cy="355" r="16" fill="${accent}"/><circle cx="400" cy="445" r="16" fill="${accent}"/><circle cx="355" cy="400" r="16" fill="${accent}"/><circle cx="445" cy="400" r="16" fill="${accent}"/><circle cx="400" cy="400" r="14" fill="#fff3b0"/></g>`;
}

function sceneShapes(slug: string, palette: { sky: string; land: string; accent: string }): string {
  if (slug === "sungai-batanghari") {
    return `<rect x="0" y="380" width="800" height="220" fill="#4dabf7" opacity="0.75"/><path d="M0 420 q200 -35 400 0 t400 0 v180 h-800 z" fill="#74c0fc" opacity="0.8"/><path d="M0 380 h800 v30 h-800 z" fill="${palette.land}"/>`;
  }
  if (slug === "hutan-senami") {
    return `<g opacity="0.9"><rect x="90" y="230" width="28" height="220" fill="#6f4518"/><circle cx="104" cy="210" r="85" fill="${palette.land}"/><rect x="660" y="250" width="24" height="200" fill="#6f4518"/><circle cx="672" cy="235" r="70" fill="${palette.land}"/><rect x="560" y="300" width="18" height="150" fill="#6f4518"/><circle cx="569" cy="290" r="52" fill="${palette.land}" opacity="0.85"/></g><rect x="0" y="450" width="800" height="150" fill="${palette.land}"/>`;
  }
  if (slug === "benteng-tembesi") {
    return `<g><rect x="180" y="280" width="440" height="190" fill="#b08968"/><rect x="180" y="250" width="60" height="50" fill="#9c6644"/><rect x="300" y="250" width="60" height="50" fill="#9c6644"/><rect x="420" y="250" width="60" height="50" fill="#9c6644"/><rect x="540" y="250" width="60" height="50" fill="#9c6644"/><rect x="365" y="370" width="70" height="100" rx="30" fill="#5f4128"/></g><rect x="0" y="470" width="800" height="130" fill="${palette.land}"/>`;
  }
  // kuliner-tradisi
  return `<g><rect x="180" y="400" width="440" height="28" rx="8" fill="#8a5a2b"/><rect x="220" y="428" width="18" height="60" fill="#6f4518"/><rect x="562" y="428" width="18" height="60" fill="#6f4518"/><ellipse cx="320" cy="385" rx="65" ry="22" fill="#ffffff"/><ellipse cx="320" cy="378" rx="48" ry="14" fill="${palette.accent}"/><ellipse cx="480" cy="385" rx="65" ry="22" fill="#ffffff"/><ellipse cx="480" cy="378" rx="48" ry="14" fill="#f2cc8f"/></g><rect x="0" y="488" width="800" height="112" fill="${palette.land}"/>`;
}

export function generateIllustrationSvg(themeSlug: string, highlight: string): string {
  const theme = getTheme(themeSlug);
  const safeHighlight = escapeXml(highlight ?? "");
  const { sky, land, accent } = theme.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="${safeHighlight}"><rect x="0" y="0" width="800" height="600" fill="${sky}"/><circle cx="680" cy="95" r="52" fill="#ffd93d" opacity="0.95"/><circle cx="680" cy="95" r="72" fill="#ffd93d" opacity="0.25"/><ellipse cx="150" cy="95" rx="70" ry="24" fill="#ffffff" opacity="0.75"/><ellipse cx="205" cy="85" rx="52" ry="20" fill="#ffffff" opacity="0.65"/><rect x="0" y="470" width="800" height="130" fill="${land}"/>${sceneShapes(themeSlug, theme.palette)}${animalShape(highlight ?? "", accent)}<circle cx="155" cy="415" r="28" fill="#f4a261"/><rect x="128" y="440" width="54" height="62" rx="16" fill="${accent}"/><text x="400" y="555" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="bold" fill="#3d405b">${safeHighlight}</text></svg>`;
}