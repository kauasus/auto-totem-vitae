import React from "react";

interface VitaeLogoProps {
  width?: number | string;
  height?: number | string;
  animate?: boolean;
  variant?: "full" | "compact";
  className?: string;
  ariaLabel?: string;
}

/**
 * VitaeLogo - refined SVG monogram (VC) + text
 * - variant "compact" shows only the monogram (good for favicons / small places)
 * - variant "full" shows monogram + VITAE / Center / subtitle
 */
const VitaeLogo: React.FC<VitaeLogoProps> = ({
  width = 650,
  height = 650,
  className = "",
  ariaLabel = "Vitae Center",
}) => {
  return (
    <div
      style={{ width, height }}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <img
        src="/logobak.webp"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default VitaeLogo;
