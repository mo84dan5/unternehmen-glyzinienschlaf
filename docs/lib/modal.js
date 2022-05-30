export default class Modal {
  constructor(modalID) {
    this.modal = document.getElementById(modalID)
    this.closeButton = this.modal.getElementsByClassName('modalClose')[0]
    this.init()
  }
  init() {
    this.modal.addEventListener('click', (e) => {
      if (e.target == this.modal) this.close()
    })
    this.closeButton.addEventListener('click', this.close.bind(this))
  }
  open() {
    this.modal.style.display = 'block'
  }
  close() {
    this.modal.style.display = 'none'
  }
}
