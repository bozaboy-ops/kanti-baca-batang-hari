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
  if (slug === "aek-meliuk") {
    return `<g opacity="0.9"><path d="M0 430 q200 -50 400 -10 t400 -20 v170 h-800 z" fill="#74c0fc" opacity="0.8"/><rect x="120" y="330" width="120" height="14" rx="6" fill="#8a5a2b"/><rect x="130" y="344" width="10" height="36" fill="#6f4518"/><rect x="220" y="344" width="10" height="36" fill="#6f4518"/><circle cx="620" cy="300" r="58" fill="${palette.land}"/><rect x="614" y="330" width="12" height="120" fill="#6f4518"/></g><rect x="0" y="470" width="800" height="130" fill="${palette.land}"/>`;
  }
  if (slug === "danau-letang") {
    return `<g opacity="0.9"><ellipse cx="400" cy="450" rx="360" ry="95" fill="#74c0fc" opacity="0.85"/><ellipse cx="400" cy="440" rx="300" ry="70" fill="#a5d8ff" opacity="0.7"/><circle cx="130" cy="260" r="52" fill="${palette.land}"/><rect x="124" y="285" width="12" height="120" fill="#6f4518"/><circle cx="680" cy="280" r="44" fill="${palette.land}"/></g><rect x="0" y="500" width="800" height="100" fill="${palette.land}"/>`;
  }
  if (slug === "pasar-terusan") {
    return `<g opacity="0.9"><rect x="0" y="400" width="800" height="200" fill="#4dabf7" opacity="0.7"/><rect x="90" y="300" width="200" height="90" fill="#dda15e"/><path d="M80 300 l110 -55 110 55 z" fill="#bc4749"/><rect x="520" y="310" width="180" height="80" fill="#e9c46a"/><path d="M510 310 l100 -50 100 50 z" fill="#606c38"/><rect x="330" y="360" width="90" height="26" rx="6" fill="#8a5a2b"/></g><rect x="0" y="480" width="800" height="120" fill="${palette.land}"/>`;
  }
  if (slug === "sawah-pemayung") {
    return `<g opacity="0.9"><path d="M0 360 h800 v60 h-800 z" fill="#a9d97c"/><path d="M0 420 h800 v50 h-800 z" fill="#8ec96a"/><path d="M0 470 h800 v130 h-800 z" fill="${palette.land}"/><g stroke="#588157" stroke-width="5" stroke-linecap="round"><path d="M120 500 v-38M150 500 v-44M640 505 v-38M670 505 v-44M400 510 v-40"/></g><rect x="600" y="300" width="90" height="60" fill="#b08968"/><path d="M595 300 l50 -34 50 34 z" fill="#8a5a2b"/></g>`;
  }
  if (slug === "bajubang") {
    return `<g opacity="0.9"><path d="M330 470 v-150 l70 -70 70 70 v150" stroke="#5f4128" stroke-width="14" fill="none"/><path d="M400 250 v220" stroke="#5f4128" stroke-width="10"/><circle cx="400" cy="470" r="26" fill="#606c38"/><rect x="120" y="360" width="16" height="110" fill="#6f4518"/><circle cx="128" cy="345" r="48" fill="${palette.land}"/><rect x="640" y="370" width="16" height="100" fill="#6f4518"/><circle cx="648" cy="355" r="42" fill="${palette.land}"/></g><rect x="0" y="470" width="800" height="130" fill="${palette.land}"/>`;
  }
  if (slug === "mersam") {
    return `<g opacity="0.9"><rect x="0" y="430" width="800" height="170" fill="#74c0fc" opacity="0.65"/><rect x="180" y="240" width="22" height="200" fill="#6f4518"/><circle cx="191" cy="215" r="88" fill="${palette.land}"/><circle cx="330" cy="300" r="26" fill="#bc6c25"/><circle cx="95" cy="330" r="22" fill="#bc6c25"/><circle cx="560" cy="290" r="24" fill="#bc6c25"/><rect x="580" y="250" width="18" height="190" fill="#6f4518"/><circle cx="589" cy="230" r="64" fill="${palette.land}"/></g><rect x="0" y="490" width="800" height="110" fill="${palette.land}"/>`;
  }
  if (slug === "maro-sebo-ulu") {
    return `<g opacity="0.9"><path d="M0 470 q260 -90 520 -30 l280 30 v130 h-800 z" fill="#a5d8ff" opacity="0.85"/><path d="M0 300 q180 -70 330 -20 l-40 190 h-290 z" fill="${palette.land}" opacity="0.75"/><path d="M800 290 q-180 -60 -320 -10 l40 190 h280 z" fill="${palette.land}"/><rect x="560" y="330" width="90" height="55" fill="#b08968"/><path d="M555 330 l50 -30 50 30 z" fill="#8a5a2b"/></g>`;
  }
  if (slug === "maro-sebo-ilir") {
    return `<g opacity="0.9"><ellipse cx="400" cy="470" rx="370" ry="90" fill="#a5d8ff" opacity="0.8"/><g stroke="#588157" stroke-width="6" stroke-linecap="round"><path d="M110 500 v-70M140 505 v-55M660 500 v-70M690 505 v-55"/></g><circle cx="300" cy="455" r="20" fill="#f4a6b7"/><circle cx="520" cy="465" r="17" fill="#f4a6b7"/><rect x="90" y="270" width="110" height="80" fill="#dda15e"/><rect x="112" y="350" width="12" height="90" fill="#6f4518"/><rect x="166" y="350" width="12" height="90" fill="#6f4518"/><path d="M82 270 l63 -38 63 38 z" fill="#8a5a2b"/></g><rect x="0" y="520" width="800" height="80" fill="${palette.land}"/>`;
  }
  if (slug === "batin-xxiv") {
    return `<g opacity="0.9"><g fill="#6f4518"><rect x="120" y="270" width="16" height="200"/><rect x="270" y="260" width="16" height="210"/><rect x="420" y="270" width="16" height="200"/><rect x="570" y="260" width="16" height="210"/><rect x="700" y="275" width="14" height="195"/></g><g fill="${palette.land}"><circle cx="128" cy="245" r="58"/><circle cx="278" cy="235" r="62"/><circle cx="428" cy="245" r="58"/><circle cx="578" cy="235" r="62"/><circle cx="707" cy="250" r="52"/></g><g fill="#ffffff"><ellipse cx="150" cy="400" rx="16" ry="11"/><ellipse cx="300" cy="410" rx="16" ry="11"/><ellipse cx="450" cy="400" rx="16" ry="11"/><ellipse cx="600" cy="410" rx="16" ry="11"/></g></g><rect x="0" y="470" width="800" height="130" fill="${palette.land}"/>`;
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