import LfpFile from "LfpFile"

export default class LfpDebug {
    original_html_element: HTMLElement
    replaced_html_element?: HTMLElement
    file?: LfpFile
    fetch_and_display_px: Promise<unknown>
    
    constructor(e : HTMLElement) {
        this.original_html_element = e
        this.fetch_and_display_px = this.fetchAndDisplay()
    }

    async awaitDisplay() {
        await this.fetch_and_display_px
    }

    fetchAndDisplay() {
        return this.maybeFetch().
            then(() => this.maybeDisplay()).
            catch((e: Error) => {
                this.original_html_element.innerHTML = `<h1>${e.message}</h1><pre>${e.stack}</pre>`
            })
    }

    maybeFetch() {
        if (this.file) {
            return Promise.resolve(true)
        }

        let url = new URL(this.original_html_element.attributes['src'].value,
            this.original_html_element.ownerDocument.baseURI
        )

        this.file = new LfpFile(url)
        return this.file.fetch()
    }

    maybeDisplay() {
        if (this.replaced_html_element) {
            return Promise.resolve(true)
        }

        return new Promise((resolve, _reject) => {
            let el = this.original_html_element.ownerDocument.createElement('lfp-debug-info')
            el['LfpDebugInstance'] = this
            el.innerHTML += `<p>did load ${this.file.content.byteLength} bytes</p>`
            el.innerHTML += `<p>magic number match? ${this.file.has_correct_magic_number}</p>`
            el.innerHTML += `<p>found ${this.file.sections.size} sections</p><ol>`
        
            for (let [n, s] of this.file.sections.entries()) {
                el.innerHTML += `<li>${n} ${String.fromCharCode(s.type)} ${s.contentLength}</li>`
            }
            el.innerHTML += '</ol>'
            el.innerHTML += `<pre>${JSON.stringify(this.file.metadata(), null, 2)}</pre>`
            el.innerHTML += '<ol>'
            for (let i of this.file.imageStack()) {
                el.innerHTML += `<li>${i.focus} - ${i.imageRef} - ${i.blob}<br>`
                el.innerHTML += `<img src="${i.blobURL}">`
                el.innerHTML += '</li>'
            }
            el.innerHTML += '</ol>'
            
            this.replaced_html_element = el
            this.original_html_element.parentElement
                .replaceChild(this.replaced_html_element, this.original_html_element)
        })
    }

    static async loadElements(d : Document) {
        let les = Array.from(d.getElementsByTagName('lfp-debug'))
            .map(e => {
                let le = new LfpDebug(e as HTMLElement)
                return le
            })
        Promise.all(les.map(le => le.fetch_and_display_px))
        
    }
}