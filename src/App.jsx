import { useEffect, useMemo, useRef, useState } from "react";
import { aboutCard, categories, projects } from "./data/projects";

const defaultProject = projects[2];
const profileNode = {
  id: "about",
  size: 176,
  x: 50,
  y: 48,
};
const physicsNodes = [profileNode, ...projects];

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function toPixelTarget(item, width, height) {
  return {
    x: (item.x / 100) * width,
    y: (item.y / 100) * height,
  };
}

function resolveCollisions(bubbles, width, height) {
  for (let iteration = 0; iteration < 10; iteration += 1) {
    for (let i = 0; i < bubbles.length; i += 1) {
      for (let j = i + 1; j < bubbles.length; j += 1) {
        const a = bubbles[i];
        const b = bubbles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const minDistance = a.radius * a.scale + b.radius * b.scale + 2;

        if (distance < minDistance) {
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;
          const push = overlap * 0.5;

          a.x -= nx * push;
          a.y -= ny * push;
          b.x += nx * push;
          b.y += ny * push;
        }
      }
    }

    bubbles.forEach((bubble) => {
      const boundary = bubble.radius * bubble.scale + 6;
      bubble.x = Math.max(boundary, Math.min(width - boundary, bubble.x));
      bubble.y = Math.max(boundary, Math.min(height - boundary, bubble.y));
    });
  }
}

function Bubble({
  item,
  bubble,
  hidden,
  isActive,
  isHovered,
  onHover,
  onLeave,
  onSelect,
}) {
  const scaleValue = bubble.scale;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(item.id)}
      onBlur={onLeave}
      className={classNames(
        "group absolute rounded-full border border-white/20 bg-white/10 shadow-glow backdrop-blur-xl transition-[border-color,opacity,box-shadow] duration-300 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80",
        hidden ? "pointer-events-none opacity-15 saturate-50" : "opacity-100",
        isActive ? "z-20 border-white/55" : isHovered ? "z-20 border-white/45" : "z-10",
      )}
      style={{
        left: `${bubble.x}px`,
        top: `${bubble.y}px`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        transform: `translate(-50%, -50%) scale(${scaleValue})`,
      }}
      aria-label={`Open ${item.title}`}
    >
      <div
        className={classNames(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-85",
          item.imageGradient,
        )}
      />
      <div className="absolute inset-[1px] rounded-full bg-white/10" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.42),transparent_28%),radial-gradient(circle_at_75%_74%,rgba(255,255,255,0.08),transparent_36%)]" />

      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
        <span className="px-2 text-center text-sm font-bold tracking-[-0.03em] text-white drop-shadow-md">
          {item.shortTitle}
        </span>
        <span className="pointer-events-none absolute -bottom-10 left-1/2 w-max -translate-x-1/2 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white/90 opacity-0 shadow-lg backdrop-blur-md transition duration-300 group-hover:-bottom-4 group-hover:opacity-100 group-focus-visible:-bottom-4 group-focus-visible:opacity-100">
          {item.title}
        </span>
      </div>
    </button>
  );
}

function ProfileBubble({ bubble, onSelect, active, hovered, onHover, onLeave }) {
  const scaleValue = bubble.scale;

  return (
    <button
      type="button"
      onClick={() => onSelect(aboutCard)}
      onMouseEnter={() => onHover("about")}
      onMouseLeave={onLeave}
      onFocus={() => onHover("about")}
      onBlur={onLeave}
      className={classNames(
        "absolute z-30 overflow-hidden rounded-full border border-white/35 bg-white/10 shadow-glow backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 ease-out",
        active ? "border-white/60" : hovered ? "border-white/50" : "hover:border-white/50",
      )}
      style={{
        left: `${bubble.x}px`,
        top: `${bubble.y}px`,
        width: `${profileNode.size}px`,
        height: `${profileNode.size}px`,
        transform: `translate(-50%, -50%) scale(${scaleValue})`,
      }}
      aria-label="Open profile summary"
    >
      <span className="absolute inset-3 rounded-full border border-white/35" />
      <img
        src="/headshot_chris.jpg"
        alt="Portrait of Megan Sacyat"
        className="h-full w-full object-cover"
      />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-slate-950/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md">
        Megan
      </span>
    </button>
  );
}

