import React from 'react';
import { Alert } from 'antd';

import 'antd/dist/antd.css';

const ErrorNoResult = <Alert message="Warning! Поиск не дал результатов." showIcon type="warning" className="error" banner closable />;

export default ErrorNoResult;
