// Currently there is no TS support for this file: https://github.com/facebook/create-react-app/issues/8273

const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/graphql',
        createProxyMiddleware({
            target: 'http://localhost:4001/graphql',
            changeOrigin: true,
        })
    );
};
