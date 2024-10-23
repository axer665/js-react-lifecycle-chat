const url = new URL(window.location.href);

if (url.hostname === 'localhost') {
  url.port = '7070';
}

if (url.hostname === 'axer665.github.io') {
  url.hostname = 'axer665.com';
  url.protocol = 'https';
}

const root = url;
root.pathname = '';

const links = {
  root: root.origin,
  messages: new URL('messages', url.href).href,
};

export default links;
