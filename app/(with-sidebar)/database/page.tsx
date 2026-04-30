'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TransactionRow } from '@/types/types';

export default function DatabasePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // STATE
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);

  const [filters, setFilters] = useState<Record<string, string>>({
    date: '',
    sale_date: '',
    type: '',
    card_id: '',
    player_name: '',
    scarcity: '',
    competition: '',
    purchase_value: '',
    sale_value: '',
    notes: '',
  });

  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  // LOAD DATA
  async function load() {
    const from = (page - 1) * rowsPerPage;
    const to = from + rowsPerPage - 1;

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .order(sortColumn, { ascending: sortDirection === 'asc' })
      .range(from, to);

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== '') {
        query = query.ilike(key, `%${value}%`);
      }
    });

    const { data, count } = await query;

    setRows(data || []);
    setTotalRows(count || 0);
  }

  useEffect(() => {
    load();
  }, [page, sortColumn, sortDirection, filters]);

  function handleFilterChange(column: string, value: string) {
    setFilters(prev => ({ ...prev, [column]: value }));
    setPage(1);
  }

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  async function handleDelete(id: string) {
    await supabase.from('transactions').delete().eq('id', id);
    load();
  }

  function handleEdit(row: TransactionRow) {
    const params = new URLSearchParams({
      id: row.id,
      type: row.type ?? '',
      player_name: row.player_name ?? '',
      scarcity: row.scarcity ?? '',
      competition: row.competition ?? '',
      purchase_value: row.purchase_value?.toString() ?? '',
      sale_value: row.sale_value?.toString() ?? '',
      date: row.date ?? '',
      sale_date: row.sale_date ?? '',
      card_id: row.card_id ?? '',
      notes: row.notes ?? '',
    });

    window.location.href = `/inputs?${params.toString()}`;
  }

  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        padding: '3rem 1rem',
        color: 'white',
      }}
    >
      <style>
        {`
          .db-table th {
            background: #1e293b;
            color: #e2e8f0;
            border-bottom: 1px solid #334155;
            padding: 0.6rem;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
          }

          .db-table td {
            padding: 0.6rem;
            border-bottom: 1px solid #334155;
          }

          .db-table tr:nth-child(even) {
            background: #1a2433;
          }

          .db-table tr:nth-child(odd) {
            background: #16202c;
          }

          .filter-input {
            width: 100%;
            padding: 0.35rem;
            background: #0f172a;
            color: white;
            border: 1px solid #334155;
            border-radius: 6px;
            font-size: 12px;
          }

          .filter-input::placeholder {
            color: #64748b;
          }

          .action-btn {
            padding: 0.3rem 0.6rem;
            border-radius: 6px;
            font-size: 12px;
            border: none;
            cursor: pointer;
            color: white;
          }

          .edit-btn {
            background: #3b82f6;
            margin-right: 0.4rem;
          }

          .delete-btn {
            background: #ef4444;
          }

          .pagination-btn {
            padding: 0.4rem 0.8rem;
            border-radius: 6px;
            border: none;
            color: white;
            cursor: pointer;
          }
        `}
      </style>

      {/* Title */}
      <div style={{ maxWidth: 1100, margin: '0 auto 2rem auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Database Review</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.3rem' }}>
          View, filter, sort, and manage all Sorare transactions.
        </p>
      </div>

      {/* Table */}
      <div style={{ maxWidth: 1100, margin: '0 auto', overflowX: 'auto' }}>
        <table className="db-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Actions</th>

              {[
                { key: 'date', label: 'Purchase Date' },
                { key: 'sale_date', label: 'Sale Date' },
                { key: 'type', label: 'Type' },
                { key: 'card_id', label: 'Card ID' },
                { key: 'player_name', label: 'Player' },
                { key: 'scarcity', label: 'Scarcity' },
                { key: 'competition', label: 'Competition' },
                { key: 'purchase_value', label: 'Purchase Value (£)' },
                { key: 'sale_value', label: 'Sale Value (£)' },
                { key: 'notes', label: 'Notes' },
              ].map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label}{' '}
                  {sortColumn === col.key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>

            {/* Filters */}
            <tr>
              <td></td>
              {Object.keys(filters).map(key => (
                <td key={key}>
                  <input
                    className="filter-input"
                    value={filters[key]}
                    onChange={e => handleFilterChange(key, e.target.value)}
                    placeholder="Filter..."
                  />
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((t, i) => (
              <tr key={t.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(t)}>
                    Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </td>

                <td>{t.date}</td>
                <td>{t.sale_date || ''}</td>
                <td>{t.type}</td>
                <td>{t.card_id}</td>
                <td>{t.player_name}</td>
                <td>{t.scarcity}</td>
                <td>{t.competition}</td>
                <td>{t.purchase_value}</td>
                <td>{t.sale_value}</td>
                <td>{t.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="pagination-btn"
          style={{
            background: page === 1 ? '#475569' : '#3b82f6',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Previous
        </button>

        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Page
          <input
            type="number"
            min={1}
            max={totalPages}
            value={page}
            onChange={e => {
              const value = Number(e.target.value);
              if (!isNaN(value)) {
                setPage(Math.min(Math.max(value, 1), totalPages));
              }
            }}
            style={{
              width: '60px',
              padding: '0.3rem',
              fontSize: 14,
              border: '1px solid #334155',
              borderRadius: 6,
              background: '#0f172a',
              color: 'white',
              textAlign: 'center',
            }}
          />
          of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="pagination-btn"
          style={{
            background: page === totalPages ? '#475569' : '#3b82f6',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
