import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { attachEvents: { default: true, type: Boolean } }
  static targets = ["submit", "form"]

  initialize() {
    this.savedData = new Map()
  }

  connect() {
    if (this.attachEventsValue) {
      this.eventController = new AbortController()
      this.element.addEventListener("turbo:submit-start", this.saveFields.bind(this), { signal: this.eventController.signal })
      this.element.addEventListener("turbo:submit-start", this.saveFocus.bind(this), { signal: this.eventController.signal })
      this.element.addEventListener("turbo:submit-start", this.disableFields.bind(this), { signal: this.eventController.signal })
      this.element.addEventListener("turbo:before-frame-render", this.restoreFields.bind(this), { signal: this.eventController.signal })
      this.element.addEventListener("turbo:frame-load", this.restoreFocus.bind(this), { signal: this.eventController.signal })
    }
  }

  disconnect() {
    if(this.attachEventsValue) {
      this.eventController.abort()
    }
  }

  update() {
    this.submitTarget.click()
  }

  saveFields(evt) {
    // Ignore saving when the form submits from the normal button
    if (!this.submitTargets.includes(evt.detail.formSubmission.submitter)) { return }

    this.#eachElement(this.formTarget.elements, (element) => {
      this.savedData.set(element.id, this.#getElementValue(element))
    })
  }

  saveFocus(evt) {
    if (!this.submitTargets.includes(evt.detail.formSubmission.submitter)) { return }

    this.focusedElementId = document.activeElement.id;
  }

  disableFields(evt) {
    if (!this.submitTargets.includes(evt.detail.formSubmission.submitter)) { return }

    this.#eachElement(this.formTarget.elements, (element) => {
      element.disabled = true;
    });
  }

  restoreFields(evt) {
    const form = evt.detail.newFrame.querySelector("form")

    this.#eachElement(form.elements, (element) => {
      if(!this.#elementHasValue(element)) { return }

      const value = this.savedData.get(element.id)
      this.#setElementValue(element, value)
    })
  }

  restoreFocus(evt) {
    const element = this.element.querySelector(`#${this.focusedElementId}`)

    element.focus()
  }

  #eachElement(elements, callback) {
    for(const element of elements) {
      // Ignore any elements inside a turbo-permanent area. These will
      // not be swapped out and turbo will handle switching over
      if (element.closest("[data-turbo-permanent]")) { continue; }
      // Ingore any element that we want to have the user set the value for
      if (element.dataset.dynamicFormRestore === "false") { continue; }

      callback(element)
    }
  }

  #elementHasValue(element) {
    if(["radio", "checkbox"].includes(element.type)) {
      return !element.checked
    }
    return element.value === ""
  }

  #getElementValue(element) {
    if(["radio", "checkbox"].includes(element.type)) {
      return element.checked
    }
    return element.value
  }

  #setElementValue(element, value) {
    if(["radio", "checkbox"].includes(element.type)) {
      element.checked = value
    }
    element.value = value
  }
}

