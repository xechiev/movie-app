import React from 'react';
import { Input } from 'antd';

import 'antd/dist/antd.css';

export default function InputSearch(func, func2) {
  return <Input type="text" className="search-input" onChange={(e) => func(e.target.value, func2(1))} placeholder="Type to search..." />;
}
