import React from 'react';

export default function ApplicationLogo({ size = 'medium', showSubtext = true, brand = 'redvecino', className = '' }) {
    // Sizing system for consistency
    const containerSizes = {
        small: 'gap-2',
        medium: 'gap-3',
        large: 'gap-4 flex-col sm:flex-row'
    };

    const iconContainerSizes = {
        small: 'h-8 w-8 rounded-lg shadow-sm',
        medium: 'h-11 w-11 rounded-xl shadow-md',
        large: 'h-16 w-16 rounded-2xl shadow-xl'
    };

    const svgSizes = {
        small: 'w-4.5 h-4.5',
        medium: 'w-6 h-6',
        large: 'w-9 h-9'
    };

    const titleSizes = {
        small: 'text-base font-black',
        medium: 'text-xl sm:text-2xl font-black',
        large: 'text-3xl sm:text-4xl font-black'
    };

    const subtitleSizes = {
        small: 'text-[7px]',
        medium: 'text-[9px]',
        large: 'text-[11px]'
      };
  
      const textAlignment = {
          small: 'text-left',
          medium: 'text-left',
          large: 'text-center sm:text-left'
      };

      const isRedVecino = brand === 'redvecino';

      return (
          <div className={`flex items-center ${containerSizes[size] || containerSizes.medium} ${className}`}>
              {/* Visual Icon with Brand Specific Styling */}
              <div className={`flex items-center justify-center shrink-0 text-white transition-all duration-300 ${
                  isRedVecino 
                      ? 'bg-gradient-to-br from-[#0F2557] to-[#00A896] shadow-cyan-500/20' 
                      : 'bg-gradient-to-br from-[#72B043] to-[#00A896] shadow-emerald-500/20'
              } ${iconContainerSizes[size] || iconContainerSizes.medium}`}>
                  
                  {isRedVecino ? (
                      <img 
                          src="/images/logo_redvecino.png" 
                          alt="RedVecino Logo" 
                          className="object-contain w-full h-full rounded-lg p-0.5"
                          onError={(e) => {
                              // Fallback to stylized text icon if image fails to load
                              e.target.style.display = 'none';
                          }}
                      />
                  ) : (
                      <img 
                          src="/images/logo_mivecino.png" 
                          alt="MiVecino Logo" 
                          className="object-contain w-full h-full rounded-lg p-0.5"
                          onError={(e) => {
                              // Fallback to stylized text icon if image fails to load
                              e.target.style.display = 'none';
                          }}
                      />
                  )}
              </div>
  
              {/* Brand Title and Subtitle */}
              <div className={`flex flex-col select-none ${textAlignment[size] || textAlignment.medium}`}>
                  <span className={`tracking-tight text-slate-900 dark:text-white transition-colors duration-300 ${titleSizes[size] || titleSizes.medium}`}>
                      {isRedVecino ? (
                          <>
                              Red<span className="text-[#00A896] font-extrabold">Vecino</span>
                          </>
                      ) : (
                          <>
                              Mi<span className="text-[#72B043] font-extrabold">Vecino</span>
                          </>
                      )}
                  </span>
                  {showSubtext && (
                      <span className={`block font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 transition-colors duration-300 ${subtitleSizes[size] || subtitleSizes.medium}`}>
                          {isRedVecino 
                              ? 'La Red Inteligente de Condominios' 
                              : 'Tu comunidad, en una sola app'}
                      </span>
                  )}
              </div>
          </div>
      );
  }
