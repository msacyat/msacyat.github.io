import { useEffect, useMemo, useRef, useState } from "react";
import { aboutCard, categories, projects } from "./data/projects";

const defaultProject = projects[2];
const restMouse = { x: -9999, y: -9999 };
const profileNode = {
  id: "about",
  size: 236,
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
  for (let iteration = 0; iteration < 4; iteration += 1) {
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
          const push = overlap * 0.3;

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
        transform: `translate(-50%, -50%) scale(${bubble.scale})`,
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
        {item.logo ? (
          <span className="flex h-[74%] w-[74%] items-center justify-center overflow-hidden rounded-full bg-white/10 shadow-[0_8px_18px_rgba(15,23,42,0.22)]">
            <img
              src={`${import.meta.env.BASE_URL}${item.logo}`}
              alt={item.title}
              className="h-full w-full rounded-full object-cover"
            />
          </span>
        ) : (
          <span className="px-2 text-center text-sm font-bold tracking-[-0.03em] text-white drop-shadow-md">
            {item.shortTitle}
          </span>
        )}
        <span className="pointer-events-none absolute -bottom-10 left-1/2 w-max -translate-x-1/2 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white/90 opacity-0 shadow-lg backdrop-blur-md transition duration-300 group-hover:-bottom-4 group-hover:opacity-100 group-focus-visible:-bottom-4 group-focus-visible:opacity-100">
          {item.title}
        </span>
      </div>
    </button>
  );
}

function ProfileBubble({ bubble, onSelect, active, hovered, onHover, onLeave }) {
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
        transform: `translate(-50%, -50%) scale(${bubble.scale})`,
      }}
      aria-label="Open profile summary"
    >
      <span className="absolute inset-3 rounded-full border border-white/35" />
      <img
        src={`${import.meta.env.BASE_URL}headshot_chris.jpg`}
        alt="Portrait of Megan Sacyat"
        className="h-full w-full scale-125 object-cover"
      />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-slate-950/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md">
        Megan
      </span>
    </button>
  );
}

