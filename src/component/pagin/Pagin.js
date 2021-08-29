import React from 'react';
import { Pagination } from 'antd';

export default function Pagin(total, num, current, func, value) {
  return <Pagination total={total - 10} defaultCurrent={num} current={current} onChange={(page) => func(page, value)} className="pagination" />;
}
