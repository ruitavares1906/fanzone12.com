import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  total: number;
  page: number;
  perPage: number;
  basePath: string; // path sem query, ex: "/catalogo"
  searchParams: URLSearchParams; // deve conter restantes filtros
}

export function Pagination({ total, page, perPage, basePath, searchParams }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const createLink = (p: number) => {
    const params = new URLSearchParams(searchParams);
    if (p === 1) {
      params.delete("pagina");
    } else {
      params.set("pagina", String(p));
    }
    return `${basePath}?${params.toString()}`;
  };

  // Responsivo: adapta-se ao tamanho da tela
  const maxButtonsDesktop = 15;
  const maxButtonsTablet = 9;
  const maxButtonsMobile = 5;
  
  // Calcular botões para desktop (15)
  let startDesktop = Math.max(1, page - Math.floor(maxButtonsDesktop / 2));
  let endDesktop = startDesktop + maxButtonsDesktop - 1;
  if (endDesktop > totalPages) {
    endDesktop = totalPages;
    startDesktop = Math.max(1, endDesktop - maxButtonsDesktop + 1);
  }

  // Calcular botões para tablet (9)
  let startTablet = Math.max(1, page - Math.floor(maxButtonsTablet / 2));
  let endTablet = startTablet + maxButtonsTablet - 1;
  if (endTablet > totalPages) {
    endTablet = totalPages;
    startTablet = Math.max(1, endTablet - maxButtonsTablet + 1);
  }

  // Calcular botões para mobile (5)
  let startMobile = Math.max(1, page - Math.floor(maxButtonsMobile / 2));
  let endMobile = startMobile + maxButtonsMobile - 1;
  if (endMobile > totalPages) {
    endMobile = totalPages;
    startMobile = Math.max(1, endMobile - maxButtonsMobile + 1);
  }

  const buttons = [];
  
  // Botões para mobile (5) - telas pequenas
  for (let p = startMobile; p <= endMobile; p++) {
    buttons.push(
      <Link
        key={`mobile-${p}`}
        href={createLink(p)}
        className={cn(
          "px-2 py-2 rounded-md text-sm font-semibold min-w-[36px] text-center block md:hidden",
          p === page
            ? "bg-gray-900 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm"
        )}
      >
        {p}
      </Link>
    );
  }

  // Botões para tablet (9) - telas médias
  for (let p = startTablet; p <= endTablet; p++) {
    buttons.push(
      <Link
        key={`tablet-${p}`}
        href={createLink(p)}
        className={cn(
          "px-3 py-2 rounded-md text-sm font-semibold min-w-[40px] text-center hidden md:block lg:hidden",
          p === page
            ? "bg-gray-900 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm"
        )}
      >
        {p}
      </Link>
    );
  }

  // Botões para desktop (15) - telas grandes
  for (let p = startDesktop; p <= endDesktop; p++) {
    buttons.push(
      <Link
        key={`desktop-${p}`}
        href={createLink(p)}
        className={cn(
          "px-3 py-1 rounded text-sm font-medium hidden lg:block",
          p === page
            ? "bg-gray-900 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        )}
      >
        {p}
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6 sm:gap-2 sm:mt-8">
      {page > 1 && (
        <Link
          href={createLink(page - 1)}
          className="px-2 py-2 rounded-md text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm md:px-3 md:py-1"
        >
          <span className="hidden md:inline">Anterior</span>
          <span className="md:hidden">‹</span>
        </Link>
      )}
      <div className="flex gap-2 sm:gap-2">
        {buttons}
      </div>
      {page < totalPages && (
        <Link
          href={createLink(page + 1)}
          className="px-2 py-2 rounded-md text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm md:px-3 md:py-1"
        >
          <span className="hidden md:inline">Seguinte</span>
          <span className="md:hidden">›</span>
        </Link>
      )}
    </div>
  );
} 