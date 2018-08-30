const TableStore = require('tablestore');
const { 
  getClient, 
  fetch, 
  create 
} = require('../utils');

const Long = TableStore.Long;

class Issue {
  constructor(props) {
    const { id } = props;
    const res = this.fetch(id);
    this.id = res.id;
    this.title = res.title;
  }
  async fetch(id) {
    return await fetch(id);
  }
  async update(params) {
    const id = this.id;
  }
  async remove() {
    const id = this.id;
  }
  stringify() {
    return JSON.stringify(this);
  }
}

/**
 * 增加 issue
 * @param {number} params.pk - 主键
 */
Issue.create = async (ctx, params) => {
  const client = getClient(ctx);
  return create(client, {
    ...params,
    attrs: {
      ...params.attrs,
      status: Long.fromNumber(0),
    },
  });
}
Issue.fetch = async (ctx, params) => {
  const client = getClient(ctx);
  return fetch(client, params);
}

module.exports = Issue;
