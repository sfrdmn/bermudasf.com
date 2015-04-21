var okcms = require('okcms');

var app  = okcms.createApp({

  meta: {
    project: 'BermudaSF'
  },

  root: 'public',

  debug: true,

  schemas: {

    description: {
      id: {type: 'string', hidden: true},
      title: {type: 'string'},
      body: {type: 'text'}
    },

    bag: {
      id: {type: 'string', hidden: true},
      title: {type: 'string'},
      description: {type: 'text'},
      gallery: {type: 'captioned-image-list'},
      price: {type: 'number'}
    }

  },

  resources: [
    {type: 'description'},
    {type: 'bag'}
  ],

  views: {
    '/': {
      data: [
        {type: 'description', query: '*'},
        {type: 'bag', query: '*'}
      ]
    }
  },

  services: {
    s3: {
      key: process.env.S3_KEY,
      secret: process.env.S3_SECRET,
      bucket: process.env.S3_BUCKET
    }
  },

}).listen(1337);

console.log('Server listening at port 1337...');
