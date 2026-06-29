import('html2pdf.js').then(mod => console.log('Module:', typeof mod, 'Keys:', Object.keys(mod), 'Default:', typeof mod.default)).catch(err => console.error(err))
