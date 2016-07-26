export default {
  addons: [
    ['assemble-middleware', {
      all: 'onLoad',
      ignore: {onLoad: 'isomorphic-data'}
    }],
    'assemble-nunjucks'
  ]
};
