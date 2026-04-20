'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DatabasePage() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    sale_date: '',
    type: '',
    card_id: '',
    player_name: '',
    scarcity: '',
    competition: '',
    purchase_value: '',
    sale_value: '',
    profit: '',
    notes: '',
  });

  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  async function load() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    setTransactions(data || []);
  }

  useEffect(() => {
    load();
  }, []);

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

  // Add profit to each row
  const withProfit = transactions.map((t: any) => ({
    ...t,
    profit:
      t.sale_value && t.purchase_value
        ? Number(t.sale_value) - Number(t.purchase_value)
        : '',
  }));

  const filtered = withProfit.filter((t: any) =>
    Object.keys(filters).every(key => {
      const filterValue = filters[key].toLowerCase();
      if (!filterValue) return true;
      return String(t[key] ?? '').toLowerCase().includes(filterValue);
    })
  );

  const sorted = [...filtered].sort((a: any, b: any) => {
    const valA = a[sortColumn] ?? '';
    const valB = b[sortColumn] ?? '';

    if (sortDirection === 'asc') {
      return String(valA).localeCompare(String(valB), undefined, { numeric: true });
    } else {
      return String(valB).localeCompare(String(valA), undefined, { numeric: true });
    }
  });

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  async function handleDelete(id: string) {
    await supabase.from('transactions').delete().eq('id', id);
    load();
  }

  function handleEdit(row: any) {
    const params = new URLSearchParams(row).toString();
    window.location.href = `/inputs?${params}`;
  }

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
              { key: 'profit', label: 'Profit (£)' },
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

          {/* FILTER ROW */}
          <tr style={{ background: '#fafafa' }}>
            <td></td>

            {Object.keys(filters).map(key => (
              <td key={key} style={{ padding: '0.3rem' }}>
                <input
                  value={(filters as any)[key]}
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
          {paginated.map((t: any, i) => (
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

              <td style={{ padding: '0.5rem' }}>
                {t.purchase_value ? Number(t.purchase_value).toFixed(2) : ''}
              </td>

              <td style={{ padding: '0.5rem' }}>
                {t.sale_value ? Number(t.sale_value).toFixed(2) : ''}
              </td>

              <td
                style={{
                  padding: '0.5rem',
                  color:
                    t.profit > 0 ? 'green' : t.profit < 0 ? 'red' : 'inherit',
                  fontWeight: t.profit ? 600 : 400,
                }}
              >
                {t.profit !== '' ? Number(t.profit).toFixed(2) : ''}
              </td>

              <td style={{ padding: '0.5rem' }}>{t.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
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
            cursor: page === 1 ? 'default' : 'pointer',
          }}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
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
            cursor: page === totalPages ? 'default' : 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
