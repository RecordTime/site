/**
 * @file 空容器提示
 * @author ltaoo
 */
import React from 'react';
import PropTypes from 'prop-types';

export default class EmptyTipContainer extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string,
  }
  static defaultProps = {
    desc: '',
  }
  render() {
    const { title, desc } = this.props;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <p style={{ fontSize: 26, color: '#ccc' }}>{title}</p>
        <p>{desc}</p>
      </div>
    );
  }
}
