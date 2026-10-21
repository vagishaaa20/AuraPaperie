import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'stacked' | 'icon-only';
  theme?: 'light' | 'dark' | 'auto';
  withSubtitle?: boolean;
  to?: string;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  theme = 'auto',
  withSubtitle = true,
  to = '/',
  className = '',
  onClick,
}) => {
  // Dimension presets for the ribbon & envelope symbol
  const symbolDimensions = {
    xs: { width: 28, height: 14 },
    sm: { width: 38, height: 18 },
    md: { width: 50, height: 24 },
    lg: { width: 72, height: 34 },
    xl: { width: 110, height: 52 },
  }[size];

  // Text size classes
  const titleSizes = {
    xs: 'text-sm font-semibold tracking-tight',
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl sm:text-3xl font-bold tracking-tight',
    xl: 'text-3xl sm:text-4xl font-extrabold tracking-tight',
  }[size];

  const subtitleSizes = {
    xs: 'text-[7px] tracking-[0.18em]',
    sm: 'text-[8.5px] tracking-[0.2em]',
    md: 'text-[10px] tracking-[0.22em]',
    lg: 'text-xs tracking-[0.25em]',
    xl: 'text-sm tracking-[0.28em]',
  }[size];

  const textClasses =
    theme === 'dark'
      ? 'text-[#FAF7F2]'
      : theme === 'light'
      ? 'text-[#1C2230]'
      : 'text-[#1C2230] dark:text-[#FAF7F2]';

  const subtitleClasses =
    theme === 'dark'
      ? 'text-amber-200/80'
      : theme === 'light'
      ? 'text-[#AE6850]/90'
      : 'text-[#AE6850] dark:text-amber-200/80';

  const SymbolGraphic = (
    <div
      className="relative flex-shrink-0 inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      style={{
        width: symbolDimensions.width,
        height: symbolDimensions.height,
      }}
    >
      <img
        src="/brand/symbol.png"
        alt="AuraPaperie Ribbon & Envelope Emblem"
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        loading="eager"
      />
    </div>
  );

  const Content = (
    <div
      className={`inline-flex items-center group ${
        layout === 'stacked'
          ? 'flex-col text-center space-y-2'
          : layout === 'icon-only'
          ? ''
          : 'flex-row items-center space-x-3 text-left'
      } ${className}`}
      onClick={onClick}
    >
      {SymbolGraphic}

      {layout !== 'icon-only' && (
        <div className={`flex flex-col ${layout === 'stacked' ? 'items-center' : 'items-start'}`}>
          <span
            className={`font-serif leading-none font-bold ${titleSizes} ${textClasses} transition-colors`}
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              letterSpacing: '-0.02em',
            }}
          >
            AuraPaperie
          </span>
          {withSubtitle && size !== 'xs' && (
            <span
              className={`font-sans font-medium uppercase mt-1 leading-none ${subtitleSizes} ${subtitleClasses}`}
              style={{
                letterSpacing: '0.22em',
              }}
            >
              Personalized Wishes &amp; Invites
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AE6850] rounded-lg">
        {Content}
      </Link>
    );
  }

  return Content;
};
export default BrandLogo;
