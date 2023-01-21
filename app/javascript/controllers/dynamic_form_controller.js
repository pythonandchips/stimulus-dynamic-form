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
      this.element.addEventListener("turbo:submit-start", this.disableFields.bind(this), { signal: this.eventController.signal })
      this.element.addEventListener("turbo:before-frame-render", this.restoreFields.bind(this), { signal: this.eventController.signal })
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
    if (!this.submitTargets.includes(evt.detail.formSubmission.submitter)) { return }

    for(const element of this.formTarget.elements) {
      this.savedData.set(element.name, element.value);
    }
  }

  disableFields(evt) {
    if (!this.submitTargets.includes(evt.detail.formSubmission.submitter)) { return }

    for(const element of this.formTarget.elements) {
      element.disabled = true;
    }
  }

  restoreFields(evt) {
    const form = evt.detail.newFrame.querySelector("form")

    for(const element of form.elements) {
      if(element.value === "") {
        element.value = this.savedData.get(element.name)
      }
    }
  }
}

