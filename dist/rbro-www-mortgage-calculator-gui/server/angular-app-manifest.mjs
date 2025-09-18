
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-LRPN2ECA.js"
    ],
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 528, hash: '7fe634d97db9c0aee6a08ef245f549edb381845238a77705f59675f6c3135614', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1068, hash: '1235cac4f46ac6174eb361b21d61e923fec357f1d169328123317a90e60a512f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 469028, hash: '2b2e4e3ecd523bf5ac4d1e8b28e1df5e157c731c815c470ba666153fa9628eea', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)}
  },
};
