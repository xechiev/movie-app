import React from 'react';
import { Alert } from 'antd';

import 'antd/dist/antd.css';

const ErrorNetwork = <Alert message="Error! Нет подключения к сети." showIcon type="error" className="error" banner closable />;

export default ErrorNetwork;
