import React from 'react';
import { Link } from 'react-router-dom';
import auraEmblem from '@/assets/brand/aura-emblem.png';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'stacked' | 'icon-only';
  theme?: 'warm' | 'light' | 'dark';
  withSubtitle?: boolean;
  to?: string;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  theme = 'warm',
  withSubtitle = true,
  to = '/',
  className = '',
  onClick,
}) => {
  // Height presets for the ribbon & envelope emblem
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

  // Font sizes for subtitle
  const subtitleSizes = {
    xs: 'text-[7px]',
    sm: 'text-[8.5px]',
    md: 'text-[9.5px] sm:text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  // Warm vibrant color styling (no harsh black)
  const textClass =
    theme === 'dark'
      ? 'text-[#FAF7F2]'
      : 'text-[#8E3B2A] hover:text-[#B85D43] transition-colors';

  const subtitleClass =
    theme === 'dark' ? 'text-amber-200/90' : 'text-[#B85D43]';

  const SymbolGraphic = (
    <img
      src={auraEmblem}
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
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85D43] rounded-xl"
      >
        {Content}
      </Link>
    );
  }

  return Content;
};

export default BrandLogo;
