export default class Modal {
  constructor(modalID) {
    this.modal = document.getElementById(modalID)
    this.closeButton = this.modal.getElementsByClassName('modalClose')[0]
    this.inputField = this.modal.getElementsByClassName('input')[0]
    this.funcButton = this.modal.getElementsByClassName('button')[0]
    this.correctText = '日本語'
    this.correctFunc = () => {
      console.log('correct')
    }
    this.incorrectFunc = () => {
      console.log('incorrect')
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
  setButtonFunc(correctText, correctFunc, incorrectFunc) {
    this.correctText = correctText
    this.correctFunc = correctFunc
    this.incorrectFunc = incorrectFunc
  }
  buttonFunc() {
    if (this.inputField.value === this.correctText) {
      this.modal.style.display = 'none'
      this.correctFunc()
    } else {
      this.incorrectFunc()
    }
  }
}