function ProjectModal({ item, onClose }) {
  const gallery = item.gallery?.length
    ? item.gallery
    : ["placeholder-slide-1.jpg", "placeholder-slide-2.jpg", "placeholder-slide-3.jpg"];
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [item.id]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/76 backdrop-blur-xl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 h-full w-full overflow-y-auto animate-[modal-in_280ms_ease-out]">
        <div className="min-h-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-[1420px] items-center">
            <div className="relative w-full rounded-[2.2rem] border border-white/14 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-5 shadow-[0_40px_120px_rgba(8,15,30,0.48)] backdrop-blur-2xl sm:p-6 lg:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full border border-white/15 bg-slate-950/35 text-base text-white/80 transition hover:bg-slate-950/55"
                aria-label="Close project details"
              >
                ×
              </button>

              <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr] xl:items-start">
                <div className="rounded-[1.7rem] border border-white/15 bg-white/8 p-3 shadow-glow backdrop-blur-xl sm:p-4">
                  <div className="relative overflow-hidden rounded-[1.35rem]">
                    <img
                      src={`${import.meta.env.BASE_URL}${gallery[slideIndex]}`}
                      alt={`${item.title} slide ${slideIndex + 1}`}
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,20,0.06),rgba(5,10,20,0.3))]" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/78 backdrop-blur-md">
                      {item.eyebrow || item.category}
                    </div>

                    {gallery.length > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setSlideIndex((current) =>
                              current === 0 ? gallery.length - 1 : current - 1,
                            )
                          }
                          className="absolute left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-white/15 bg-slate-950/45 text-2xl text-white/80 backdrop-blur-md transition hover:bg-slate-950/60"
                          aria-label="Previous slide"
                        >
                          &#8249;
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSlideIndex((current) =>
                              current === gallery.length - 1 ? 0 : current + 1,
                            )
                          }
                          className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-white/15 bg-slate-950/45 text-2xl text-white/80 backdrop-blur-md transition hover:bg-slate-950/60"
                          aria-label="Next slide"
                        >
                          &#8250;
                        </button>
                      </>
                    ) : null}
                  </div>

                  {gallery.length > 1 ? (
                    <div className="mt-3 flex justify-center gap-2">
                      {gallery.map((slide, index) => (
                        <button
                          key={slide}
                          type="button"
                          onClick={() => setSlideIndex(index)}
                          className={classNames(
                            "h-2.5 rounded-full transition",
                            index === slideIndex ? "w-9 bg-white" : "w-2.5 bg-white/35",
                          )}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4 lg:space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
                      {item.eyebrow || item.category}
                    </p>
                    <h2 className="mt-2 pr-10 text-3xl font-black tracking-[-0.05em] text-white sm:text-[2.7rem]">
                      {item.title}
                    </h2>
                  </div>

                  <div className="grid gap-3 text-sm text-white/82 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/20 p-4">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/45">
                        Role
                      </p>
                      <p className="mt-2 text-base font-medium text-white">{item.role}</p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/20 p-4">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/45">
                        Tools
                      </p>
                      <p className="mt-2 text-base font-medium text-white">
                        {item.tools.join(" / ")}
                      </p>
                    </div>
                  </div>

                  <p className="max-w-xl text-sm leading-7 text-white/84 sm:text-[1rem]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(defaultProject);
  const [openProject, setOpenProject] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [bubbleStates, setBubbleStates] = useState([]);

  const fieldRef = useRef(null);
  const animationRef = useRef(0);
  const mouseRef = useRef(restMouse);
  const bubblePhysicsRef = useRef([]);
  const hoveredIdRef = useRef(null);
  const selectedIdRef = useRef(defaultProject.id);
  const interactingRef = useRef(false);

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
      setOpenProject(null);
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
        const isInteracting = interactingRef.current;

        if (isInteracting && mouseDistance < 180 && mouseDistance > 0.001) {
          const cursorInfluence = (1 - mouseDistance / 180) ** 2;
          const pullStrength =
            item.id === "about"
              ? 0.00015
              : hoverLocked
                ? 0.00012
                : 0.00035;

          bubble.vx += (mouseDx / mouseDistance) * cursorInfluence * pullStrength * 10;
          bubble.vy += (mouseDy / mouseDistance) * cursorInfluence * pullStrength * 10;
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

          bubble.vx += (centerDx / centerDistance) * clingOffset * 0.009;
          bubble.vy += (centerDy / centerDistance) * clingOffset * 0.009;
        }

        bubble.vx += (bubble.targetX - bubble.x) * 0.004;
        bubble.vy += (bubble.targetY - bubble.y) * 0.004;
        bubble.vx *= 0.92;
        bubble.vy *= 0.92;

        if (!isInteracting && Math.abs(bubble.vx) < 0.05) {
          bubble.vx = 0;
        }
        if (!isInteracting && Math.abs(bubble.vy) < 0.05) {
          bubble.vy = 0;
        }

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
    interactingRef.current = true;
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function handlePointerLeave() {
    interactingRef.current = false;
    mouseRef.current = restMouse;
    setHoveredId(null);
  }

  function handleSelectProject(item) {
    setSelectedProject(item);
    setOpenProject(item);
  }

  const bubbleMap = new Map(bubbleStates.map((bubble) => [bubble.id, bubble]));
  const profileBubble = bubbleMap.get("about");

  return (
    <div className="min-h-screen bg-hero-grid text-mist">
      <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <section className="overflow-hidden rounded-[2.4rem] border border-white/12 bg-white/[0.03] shadow-glow">
          <div className="min-h-[calc(100svh-2rem)] px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-[2.85rem]">
                Megan Sacyat
              </h1>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/62 sm:text-base">
                Marketing • Events • Operations
              </p>
              <p className="mt-2 text-sm text-white/72 sm:text-base">
                Interactive portfolio — click a project to explore
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
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
              className="relative mt-4 min-h-[520px] overflow-hidden rounded-[2.1rem] border border-white/10 bg-slate-950/15 sm:min-h-[560px] lg:min-h-[62svh]"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_70%_10%,rgba(124,199,255,0.18),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(255,177,139,0.16),transparent_26%)]" />
              <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px]" />

              {profileBubble ? (
                <ProfileBubble
                  bubble={profileBubble}
                  onSelect={handleSelectProject}
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
                    onSelect={handleSelectProject}
                  />
                );
              })}

              {openProject ? (
                <ProjectModal item={openProject} onClose={() => setOpenProject(null)} />
              ) : null}

              <div className="pointer-events-none absolute inset-x-5 bottom-5 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/35">
                <span>Hover for title</span>
                <span>Click for details</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
