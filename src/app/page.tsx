import styles from "./page.module.css";
import { HeroCanvasLoader, RingsCanvasLoader, CTACanvasLoader, CursorGlowLoader, MatrixTitleLoader } from "./components/Loaders";
import ScrollReveal from "./components/ScrollReveal";
import CountUp     from "./components/CountUp";
import Ticker      from "./components/Ticker";
import TiltCard    from "./components/TiltCard";

const GITHUB = "https://github.com/AlBDO/AlBDO-v-0.1.0";

const metrics = [
  { value: "0.07 ms", label: "Cached response" },
  { value: "11 MB",   label: "Idle server memory" },
  { value: "0 KB",    label: "Tier A JS payload" },
  { value: "1.4 s",   label: "Cold build time" },
];

const features = [
  { icon: "⬡", title: "Effect Lattice",        desc: "At compile time, ALBDO builds an EffectProfile for every component — analysing hooks, async, I/O, and side effects to determine exactly what JavaScript to ship." },
  { icon: "⚙", title: "Rust-Native Core",       desc: "SWC-powered AST analysis, lock-free parallel component traversal via DashMap, and a zero-JavaScript hot path served by axum + Tokio." },
  { icon: "◈", title: "Zero-Cost Static Pages", desc: "Tier A components produce zero bytes of client JavaScript. No hydration, no bundle, no runtime tax — pure HTML from the server." },
  { icon: "⬡", title: "Selective Hydration",    desc: "Tier B components hydrate only the reactive islands that need it. The rest of the page remains inert, cutting transfer and parse time." },
  { icon: "⟡", title: "No Rewrites Needed",     desc: "ALBDO accepts the JSX and TSX files your team already writes. No new primitives, no framework migration — just point and compile." },
  { icon: "▣", title: "Single Binary Deploy",   desc: "Ship a self-contained Rust binary. Docker images under 30 MB. Compare that to the 300–800 MB of a typical Node.js container." },
];

const tiers = [
  { name: "Tier A", tag: "Static / Pure",    js: "0 KB JS",       desc: "No hooks, no async, no side effects. Ships zero JavaScript to the client.",                           color: "tierA" },
  { name: "Tier B", tag: "Reactive Islands", js: "Minimal JS",    desc: "Selective hydration for reactive regions only. The rest of the page stays static.",                   color: "tierB" },
  { name: "Tier C", tag: "Full Reactive",    js: "Full hydration", desc: "Complex client state. Full hydration where the component truly demands it.",                         color: "tierC" },
];

const comparisons = [
  { label: "JavaScript in hot path",        albedo: "None",     others: "Always"   },
  { label: "Idle memory (single service)",  albedo: "11 MB",    others: "260 MB+"  },
  { label: "Tier A page JS payload",        albedo: "0 KB",     others: "50–400 KB"},
  { label: "Docker image size",             albedo: "< 30 MB",  others: "300–800 MB"},
  { label: "Cached response time",          albedo: "0.07 ms",  others: "5–40 ms"  },
  { label: "50-service baseline RAM",       albedo: "< 600 MB", others: "~13 GB"   },
];

export default function Home() {
  return (
    <div className={styles.root}>
      <CursorGlowLoader />

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>ALBDO</span>
        <div className={styles.navLinks}>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={styles.navGh}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.111-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <HeroCanvasLoader />
        <div className={styles.heroContent}>
          <ScrollReveal delay={0}>
            <div className={styles.heroBadge}>Pre-Release · March 2026</div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className={styles.heroHeadline}>
              <MatrixTitleLoader />
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={220}>
            <p className={styles.heroSub}>
              ALBDO is a Rust-native DOM render compiler and HTTP runtime for JSX&nbsp;/&nbsp;TSX apps.
              It statically analyses every component and ships exactly the right amount of JavaScript —
              including none at all.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={340}>
            <div className={styles.heroCtas}>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={`${styles.ctaPrimary} ${styles.magneticBtn}`}>
                View on GitHub
              </a>
              <a href="#how-it-works" className={`${styles.ctaSecondary} ${styles.magneticBtn}`}>
                How it works ↓
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={440}>
            <p className={styles.heroCredit}>By Bishal Sen &amp; Pinaki Singha</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── METRICS ── */}
      <ScrollReveal direction="fade">
        <section className={styles.metricsBar}>
          {metrics.map((m, i) => (
            <div key={m.label} className={styles.metric} style={{ animationDelay: `${i * 80}ms` }}>
              <CountUp value={m.value} className={styles.metricValue} duration={1400} />
              <span className={styles.metricLabel}>{m.label}</span>
            </div>
          ))}
        </section>
      </ScrollReveal>

      {/* ── HOW IT WORKS / TIERS ── */}
      <section className={styles.section} id="how-it-works">
        <ScrollReveal>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Effect Lattice</p>
            <h2 className={styles.sectionTitle}>Automatic tiering at compile time</h2>
            <p className={styles.sectionSub}>
              ALBDO builds an <code>EffectProfile</code> for every component — hooks, async operations,
              I/O, side effects — and assigns a deterministic rendering tier. No annotations required.
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.tiers}>
          {tiers.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 120}>
              <TiltCard className={`${styles.tierCard} ${styles[t.color]}`}>
                <div className={styles.tierTop}>
                  <span className={styles.tierName}>{t.name}</span>
                  <span className={styles.tierTag}>{t.tag}</span>
                </div>
                <span className={styles.tierJs}>{t.js}</span>
                <p className={styles.tierDesc}>{t.desc}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={`${styles.section} ${styles.sectionWithRings}`}>
        <RingsCanvasLoader />
        <div className={styles.sectionRelative}>
          <ScrollReveal>
            <div className={styles.sectionHead}>
              <p className={styles.eyebrow}>Architecture</p>
              <h2 className={styles.sectionTitle}>Every layer built with intent</h2>
            </div>
          </ScrollReveal>

          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={(i % 3) * 100}>
                <TiltCard className={styles.featureCard} intensity={7}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className={styles.section}>
        <ScrollReveal>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Benchmarks</p>
            <h2 className={styles.sectionTitle}>A different execution model</h2>
            <p className={styles.sectionSub}>Measured on a working pre-release build. Not projections.</p>
          </div>
        </ScrollReveal>

        <div className={styles.compTable}>
          <div className={styles.compHeader}>
            <span />
            <span className={styles.compColAlbedo}>ALBDO</span>
            <span className={styles.compColOther}>Node.js / Next.js</span>
          </div>
          {comparisons.map((row, i) => (
            <ScrollReveal key={row.label} delay={i * 70} direction={i % 2 === 0 ? "left" : "right"}>
              <div className={styles.compRow}>
                <span className={styles.compLabel}>{row.label}</span>
                <span className={styles.compAlbedo}>{row.albedo}</span>
                <span className={styles.compOther}>{row.others}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={`${styles.ctaBanner} ${styles.ctaBannerRelative}`}>
        <CTACanvasLoader />
        <div className={styles.ctaBannerContent}>
          <ScrollReveal>
            <h2 className={styles.ctaBannerTitle}>Ready to see it in action?</h2>
            <p className={styles.ctaBannerSub}>Explore the pre-release source, star the repo, or open an issue.</p>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
              View on GitHub →
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>ALBDO</span>
        <span className={styles.footerText}>MIT License · Pre-Release 0.1.0 · Built by Bishal Sen &amp; Pinaki Singha</span>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub ↗</a>
      </footer>
    </div>
  );
}
