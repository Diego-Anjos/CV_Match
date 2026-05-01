import React from 'react';

export const LogoCVMatch = ({ className = "w-8 h-8 text-emerald-500" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Contorno da Prancheta/Folha de Currículo */}
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />

    {/* Marcador de Página (Bookmark) em destaque */}
    <path d="M9 13V7l2.5 2L14 7v6z" fill="currentColor" />

    {/* Linhas simulando o conteúdo do CV */}
    <path d="M8 17h8" />
    <path d="M8 21h5" />
  </svg>
);
