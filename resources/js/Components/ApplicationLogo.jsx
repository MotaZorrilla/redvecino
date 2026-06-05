import React from 'react';

const BRAND_COLORS = {
    redvecino: { accent: '#00A896', gradient: 'from-brand-navy to-brand-teal', shadow: 'shadow-cyan-500/20' },
    mivecino: { accent: '#72B043', gradient: 'from-brand-green to-brand-teal', shadow: 'shadow-emerald-500/20' },
    ti: { accent: '#00A896', gradient: 'from-brand-navy to-brand-teal', shadow: 'shadow-cyan-500/20' },
    admin: { accent: '#7A5299', gradient: 'from-brand-purple to-brand-teal', shadow: 'shadow-brand-purple/20' },
    comite: { accent: '#7A5299', gradient: 'from-brand-purple to-brand-teal', shadow: 'shadow-brand-purple/20' },
    colaborador: { accent: '#7A5299', gradient: 'from-brand-purple to-brand-teal', shadow: 'shadow-brand-purple/20' },
    superusuario: { accent: '#7A5299', gradient: 'from-brand-purple to-brand-teal', shadow: 'shadow-brand-purple/20' },
    propietario: { accent: '#72B043', gradient: 'from-brand-green to-brand-teal', shadow: 'shadow-emerald-500/20' },
    residente: { accent: '#72B043', gradient: 'from-brand-green to-brand-teal', shadow: 'shadow-emerald-500/20' },
};

export default function ApplicationLogo({ size = 'medium', showSubtext = true, brand = 'redvecino', className = '' }) {
    const colors = BRAND_COLORS[brand] || BRAND_COLORS.redvecino;
    const isRedVecino = brand === 'redvecino' || brand === 'admin' || brand === 'ti' || brand === 'comite' || brand === 'colaborador' || brand === 'superusuario';
    const isIconOnly = brand === 'admin' || brand === 'ti' || brand === 'comite' || brand === 'colaborador' || brand === 'superusuario';

    const logoSrc = isRedVecino ? '/images/logo_redvecino.png' : '/images/logo_mivecino.png';
    const iconSrc = isRedVecino ? '/images/icon_redvecino.png' : '/images/icon_mivecino.png';

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

      const brandName = isRedVecino ? 'RedVecino' : 'MiVecino';
      const brandSubtext = isRedVecino ? 'La Red Inteligente de Condominios' : 'Tu comunidad, en una sola app';
      const nameParts = isRedVecino ? ['Red', 'Vecino'] : ['Mi', 'Vecino'];

      return (
          <div className={`flex items-center ${containerSizes[size] || containerSizes.medium} ${className}`}>
              <div className={`flex items-center justify-center shrink-0 text-white transition-all duration-300 bg-gradient-to-br ${colors.gradient} ${colors.shadow} ${iconContainerSizes[size] || iconContainerSizes.medium}`}>
                  <img
                      src={isIconOnly ? iconSrc : logoSrc}
                      alt={`${brandName} Logo`}
                      className="object-contain w-full h-full rounded-lg p-0.5"
                      loading="lazy"
                  />
              </div>
  
              {!isIconOnly && (
                  <div className={`flex flex-col select-none ${textAlignment[size] || textAlignment.medium}`}>
                      <span className={`tracking-tight text-slate-900 dark:text-white transition-colors duration-300 ${titleSizes[size] || titleSizes.medium}`}>
                          {nameParts[0]}<span style={{ color: colors.accent }} className="font-extrabold">{nameParts[1]}</span>
                      </span>
                      {showSubtext && (
                          <span className={`block font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 transition-colors duration-300 ${subtitleSizes[size] || subtitleSizes.medium}`}>
                              {brandSubtext}
                          </span>
                      )}
                  </div>
              )}
          </div>
      );
  }
