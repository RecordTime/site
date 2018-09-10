import React from 'react';

import Item from '../Task';

export default class Tasks extends React.PureComponent {
  render() {
    const { dataSource } = this.props;
    return (
      <div>
        {dataSource.map(item => {
          return <Item data={item} />;
        })}
      </div>
    );
  }
}
