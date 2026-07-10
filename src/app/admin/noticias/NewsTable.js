'use client';

import { toast } from 'sonner';
import { toggleVisibilityAction, deleteArticleAction } from '../actions';
import Link from 'next/link';
import { useState, useMemo, useTransition } from 'react';
import { Eye, EyeOff, Trash2, Plus, Pencil, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function NewsTable({ news }) {
  const [isPending, startTransition] = useTransition();
  const [globalFilter, setGlobalFilter] = useState('');

  const handleToggle = (id, currentHidden) => {
    startTransition(async () => {
      try {
        await toggleVisibilityAction(id, !currentHidden);
        toast.success(currentHidden ? 'Noticia publicada en portada' : 'Noticia ocultada de la portada');
      } catch (err) {
        toast.error('Error al cambiar el estado');
      }
    });
  };

  const handleDelete = (id) => {
    if (!confirm('¿Seguro que quieres eliminar esta noticia definitivamente?')) return;
    startTransition(async () => {
      try {
        await deleteArticleAction(id);
        toast.success('Noticia eliminada correctamente');
      } catch (err) {
        toast.error('Error al eliminar');
      }
    });
  };

  const columns = useMemo(() => [
    {
      header: 'Noticia',
      accessorFn: row => row.editedTitle || row.title,
      id: 'title',
      cell: info => {
        const item = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
              <img src={item.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src=''; }} />
            </div>
            <div className="max-w-[300px]">
              <div className="text-neutral-200 font-medium truncate text-sm">
                {info.getValue()}
              </div>
              <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                {item.isCustom ? (
                  <span className="text-purple-400 font-medium">Propia</span>
                ) : (
                  <span>{item.source}</span>
                )}
                <span>•</span>
                <span>{new Date(item.pubDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Estado',
      accessorFn: row => row.isHidden ? 'oculta' : row.status,
      id: 'status',
      cell: info => {
        const item = info.row.original;
        if (item.isHidden) {
          return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-neutral-800 text-neutral-400">Oculta</span>;
        }
        if (item.status === 'draft') {
          return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">Borrador</span>;
        }
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Pública</span>;
      }
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: info => {
        const item = info.row.original;
        return (
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleToggle(item.id, item.isHidden)}
              disabled={isPending}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
              title={item.isHidden ? "Mostrar en portada" : "Ocultar de portada"}
            >
              {item.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <Link 
              href={`/admin/noticias/editar/${item.id}`}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
              title="Editar noticia"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => handleDelete(item.id)}
              disabled={isPending}
              className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-500 transition-colors"
              title="Eliminar permanentemente"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }
  ], [isPending]);

  const table = useReactTable({
    data: news,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Noticias Publicadas</h1>
          <p className="text-neutral-500 mt-1 text-sm">Gestiona todo tu inventario de contenido.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded pl-9 pr-4 py-2 focus:outline-none focus:border-neutral-600 transition-colors w-64"
            />
          </div>
          <Link 
            href="/admin/noticias/crear" 
            className="flex items-center gap-2 bg-neutral-100 text-neutral-900 hover:bg-white px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Redactar
          </Link>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-900/50 text-xs uppercase font-semibold text-neutral-500 border-b border-neutral-800">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className={`py-4 px-6 ${header.id === 'actions' ? 'text-right' : ''}`}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-neutral-900/30 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className={`py-4 px-6 ${cell.column.id === 'actions' ? 'text-right' : ''}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-neutral-500">
                    No se encontraron resultados para "{globalFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-800 bg-neutral-900/20">
            <span className="text-xs text-neutral-500">
              Página <strong className="text-neutral-300">{table.getState().pagination.pageIndex + 1}</strong> de <strong className="text-neutral-300">{table.getPageCount()}</strong>
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 disabled:opacity-30 transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 disabled:opacity-30 transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
