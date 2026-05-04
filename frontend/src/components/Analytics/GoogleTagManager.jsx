import { useEffect } from 'react';

const GTM_ID = 'GTM-P8JVN6V2';
const BOOTSTRAP_SCRIPT_ID = 'gtm-bootstrap';
const NOSCRIPT_ID = 'gtm-noscript';

const GoogleTagManager = () => {
  useEffect(() => {
    if (!document.getElementById(BOOTSTRAP_SCRIPT_ID)) {
      const inline = document.createElement('script');
      inline.id = BOOTSTRAP_SCRIPT_ID;
      inline.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;
      document.head.appendChild(inline);
    }

    if (!document.getElementById(NOSCRIPT_ID)) {
      const noscript = document.createElement('noscript');
      noscript.id = NOSCRIPT_ID;
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, []);

  return null;
};

export default GoogleTagManager;
