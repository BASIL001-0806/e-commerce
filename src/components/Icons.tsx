import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---------- brand ---------- */
export const BoltMark = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M13.4 2.6 5.2 13.4h5.1L9.6 21.4l8.5-11h-5.2l.5-7.8Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const BoltIcon = BoltMark;

export const RupeeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 4.5h10M7 9h10M16.5 4.6c0 3.3-2.5 4.6-5.6 4.6H7l7.6 10.3" />
  </svg>
);

/* ---------- interface ---------- */
export const CartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 4h2.2l1.4 9.6a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.6L20 7.2H6.1" />
    <circle cx="9.4" cy="19.4" r="1.5" />
    <circle cx="16.6" cy="19.4" r="1.5" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="10.6" cy="10.6" r="6.2" />
    <path d="m15.4 15.4 4.2 4.2" />
  </svg>
);

export const HeartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20.2 4.6 13a4.4 4.4 0 0 1 6.2-6.2l1.2 1.2 1.2-1.2A4.4 4.4 0 0 1 19.4 13Z" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const ArrowIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </svg>
);

export const ChevronIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.5 7h17M3.5 12h11M3.5 17h17" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 3.4 2.5 5.4 5.9.7-4.4 4 1.2 5.9L12 16.6 6.8 19.4 8 13.5l-4.4-4 5.9-.7Z" />
  </svg>
);

export const CopyIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8.4" y="8.4" width="12.2" height="12.2" rx="2.6" />
    <path d="M15.6 5.4a2 2 0 0 0-2-2H5.4a2 2 0 0 0-2 2v8.2a2 2 0 0 0 2 2" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4.4" y="10.4" width="15.2" height="10.4" rx="3" />
    <path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8M12 14v2.6" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.2V12l3.4 2" />
  </svg>
);

/* ---------- product categories ---------- */
export const HeadphonesIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 13.5h2.4a1.6 1.6 0 0 1 1.6 1.6v3.3a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.4Z" />
    <path d="M20 13.5h-2.4a1.6 1.6 0 0 0-1.6 1.6v3.3a1.6 1.6 0 0 0 1.6 1.6h.8A1.6 1.6 0 0 0 20 18.4Z" />
  </svg>
);

export const WatchIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" />
    <path d="M9 6.6 8.6 3h6.8l-.4 3.6M9 17.4l-.4 3.6h6.8l-.4-3.6M12 9.6V12l1.9 1.2" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="7" y="2.6" width="10" height="18.8" rx="2.6" />
    <path d="M10.6 5.2h2.8M9.6 18.8h4.8" />
  </svg>
);

export const LaptopIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 6.2A1.6 1.6 0 0 1 6.6 4.6h10.8A1.6 1.6 0 0 1 19 6.2v9.1H5Z" />
    <path d="M2.6 18.4h18.8l-1.6-2.1H4.2Z" />
  </svg>
);

export const GamepadIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 8h8a5.6 5.6 0 0 1 5.5 4.5l.5 3A2.6 2.6 0 0 1 19.4 19l-1.6-2.4H6.2L4.6 19A2.6 2.6 0 0 1 2 15.5l.5-3A5.6 5.6 0 0 1 8 8Z" />
    <path d="M7.4 12.2h2.2M8.5 11.1v2.2M15.4 11.8h.1M17.2 13.4h.1" />
  </svg>
);

export const CameraIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 8.4h3.1L7.7 6h8.6l1.6 2.4H21v10.1H3Z" />
    <circle cx="12" cy="13" r="3.4" />
  </svg>
);

/* ---------- trust & payments ---------- */
export const TruckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.6 6.5h10.2v9.8H2.6zM12.8 9.6h4l3 3.1v3.6h-7z" />
    <circle cx="6.4" cy="18.4" r="1.7" />
    <circle cx="16.6" cy="18.4" r="1.7" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 2.8 4.8 5.6v6.1c0 4.2 3 7.7 7.2 9.5 4.2-1.8 7.2-5.3 7.2-9.5V5.6Z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </svg>
);

export const ReturnIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.6 9.4A8.6 8.6 0 1 1 4 15" />
    <path d="M3.4 4.6v4.8h4.8" />
  </svg>
);

export const WalletIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.8" y="6.4" width="18.4" height="12.4" rx="2.6" />
    <path d="M2.8 10.6h18.4M16 14.6h2.4" />
  </svg>
);

export const BankIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.4 9.4 12 4.6l8.6 4.8M5 9.4v8M9.6 9.4v8M14.4 9.4v8M19 9.4v8M2.8 20.4h18.4" />
  </svg>
);

export const UpiIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M13.6 3.4 7.4 12l6.2 8.6M19.6 3.4 13.4 12l6.2 8.6" />
  </svg>
);

export const WaveIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.6 12h2.1M6.2 8.2v7.6M9.8 5v14M13.4 8.6v6.8M17 6.4v11.2M20.6 10v4h1.8" />
  </svg>
);

export const BatteryIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.6" y="7.4" width="15.6" height="9.2" rx="2.2" />
    <path d="M21.4 10.4v3.2M6 10.4v3.2M9.4 10.4v3.2M12.8 10.4v3.2" />
  </svg>
);

export const SparkIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 2.8 13.7 9l6.2 1.7-6.2 1.7L12 18.6l-1.7-6.2L4.1 10.7 10.3 9Z" />
  </svg>
);

export const SupportIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4.4 14v-2a7.6 7.6 0 0 1 15.2 0v2" />
    <rect x="2.6" y="13.4" width="3.6" height="5.4" rx="1.6" />
    <rect x="17.8" y="13.4" width="3.6" height="5.4" rx="1.6" />
    <path d="M19.6 18.8v.6a2.6 2.6 0 0 1-2.6 2.6h-2.4" />
  </svg>
);

/* ---------- social ---------- */
export const XIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.7 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L4.9 21H1.8l7.3-8.3L2 3h6.5l4.4 5.9Zm-1.1 16.1h1.7L7.5 4.8H5.6Z" />
  </svg>
);

export const IgIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const YtIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.4" y="5.4" width="19.2" height="13.2" rx="4" />
    <path d="m10.4 9.4 5 2.6-5 2.6Z" fill="currentColor" stroke="none" />
  </svg>
);

export const WhatsIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.4 20.6 4.7 16A8.6 8.6 0 1 1 8 19.3Z" />
    <path d="M9 9.6c.3 2.4 2.6 4.6 5 5 .8.1 1.4-.5 1.4-1.2l-1.6-.8-.8.8a5.4 5.4 0 0 1-2.2-2.2l.8-.8-.8-1.6c-.7 0-1.8.6-1.8.8Z" />
  </svg>
);
