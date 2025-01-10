const { env } = require('process');

//const PROXY_CONFIG = [
//  {
//    context: ["/RESTAdapter/WLMS_Q/BPValidation"],
//    target: "https://orchestrationhubqa.capetown.gov.za",
//    pathRewrite: { '^/RESTAdapter/WLMS_Q/BPValidation': '/RESTAdapter/WLMS_Q/BPValidation' },
//    secure: false,
//    changeOrigin: true,
//    headers: {
//      Connection: 'Keep-Alive'
//    }
//  }
//]

//module.exports = PROXY_CONFIG;




//const { env } = require('process');

//const target = env.ASPNETCORE_HTTPS_PORT ? `http://172.29.166.10:${env.ASPNETCORE_HTTPS_PORT}` :
////const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
//  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://172.29.166.10/27569';
//  //env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:27569';

//const PROXY_CONFIG = [
//  {
//    context: [
//      "/RESTAdapter/WLMS_Q/BPValidation",
//      // Add other API endpoints here as needed
//    ],
//    target: "https://orchestrationhubqa.capetown.gov.za",
//    secure: false,
//    changeOrigin: true,
//    headers: {
//      Connection: 'Keep-Alive'
//    }
//  }
//]

//module.exports = PROXY_CONFIG;
//const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : env.ASPNETCORE_URLS
        ? env.ASPNETCORE_URLS.split(';')[0]
        : 'https://localhost:7001';  // Replace with your actual ASP.NET Core backend URL

const PROXY_CONFIG = [
  {
    context: ["/api"],  // Match all API routes
    target: target,
    secure: false,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
      // Allow both origins
      const allowedOrigins = ['http://localhost:4200'];
      const origin = req.headers.origin;

      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);  // Dynamically allow the correct origin
      }
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
    }
  }
];

module.exports = PROXY_CONFIG;
