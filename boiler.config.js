const baseTasks = [
  'browser-sync',
  'copy',
  'clean',
  'eslint',
  'mocha'
];

export default {
  env: {
    development: {
      tasks: [
        'babel',
        'nodemon',
        ...baseTasks
      ]
    },
    production: {
      tasks: [
        'babel',
        ...baseTasks
      ]
    }
  }
};
