'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type OrderStatus = 'success' | 'pending' | 'failed';
type Order = {
  id: string;
  date: string; // e.g. "Mar 1, 2023"
  price: string;
  gems: string;
  status: OrderStatus;
};

const PageShell = styled.div`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-height: 100vh;
  padding-top: 58px;

  background: #0d0d0d;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url('/images/backgroundtopup.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.22;
    filter: saturate(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(13, 13, 13, 0.92) 55%,
      rgba(0, 0, 0, 0.9) 100%
    );
  }
`;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing['3xl']} ${theme.spacing['2xl']};
  width: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize['4xl']};
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: ${theme.typography.fontWeight.extrabold};
  font-style: italic;

  span {
    background: ${theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const TableContainer = styled(Card)`
  padding: 0;
`;

const ControlsRow = styled.div`
  margin-bottom: ${theme.spacing['2xl']};
`;

const FilterBarRow = styled.div`
  display: grid;
  grid-template-columns: 2.1fr 1.1fr 1fr 1fr auto;
  gap: ${theme.spacing.md};
  align-items: end;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const FilterField = styled.div`
  min-width: 0;
  width: 100%;
`;

const FilterLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
  white-space: nowrap;
`;

const UniformInput = styled(Input)`
  /* Force exact single-row height */
  height: 44px;

  input {
    height: 44px;
  }
`;

const DateInput = styled.input`
  width: 100%;
  height: 44px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid ${theme.colors.ui.border};
  border-radius: ${theme.borderRadius.lg};
  padding: 0 ${theme.spacing.lg};
  color: #fff;
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    background: rgba(30, 30, 30, 0.95);
    box-shadow: 0 0 12px rgba(255, 106, 0, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid ${theme.colors.ui.border};
  border-radius: ${theme.borderRadius.lg};
  padding: 0 ${theme.spacing.lg};
  color: #fff;
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  appearance: none;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(30, 30, 30, 0.95);
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    background: rgba(30, 30, 30, 0.95);
    box-shadow: 0 0 12px rgba(255, 106, 0, 0.2);
  }

  option {
    background: #1a1a1a;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
  }
`;

const ResetButton = styled(Button)`
  height: 44px;
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  background: transparent;
  border: 2px solid ${theme.colors.primary.main};
  color: ${theme.colors.primary.main};

  &:hover:not(:disabled) {
    background: rgba(255, 106, 0, 0.08);
    border-color: ${theme.colors.primary.light};
    box-shadow: ${theme.shadows.glow};
  }
`;


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: rgba(0, 0, 0, 0.32);
    border-bottom: 2px solid ${theme.colors.primary.main};
  }

  th {
    padding: ${theme.spacing.lg};
    text-align: left;
    color: ${theme.colors.primary.main};
    font-weight: ${theme.typography.fontWeight.bold};
    text-transform: uppercase;
    font-size: ${theme.typography.fontSize.sm};
    letter-spacing: 1px;
    white-space: nowrap;
  }

  td {
    padding: ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.ui.border};
    color: ${theme.colors.text.primary};
    vertical-align: middle;
  }

  tbody tr {
    transition: all ${theme.transitions.normal};

    &:hover {
      background: rgba(255, 106, 0, 0.06);
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.sm};
    }
  }
`;

const OrderId = styled.span`
  color: ${theme.colors.primary.main};
  font-weight: ${theme.typography.fontWeight.bold};
