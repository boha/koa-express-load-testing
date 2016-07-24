const baseTasks = [
  'browser-sync',
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