function ProjectPreview({ item }) {
  return (
    <div className="rounded-[2rem] border border-white/15 bg-white/8 p-4 shadow-glow backdrop-blur-xl">
      <div
        className={classNames(
          "relative flex aspect-[4/3] items-end overflow-hidden rounded-[1.4rem] bg-gradient-to-br p-5",
          item.imageGradient,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(4,8,18,0.28))]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-900/60">
            {item.eyebrow || item.category}
          </p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">
            {item.imageLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ item }) {
  return (
    <aside className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:p-6">
      <ProjectPreview item={item} />

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
            {item.eyebrow || item.category}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-white sm:text-[2.2rem]">
            {item.title}
          </h2>
        </div>

        <div className="grid gap-3 text-sm text-white/82 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/45">
              Role
            </p>
            <p className="mt-2 text-base font-medium text-white">{item.role}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/45">
              Tools
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {item.tools.join(" / ")}
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-white/84 sm:text-[0.98rem]">
          {item.description}
        </p>
      </div>
    </aside>
  );
}

function ContactCard() {
  return (
    <section
      id="contact"
      className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-glow backdrop-blur-2xl sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
            Contact + Resume
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
            Keep this section simple and recruiter-friendly.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 sm:text-base">
            Update the email, LinkedIn, portfolio resume link, and short note
            below with your real details. The layout is intentionally clean so
            recruiters can quickly find the next step.
          </p>
        </div>

        <div className="grid gap-4 text-sm text-white/84">
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/45">
              Email
            </p>
            <a href="mailto:hello@example.com" className="mt-2 block text-base text-white">
              hello@example.com
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/45">
              LinkedIn
            </p>
            <a href="https://linkedin.com" className="mt-2 block text-base text-white">
              linkedin.com/in/your-name
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Resume PDF
            </a>
            <a
              href="https://vercel.com"
              className="rounded-full border border-white/12 bg-slate-950/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-950/40"
            >
              Deployment guide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(defaultProject);
  const [hoveredId, setHoveredId] = useState(null);
  const [bubbleStates, setBubbleStates] = useState([]);

  const fieldRef = useRef(null);
  const animationRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const bubblePhysicsRef = useRef([]);
  const hoveredIdRef = useRef(null);
  const selectedIdRef = useRef(defaultProject.id);

  const visibleProjects = useMemo(
    () =>
      selectedCategory === "All"
        ? projects
        : projects.filter((project) => project.category === selectedCategory),
    [selectedCategory],
  );

  useEffect(() => {
    if (
      selectedProject.id !== "about" &&
      selectedCategory !== "All" &&
      selectedProject.category !== selectedCategory
    ) {
      setSelectedProject(visibleProjects[0] || aboutCard);
    }
  }, [selectedCategory, selectedProject, visibleProjects]);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    selectedIdRef.current = selectedProject.id;
  }, [selectedProject.id]);

  useEffect(() => {
    function initializeBubbles() {
      const field = fieldRef.current;

      if (!field) {
        return;
      }

      const width = field.clientWidth;
      const height = field.clientHeight;

      bubblePhysicsRef.current = physicsNodes.map((item) => {
        const target = toPixelTarget(item, width, height);

        return {
          id: item.id,
          x: target.x,
          y: target.y,
          vx: 0,
          vy: 0,
          targetX: target.x,
          targetY: target.y,
          radius: item.size / 2,
          scale: 1,
        };
      });

      setBubbleStates(
        bubblePhysicsRef.current.map((bubble) => ({
          id: bubble.id,
          x: bubble.x,
          y: bubble.y,
          scale: bubble.scale,
        })),
      );
    }

    function animate() {
      const field = fieldRef.current;

      if (!field) {
        return;
      }

      const width = field.clientWidth;
      const height = field.clientHeight;
      const bubbles = bubblePhysicsRef.current;
      const profileBubble = bubbles[0];

      physicsNodes.forEach((item, index) => {
        const target = toPixelTarget(item, width, height);
        const bubble = bubbles[index];

        bubble.targetX = target.x;
        bubble.targetY = target.y;
      });

      bubbles.forEach((bubble, index) => {
        const item = physicsNodes[index];
        const mouseDx = mouseRef.current.x - bubble.x;
        const mouseDy = mouseRef.current.y - bubble.y;
        const mouseDistance = Math.hypot(mouseDx, mouseDy);
        const hoverLocked = hoveredIdRef.current === item.id;

        if (mouseDistance < 260 && mouseDistance > 0.001) {
          const cursorInfluence = (1 - mouseDistance / 260) ** 2;
          const pullStrength =
            item.id === "about"
              ? 0.0012
              : hoverLocked
                ? 0.001
                : 0.0026;

          bubble.vx += (mouseDx / mouseDistance) * cursorInfluence * pullStrength * 60;
          bubble.vy += (mouseDy / mouseDistance) * cursorInfluence * pullStrength * 60;
        }

        if (item.id !== "about") {
          const centerDx = profileBubble.x - bubble.x;
          const centerDy = profileBubble.y - bubble.y;
          const centerDistance = Math.hypot(centerDx, centerDy) || 1;
          const desiredDistance =
            profileBubble.radius * profileBubble.scale +
            bubble.radius * bubble.scale +
            2;
          const clingOffset = centerDistance - desiredDistance;

          bubble.vx += (centerDx / centerDistance) * clingOffset * 0.02;
          bubble.vy += (centerDy / centerDistance) * clingOffset * 0.02;
        }

        bubble.vx += (bubble.targetX - bubble.x) * 0.018;
        bubble.vy += (bubble.targetY - bubble.y) * 0.018;
        bubble.vx *= 0.88;
        bubble.vy *= 0.88;
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        const boundary = bubble.radius * bubble.scale + 6;

        if (bubble.x < boundary) {
          bubble.x = boundary;
          bubble.vx *= -0.45;
        }
        if (bubble.x > width - boundary) {
          bubble.x = width - boundary;
          bubble.vx *= -0.45;
        }
        if (bubble.y < boundary) {
          bubble.y = boundary;
          bubble.vy *= -0.45;
        }
        if (bubble.y > height - boundary) {
          bubble.y = height - boundary;
          bubble.vy *= -0.45;
        }

        const hovered = hoveredIdRef.current === item.id;
        const selected = selectedIdRef.current === item.id;
        const targetScale =
          item.id === "about"
            ? selected
              ? 1.04
              : hovered
                ? 1.02
                : 1
            : selected
              ? 1.16
              : hovered
                ? 1.18
                : 1;
        bubble.scale += (targetScale - bubble.scale) * 0.08;
      });

      resolveCollisions(bubbles, width, height);
      setBubbleStates(
        bubbles.map((bubble) => ({
          id: bubble.id,
          x: bubble.x,
          y: bubble.y,
          scale: bubble.scale,
        })),
      );

      animationRef.current = window.requestAnimationFrame(animate);
    }

    initializeBubbles();
    animationRef.current = window.requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => {
      initializeBubbles();
    });

    if (fieldRef.current) {
      resizeObserver.observe(fieldRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationRef.current);
    };
  }, []);

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function handlePointerLeave() {
    mouseRef.current = { x: -9999, y: -9999 };
    setHoveredId(null);
  }

  const bubbleMap = new Map(bubbleStates.map((bubble) => [bubble.id, bubble]));
  const profileBubble = bubbleMap.get("about");

  return (
    <div className="min-h-screen bg-hero-grid text-mist">
      <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <section className="overflow-hidden rounded-[2.4rem] border border-white/12 bg-white/[0.03] shadow-glow">
          <div className="grid min-h-[100svh] gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
            <div className="flex flex-col">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                  Apple Watch inspired portfolio
                </p>
                <h1 className="mt-4 max-w-[10ch] text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl xl:text-7xl">
                  A playful grid for polished work.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
                  Floating project bubbles respond to the cursor, expand on
                  hover, and open details in a frosted-glass panel. The content
                  is driven by one editable data file, so swapping in real work
                  later stays easy.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={classNames(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition",
                      selectedCategory === category
                        ? "border-white/40 bg-white/18 text-white"
                        : "border-white/12 bg-white/6 text-white/72 hover:bg-white/12",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div
                ref={fieldRef}
                className="relative mt-8 min-h-[540px] flex-1 overflow-hidden rounded-[2.1rem] border border-white/10 bg-slate-950/15 sm:min-h-[620px]"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_70%_10%,rgba(124,199,255,0.18),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(255,177,139,0.16),transparent_26%)]" />
                <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px]" />

                {profileBubble ? (
                  <ProfileBubble
                    bubble={profileBubble}
                    onSelect={setSelectedProject}
                    active={selectedProject.id === "about"}
                    hovered={hoveredId === "about"}
                    onHover={setHoveredId}
                    onLeave={() => setHoveredId(null)}
                  />
                ) : null}

                {projects.map((project) => {
                  const bubble = bubbleMap.get(project.id);

                  if (!bubble) {
                    return null;
                  }

                  return (
                    <Bubble
                      key={project.id}
                      item={project}
                      bubble={bubble}
                      isHovered={hoveredId === project.id}
                      onHover={setHoveredId}
                      onLeave={() => setHoveredId(null)}
                      hidden={
                        selectedCategory !== "All" &&
                        project.category !== selectedCategory
                      }
                      isActive={selectedProject.id === project.id}
                      onSelect={setSelectedProject}
                    />
                  );
                })}

                <div className="pointer-events-none absolute inset-x-5 bottom-5 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/35">
                  <span>Hover for title</span>
                  <span>Click for details</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:justify-between">
              <DetailPanel item={selectedProject} />

              <section className="rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-glow backdrop-blur-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                  Quick notes
                </p>
                <div className="mt-4 grid gap-3 text-sm text-white/78 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <p className="font-semibold text-white">Edit project data</p>
                    <p className="mt-2 leading-6">
                      Replace the placeholders in <code>src/data/projects.js</code>.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <p className="font-semibold text-white">Swap the headshot</p>
                    <p className="mt-2 leading-6">
                      Update the image in <code>public/headshot_chris.jpg</code>.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <ContactCard />
        </div>
      </div>
    </div>
  );
}
