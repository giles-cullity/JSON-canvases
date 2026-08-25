import { JSONCanvasViewer, parser } from "json-canvas-viewer";
import './style.css'

function applyOverlayTheme() {
  document.querySelectorAll(".JCV-overlay-container").forEach((el) => {
    el.style.setProperty("--overlay-text", "rgb(225, 225, 225)");
    el.style.setProperty("--overlay-card", "rgb(43, 43, 43)");
    el.style.setProperty("--overlay-border", "rgba(255, 255, 255, 0.12)");
    el.style.setProperty("--overlay-background", "rgba(255, 255, 255, 0.03)");
  });
}

function watchOverlayTheme() {
  const target = document.getElementById("app");

  const observer = new MutationObserver(() => {
    requestAnimationFrame(() => {
      applyOverlayTheme();
    });
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });
}

const root = document.getElementById("app");
root.innerHTML = `<div style="color:white;padding:1rem;">main.js loaded</div>`;

try {
  const params = new URLSearchParams(window.location.search);
  const canvasName = params.get("canvas") || "constraint-template-reasoning";

  const resp = await fetch(`/canvases/${canvasName}.json`);

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch ${canvasName}.json: ${resp.status} ${resp.statusText}`
    );
  }

  const canvasData = await resp.json();
  console.log("canvasData:", canvasData);
  console.log("nodes:", canvasData.nodes?.length, "edges:", canvasData.edges?.length);

  root.innerHTML = `<div style="color:white;padding:1rem;">JSON loaded. Initializing viewer...</div>`;

const viewer = new JSONCanvasViewer(
  root,
  ['minimap', 'mistouchPrevention'],
  ['proControlSchema']
);
viewer.loadCanvas(canvasData);

requestAnimationFrame(() => {
  applyOverlayTheme();
  watchOverlayTheme();
});

  console.log("viewer initialized");
} catch (err) {
  console.error("FAILED:", err);
  root.innerHTML = `<pre style="color:#ff8a8a;padding:1rem;white-space:pre-wrap;">${String(err)}</pre>`;
}
