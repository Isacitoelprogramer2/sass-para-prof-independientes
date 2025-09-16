"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTickets } from "@/hooks/use-tickets";
import { Ticket } from "@/types/ticket";
import { TicketDetailModal } from "@/components/application/modals/ticket-detail-modal";
import { TicketFormModal } from "@/components/application/modals/ticket-form-modal";
import { ConfirmDeleteModal } from "@/components/application/modals/confirm-delete-modal";
import { Button } from "@/components/base/buttons/button";
import { Search,Filter, Calendar, AlertTriangle, AlertCircle, Minus } from "lucide-react";
import { Plus } from "@untitledui/icons";
import { Select } from "@/components/base/select/select";

function useDebounced(value: string, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function TicketsPage() {
  const { tickets, loading, error, crearTicket, actualizarTicket, eliminarTicket } = useTickets();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);

  const [filterPrioridad, setFilterPrioridad] = useState<string | null>(null);
  const [filterContexto, setFilterContexto] = useState<string | null>(null);

  const [selected, setSelected] = useState<Ticket | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Ticket | null>(null);

  const filtered = useMemo(() => {
    let list = tickets;
    if (filterPrioridad && filterPrioridad !== "") list = list.filter((t) => t.prioridad === filterPrioridad);
    if (filterContexto && filterContexto !== "") list = list.filter((t) => t.tipoContexto === filterContexto);
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      list = list.filter((t) => t.id.toLowerCase().includes(s) || (t.descripcion || "").toLowerCase().includes(s));
    }
    return list;
  }, [tickets, filterPrioridad, filterContexto, debouncedSearch]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const alta = tickets.filter((t) => t.prioridad === 'ALTA').length;
    const media = tickets.filter((t) => t.prioridad === 'MEDIA').length;
    const baja = tickets.filter((t) => t.prioridad === 'BAJA').length;
    return { total, alta, media, baja };
  }, [tickets]);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (t: Ticket) => { setEditing(t); setFormOpen(true); };
  const openDetail = (t: Ticket) => { setSelected(t); setDetailOpen(true); };
  const openConfirm = (t: Ticket) => { setToDelete(t); setConfirmOpen(true); };

  const handleSave = async (payload: any) => {
    if (editing) {
      await actualizarTicket(editing.id, payload);
    } else {
      await crearTicket(payload);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    await eliminarTicket(toDelete.id);
    setToDelete(null);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIA':
        return <AlertCircle className="h-4 w-4" />;
      case 'BAJA':
        return <Minus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return 'bg-error-50 text-error-700 border-error-200';
      case 'MEDIA':
        return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'BAJA':
        return 'bg-success-50 text-success-700 border-success-200';
      default:
        return 'bg-secondary text-tertiary border-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-primary mb-2">Gestión de Tickets</h1>
              <p className="text-tertiary">Administra y realiza seguimiento de todos los tickets del sistema</p>
            </div>
            <Button 
              iconLeading={<Plus className="h-4 w-4" />}
              color="primary" 
              onClick={openCreate}
              className="flex flex-row items-center w-fit gap-2 px-4 py-2"
            >
              Nuevo Ticket
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-secondary border border-tertiary rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-tertiary">Total Tickets</p>
                <p className="text-2xl font-semibold text-primary mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-brand-50 rounded-lg flex items-center justify-center">
                <Filter className="h-6 w-6 text-brand-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-secondary border border-tertiary rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-tertiary">Prioridad Alta</p>
                <p className="text-2xl font-semibold text-error-600 mt-1">{stats.alta}</p>
              </div>
              <div className="h-12 w-12 bg-error-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-error-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-secondary border border-tertiary rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-tertiary">Prioridad Media</p>
                <p className="text-2xl font-semibold text-warning-600 mt-1">{stats.media}</p>
              </div>
              <div className="h-12 w-12 bg-warning-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-secondary border border-tertiary rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-tertiary">Prioridad Baja</p>
                <p className="text-2xl font-semibold text-success-600 mt-1">{stats.baja}</p>
              </div>
              <div className="h-12 w-12 bg-success-50 rounded-lg flex items-center justify-center">
                <Minus className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-secondary border border-tertiary rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                <input
                  type="text"
                  placeholder="Buscar por ID o descripción..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded-lg text-primary placeholder-placeholder focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-secondary mb-2">Prioridad</label>
                <Select
                  selectedKey={filterPrioridad || ''}
                  onSelectionChange={(key) => setFilterPrioridad(key as string)}
                  placeholder="Todas"
                  className="min-w-[140px]"
                >
                  <Select.Item id="" label="Todas" />
                  <Select.Item id="ALTA" label="Alta" />
                  <Select.Item id="MEDIA" label="Media" />
                  <Select.Item id="BAJA" label="Baja" />
                </Select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-secondary mb-2">Contexto</label>
                <Select
                  selectedKey={filterContexto || ''}
                  onSelectionChange={(key) => setFilterContexto(key as string)}
                  placeholder="Todos"
                  className="min-w-[180px]"
                >
                  <Select.Item id="" label="Todos" />
                  <Select.Item id="DURANTE_SERVICIO" label="Durante servicio" />
                  <Select.Item id="POST_SERVICIO" label="Post servicio" />
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-secondary border border-tertiary rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              <p className="mt-4 text-tertiary">Cargando tickets...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-tertiary" />
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">No se encontraron tickets</h3>
              <p className="text-tertiary mb-6">No hay tickets que coincidan con los criterios de búsqueda actuales.</p>
              <Button iconLeading={<Plus className="h-4 w-4" />} color="primary" onClick={openCreate} className="inline-flex items-center gap-2">
                Crear primer ticket
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-tertiary">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetail(t)}
                  className="p-6 hover:bg-primary transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-medium text-primary truncate group-hover:text-brand-600 transition-colors">
                          {t.titulo || t.descripcion.substring(0, 60)}
                        </h3>
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(t.prioridad)}`}>
                          {getPriorityIcon(t.prioridad)}
                          {t.prioridad}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-tertiary">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(t.fechaIngreso).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <span className="px-2 py-1 bg-tertiary text-secondary rounded-md text-xs">
                          {t.tipoContexto === 'DURANTE_SERVICIO' ? 'Durante servicio' : 'Post servicio'}
                        </span>
                      </div>
                      
                      {t.descripcion && t.descripcion.length > 60 && (
                        <p className="mt-2 text-sm text-tertiary line-clamp-2">
                          {t.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          openEdit(t);
                        }}
                        className="text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        color="tertiary"
                        size="sm"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          openConfirm(t);
                        }}
                        className="text-xs text-error-600 hover:text-error-700 hover:bg-error-50"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TicketDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} ticket={selected} />
      <TicketFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initial={editing || undefined} />
      <ConfirmDeleteModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
    </div>
  );
}