`;

const StatusBadge = styled.span<{ status: OrderStatus }>`
  background: ${(props) => {
    switch (props.status) {
      case 'success':
        return 'rgba(0, 208, 128, 0.2)';
      case 'pending':
        return 'rgba(255, 193, 7, 0.2)';
      case 'failed':
        return 'rgba(220, 20, 60, 0.2)';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'success':
        return '#00D080';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#DC143C';
    }
  }};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.span<{ status: OrderStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${(props) => {
    switch (props.status) {
      case 'success':
        return '#00D080';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#DC143C';
    }
  }};
  box-shadow: 0 0 14px rgba(255, 255, 255, 0.08);
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
  border-top: 1px solid ${theme.colors.ui.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageInfo = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const PaginationBtns = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const PageNumber = styled(Button)`
  border-radius: ${theme.borderRadius.full};
`;

function parseOrderDate(dateStr: string): number {
  // Supported mock formats: "Mar 1, 2023", "Feb 28, 2023", "March 13, 2023"
  const cleaned = dateStr.replace(',', '');
  const parts = cleaned.split(' ').filter(Boolean);
  // [MonOrMonth, day, year] OR [MonthName, day, year]
  const month = parts.slice(0, parts.length - 2).join(' ');
  const day = Number(parts[parts.length - 2]);
  const year = Number(parts[parts.length - 1]);
  const normalized = `${month} ${day} ${year}`;
  const t = Date.parse(normalized);
  return Number.isFinite(t) ? t : 0;
}

const mockOrders: Order[] = [
  { id: '#5267', date: 'Mar 1, 2023', price: '100', gems: '1', status: 'success' },
  { id: '#53587', date: 'Jan 26, 2023', price: '300', gems: '3', status: 'success' },
  { id: '#2430', date: 'Feb 12, 2033', price: '100', gems: '1', status: 'failed' },
  { id: '#6879', date: 'Feb 12, 2023', price: '500', gems: '5', status: 'success' },
  { id: '#6378', date: 'Feb 28, 2023', price: '500', gems: '5', status: 'pending' },
  { id: '#6909', date: 'March 13, 2023', price: '100', gems: '1', status: 'success' },
  { id: '#6907', date: 'March 18, 2033', price: '300', gems: '3', status: 'pending' },
];

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState<string>(''); // YYYY-MM-DD
  const [dateTo, setDateTo] = useState<string>(''); // YYYY-MM-DD
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = dateFrom ? Date.parse(`${dateFrom}T00:00:00`) : null;
    const toTs = dateTo ? Date.parse(`${dateTo}T23:59:59`) : null;

    return mockOrders.filter((o) => {
      if (q && !o.id.toLowerCase().includes(q)) return false;
      if (status !== 'all' && o.status !== status) return false;

      const orderTs = parseOrderDate(o.date);
      if (fromTs !== null && orderTs < fromTs) return false;
      if (toTs !== null && orderTs > toTs) return false;

      return true;
    });
  }, [search, status, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
    setDateFrom('');
    setDateTo('');
    setPageSize(5);
    setPage(1);
  };

  const statusLabel = (s: OrderStatus) => {
    if (s === 'success') return 'Thành Công';
    if (s === 'pending') return 'Đang Xử Lý';
    return 'Thất Bại';
  };

  const handlePrevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  const currentRangeStart = (safePage - 1) * pageSize + 1;
  const currentRangeEnd = Math.min(filtered.length, safePage * pageSize);

  return (
    <PageShell>
      <PageContainer>
        <PageTitle>
          LỊCH SỬ <span>ĐƠN HÀNG</span>
        </PageTitle>

        <ControlsRow>
          <FilterBarRow>
            <FilterField>
              <FilterLabel>Tìm</FilterLabel>
              <UniformInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm theo mã đơn (ví dụ: #520...)"
              />
            </FilterField>

            <FilterField>
              <FilterLabel>Tình trạng</FilterLabel>
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as OrderStatus | 'all');
                  setPage(1);
                }}
              >
                <option value="all">Tất cả</option>
                <option value="success">Thành Công</option>
                <option value="pending">Đang Xử Lý</option>
                <option value="failed">Thất Bại</option>
              </Select>
            </FilterField>

            <FilterField>
              <FilterLabel>Từ:</FilterLabel>
              <DateInput
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
            </FilterField>

            <FilterField>
              <FilterLabel>Đến:</FilterLabel>
              <DateInput
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
              />
            </FilterField>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <ResetButton
                type="button"
                onClick={() => {
                  resetFilters();
                }}
              >
                Làm mới
              </ResetButton>
            </div>
          </FilterBarRow>
        </ControlsRow>


        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th style={{ width: 160 }}>Mã đơn</th>
                <th style={{ width: 200 }}>Ngày</th>
                <th style={{ width: 180 }}>Số tiền</th>
                <th style={{ width: 140 }}>Gems</th>
                <th style={{ width: 180 }}>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: theme.spacing['2xl'], color: theme.colors.text.secondary }}>
                    Không có đơn hàng phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                paged.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <OrderId>{order.id}</OrderId>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.price} VND</td>
                    <td>
                      <span style={{ color: theme.colors.primary.main, fontWeight: theme.typography.fontWeight.bold }}>
                        +{order.gems}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={order.status}>
                        <StatusDot status={order.status} />
                        {statusLabel(order.status)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>

        <PaginationRow>
          <PageInfo>
            Hiển thị {filtered.length === 0 ? 0 : currentRangeStart} - {filtered.length === 0 ? 0 : currentRangeEnd} / {filtered.length}
          </PageInfo>

          <PaginationBtns>
            <Button variant="secondary" onClick={handlePrevPage} disabled={safePage <= 1}>
              Trước
            </Button>
            <PageNumber variant="secondary" onClick={() => {}} disabled>
              Trang {safePage}/{totalPages}
            </PageNumber>
            <Button variant="secondary" onClick={handleNextPage} disabled={safePage >= totalPages}>
              Sau
            </Button>
          </PaginationBtns>
        </PaginationRow>
      </PageContainer>
    </PageShell>
  );
};

