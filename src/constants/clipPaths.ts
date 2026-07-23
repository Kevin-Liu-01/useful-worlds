/**
 * Shared clip-path constants used across UI components.
 * Centralizes the angular/sci-fi UI language so changes propagate everywhere.
 */

export const CLIP = {
  /** Standard bottom-right corner cut */
  cornerBR:
    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",

  /** Top-left corner cut */
  cornerTL:
    "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)",

  /** Top-left and bottom-right corners cut */
  cornerTLBR:
    "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",

  /** Top-right corner cut */
  cornerTR:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",

  /** Bottom-left corner cut */
  cornerBL:
    "polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))",

  /** Top-right 20px corner cut (large panels) */
  panelTRBL:
    "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",

  /** Octagonal (avatar frames) */
  octagon:
    "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)",

  /** Type badge (left-angled) */
  typeBadge: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)",

  /** Type badge (larger left angle, for teamUI variant) */
  typeBadgeLarge: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)",

  /** Stat bar inner */
  statBar:
    "polygon(0 0, 100% 0, 100% 100%, 3px 100%, 0 calc(100% - 3px))",

  /** Navbar logo container */
  navLogo:
    "polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)",

  /** Clipped group (navbar button group) */
  navGroup:
    "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",

  /** Clipped button (individual nav button) */
  navButton:
    "polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",

  /** Modal (15px corners) */
  modal:
    "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",

  /** Octagonal image frame (large) */
  imageFrame:
    "polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",

  /** Octagonal image frame (inner, smaller inset) */
  imageFrameInner:
    "polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)",

  /** Small quantity badge */
  quantityBadge:
    "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",

  /** Move stat chip */
  statChip:
    "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",

  /** Grid search input */
  searchInput:
    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",

  /** Deploy team panel */
  deployPanel:
    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",

  /** Mobile toggle arrow */
  mobileToggle:
    "polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
} as const;
