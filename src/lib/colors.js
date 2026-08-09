// Mirrors the custom properties in index.css. Chart fills (SVG) use these plain
// hex constants directly rather than var(--x) for reliable cross-browser paint.
export const COLORS = {
  ink: '#242A56',
  inkSecondary: '#545a80',
  inkMuted: '#8488a3',

  statusGood: '#055755',
  statusGoodFill: '#0F8A6B',
  statusCritical: '#D01620',
  statusCriticalFill: '#FF222D',
  statusWarning: '#B85A12',
  statusWarningFill: '#F58C34',
  statusNeutralFill: '#C9CDD8',

  ordinal1: '#8FB8DE',
  ordinal2: '#397CC0',
  ordinal3: '#1F4E80',

  magnitudeBlue: '#397CC0',
  magnitudeTeal: '#079AA0',

  gridline: '#e3e8ef',
};

// Pipeline stages read as a funnel (ordinal, in-flight) plus two terminal
// outcomes (status). Color encodes progression toward close, not identity —
// swapping two mid-funnel stages would change the meaning, which is why this
// is a one-hue ramp + reserved status pair rather than 6 arbitrary hues.
export const STAGE_ORDER = ['Discovery', 'Room Proposal', 'Tentative Booking', 'Waitlist', 'Closed Won', 'Closed Lost'];

export const STAGE_COLOR = {
  discovery: COLORS.ordinal1,
  'room proposal': COLORS.ordinal2,
  'tentative booking': COLORS.ordinal3,
  waitlist: COLORS.statusNeutralFill,
  'closed won': COLORS.statusGoodFill,
  'closed lost': COLORS.statusCriticalFill,
};

export function stageColor(stage) {
  return STAGE_COLOR[stage.trim().toLowerCase()] || COLORS.inkMuted;
}

export function sortByStageOrder(pipeline) {
  return [...pipeline].sort((a, b) => {
    const ai = STAGE_ORDER.indexOf(a.stage);
    const bi = STAGE_ORDER.indexOf(b.stage);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}
