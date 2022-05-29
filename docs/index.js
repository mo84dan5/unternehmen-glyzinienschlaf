console.log('index.js: loaded')

import Modal from './lib/modal.js'

const modal_1 = new Modal('easyModal', 'modalClose', 'overlay')
modal_1.open()
