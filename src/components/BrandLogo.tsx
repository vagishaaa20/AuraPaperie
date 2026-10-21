import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'stacked' | 'icon-only';
  theme?: 'light' | 'dark';
  withSubtitle?: boolean;
  to?: string;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  theme = 'light',
  withSubtitle = true,
  to = '/',
  className = '',
  onClick,
}) => {
  // Height presets for the ribbon emblem (maintains natural 2.76:1 aspect ratio)
  const symbolHeights = {
    xs: 'h-5',
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  }[size];

  // Font sizes for "AuraPaperie"
  const titleSizes = {
    xs: 'text-sm font-bold',
    sm: 'text-base font-bold',
    md: 'text-xl sm:text-2xl font-bold',
    lg: 'text-2xl sm:text-3xl font-extrabold',
    xl: 'text-3xl sm:text-4xl font-extrabold',
  }[size];

  // Font sizes for "PERSONALIZED WISHES & INVITES"
  const subtitleSizes = {
    xs: 'text-[7px]',
    sm: 'text-[8.5px]',
    md: 'text-[9.5px] sm:text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  // Strong explicit colors to prevent accidental dark-mode inversion on white backgrounds
  const textClass = theme === 'dark' ? 'text-[#FAF7F2]' : 'text-[#1C2230]';
  const subtitleClass = theme === 'dark' ? 'text-amber-200/90' : 'text-[#A85A44]';

  const SymbolGraphic = (
    <img
      src="/brand/symbol.png"
      alt="AuraPaperie Ribbon &amp; Envelope Emblem"
      className={`${symbolHeights} w-auto object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-105 select-none`}
      loading="eager"
    />
  );

  const Content = (
    <div
      className={`inline-flex items-center group cursor-pointer ${
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
        <div className={`flex flex-col justify-center ${layout === 'stacked' ? 'items-center' : 'items-start'}`}>
          <span
            className={`font-serif leading-none tracking-tight ${titleSizes} ${textClass}`}
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              letterSpacing: '-0.02em',
            }}
          >
            AuraPaperie
          </span>
          {withSubtitle && size !== 'xs' && (
            <span
              className={`font-sans font-bold uppercase mt-1 leading-none tracking-[0.2em] ${subtitleSizes} ${subtitleClass}`}
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
      <Link
        to={to}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A85A44] rounded-xl"
      >
        {Content}
      </Link>
    );
  }

  return Content;
};

export default BrandLogo;
