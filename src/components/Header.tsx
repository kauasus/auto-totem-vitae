import React from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "RECEPÇÃO DE PACIENTE",
  subtitle,
}) => {
  return (
    <header className="rounded-t-lg bg-gradient-to-r from-[#b42222] to-[#8b1212] text-white p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
