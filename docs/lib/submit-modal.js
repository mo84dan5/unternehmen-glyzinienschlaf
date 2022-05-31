export default class SubmitModal {
  constructor(modalID) {
    this.modal = document.getElementById(modalID)
    this.closeButton = this.modal.getElementsByClassName('modalClose')[0]
    this.funcButton = this.modal.getElementsByClassName('button')[0]
    this.func = () => {
      console.log('correct')
    }
    this.init()
  }
  init() {
    this.modal.addEventListener('click', (e) => {
      if (e.target == this.modal) this.close()
    })
    this.closeButton.addEventListener('click', this.close.bind(this))
    this.funcButton.addEventListener('click', this.buttonFunc.bind(this))
  }
  open() {
    this.modal.style.display = 'block'
  }
  close() {
    this.modal.style.display = 'none'
  }
  setButtonFunc(func) {
    this.func = func
  }
  buttonFunc() {
    this.modal.style.display = 'none'
    this.func()
  }
}
