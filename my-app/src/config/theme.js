// Theme colors — backgrounds use CSS vars; accents stay literal (used in hex concat)
export const themeColors = {
  mainBgGradient: "var(--tc-main-bg)",
  glassBg: "var(--tc-glass-bg)",
  glassCardBg: "var(--tc-card-bg)",
  glassFormBg: "var(--tc-form-bg)",
  accentPurple: "#9966ff",
  accentPink: "#44aaff",
  applyBtn: "#1a6fff"
};

export const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { y: -12, transition: { duration: 0.3, ease: "easeOut" } }
};

export const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1,
  left: `${(i * 37 + 5) % 95}%`,
  top:  `${(i * 61 + 10) % 90}%`,
  dur:  2 + (i % 4),
  delay: (i * 0.18) % 3,
}));

export const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};
