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

  // LOAD DATA (SERVER-SIDE PAGINATION)
  async function load() {
    const from = (page - 1) * rowsPerPage;
    const to = from + rowsPerPage - 1;

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .order(sortColumn, { ascending: sortDirection === 'asc' })
      .range(from, to);

    // APPLY FILTERS
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

  // FILTER HANDLER
  function handleFilterChange(column: string, value: string) {
    setFilters(prev => ({ ...prev, [column]: value }));
    setPage(1);
  }

  // SORT HANDLER
  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  // DELETE
  async function handleDelete(id: string) {
    await supabase.from('transactions').delete().eq('id', id);
    load();
  }

  // EDIT
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
    <div>
      <h1>Database Review</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Actions</th>

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
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  padding: '0.5rem',
                  borderBottom: '1px solid #ddd',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {col.label}{' '}
                {sortColumn === col.key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>

          <tr style={{ background: '#fafafa' }}>
            <td></td>
            {Object.keys(filters).map(key => (
              <td key={key} style={{ padding: '0.3rem' }}>
                <input
                  value={filters[key]}
                  onChange={e => handleFilterChange(key, e.target.value)}
                  placeholder="Filter..."
                  style={{
                    width: '100%',
                    padding: '0.3rem',
                    fontSize: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                  }}
                />
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((t, i) => (
            <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>
                <button
                  onClick={() => handleEdit(t)}
                  style={{
                    marginRight: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Delete
                </button>
              </td>

              <td style={{ padding: '0.5rem' }}>{t.date}</td>
              <td style={{ padding: '0.5rem' }}>{t.sale_date || ''}</td>
              <td style={{ padding: '0.5rem' }}>{t.type}</td>
              <td style={{ padding: '0.5rem' }}>{t.card_id}</td>
              <td style={{ padding: '0.5rem' }}>{t.player_name}</td>
              <td style={{ padding: '0.5rem' }}>{t.scarcity}</td>
              <td style={{ padding: '0.5rem' }}>{t.competition}</td>
              <td style={{ padding: '0.5rem' }}>{t.purchase_value}</td>
              <td style={{ padding: '0.5rem' }}>{t.sale_value}</td>
              <td style={{ padding: '0.5rem' }}>{t.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION WITH INLINE GO-TO-PAGE INPUT */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          style={{
            padding: '0.4rem 0.8rem',
            background: page === 1 ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Previous
        </button>

        {/* INLINE PAGE INPUT */}
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
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const value = Number((e.target as HTMLInputElement).value);
                if (!isNaN(value)) {
                  setPage(Math.min(Math.max(value, 1), totalPages));
                }
              }
            }}
            style={{
              width: '60px',
              padding: '0.3rem',
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: 4,
              textAlign: 'center',
            }}
          />

          of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          style={{
            padding: '0.4rem 0.8rem',
            background: page === totalPages ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
