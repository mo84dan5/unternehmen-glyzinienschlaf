export default class SysMesModal {
  constructor() {
    this.modal = document.getElementById('systemMessage')
    this.sysMesBody = document.getElementById('system-message-body')
    this.closeButton = this.modal.getElementsByClassName('modalClose')[0]
    this.funcButton = this.modal.getElementsByClassName('button')[0]
    this.text = ''
    this.func = () => {}
    this.init()
  }
  init() {
    this.funcButton.addEventListener('click', this.buttonFunc.bind(this))
  }
  open() {
    this.modal.style.display = 'block'
  }
  close() {
    this.modal.style.display = 'none'
  }
  set_message(textList) {
    let response = ''
    textList.forEach((text) => {
      response = response + '<p>' + text + '</p>'
    })
    this.sysMesBody.innerHTML = response
  }
  setButtonFunc(func) {
    this.func = func
  }
  buttonFunc() {
    this.func()
  }
}
