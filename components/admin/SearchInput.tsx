'use client';

import type { ChangeEvent } from 'react';
import styled from 'styled-components';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';

const Wrap = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.45);
`;

const Input = styled.input`
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #ffffff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
`;

export function SearchInput({
  onChange,
  placeholder = 'Search...',
  value,
}: {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
}) {
  return (
    <Wrap>
      <FaSearch />
      <Input onChange={onChange} placeholder={placeholder} value={value} />
    </Wrap>
  );
}
