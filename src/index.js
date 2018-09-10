import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';

import AV from 'leancloud-storage';

import './index.css';
import RouterConfig from './router';
import registerServiceWorker from './registerServiceWorker';

AV.init('A7zzPAY1DY85f9UfYCWqfuY6-gzGzoHsz', 'fq6eTM7cLL2JM7k1tXL5agg3');

ReactDOM.render(<RouterConfig />, document.getElementById('root'));
registerServiceWorker();
