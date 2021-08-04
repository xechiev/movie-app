import React from 'react';
import { Input } from 'antd';

import 'antd/dist/antd.css';

export default function InputSearch(func) {
  return <Input type="text" className="search-input" onChange={(e) => func(e.target.value)} placeholder="Type to search..." />;
}
