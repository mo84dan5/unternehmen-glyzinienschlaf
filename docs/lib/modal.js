export default class Modal {
  constructor(modalID, overlayClass, closeButtonClass) {
    this.modal = document.getElementById(modalID)
    this.overlay = this.modal.getElementsByClassName(overlayClass)[0]
    this.closeButton = this.modal.getElementsByClassName(closeButtonClass)[0]
    this.init()
  }
  init() {
    this.modal.addEventListener('click', this.open)
    this.overlay.addEventListener('click', this.close)
    this.closeButton.addEventListener('click', this.close)
  }
  open() {
    this.modal.style.display = 'block'
  }
  close() {
    this.modal.style.display = 'none'
  }
}
