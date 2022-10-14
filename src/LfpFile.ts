import { assertIsArrayBuffer } from "@tool-belt/type-predicates/dist/index"
import LfpSection, { LfpSectionType } from "LfpSection"

let LfpMagicNumber = Uint8Array.from([0x89, 0x4C, 0x46, 0x50, 0x0D, 0x0A, 0x1A, 0x0A])

export default class LfpFile {
    url: URL
    content?: ArrayBuffer
    content_cursor = 0
    has_correct_magic_number: Boolean = false
    sections: Map<string, LfpSection> = new Map()

    #metadata?: any

    constructor(url: URL) {
        this.url = url
    }

    async fetch() {
        if (this.content) return this.content

        let resp = await fetch(this.url)
        this.content = await resp.arrayBuffer()
        
        this.checkCorrectMagicNumber()
        this.buildSections()

        return this.content
    }

    checkCorrectMagicNumber() {
        assertIsArrayBuffer(this.content)
        let candidateMagicNumber = new Uint8Array(this.content, this.content_cursor, 8)
        this.content_cursor += 8

        this.has_correct_magic_number = 
            LfpMagicNumber.every((val, idx) => val == candidateMagicNumber[idx])
    }

    buildSections() {
        var start = 0x10
        let end = this.content.byteLength
        var view = new DataView(this.content)

        let dec = new TextDecoder()

        while (start < end) {
            let new_section = new LfpSection(this.content, start)
            let name = dec.decode(new_section.name).replaceAll("\0", '')
            this.sections.set(name, new_section)
            start += new_section.paddedLength
        }
    }
 
    metadataSection() {
        for (let s of this.sections.values()) {
            if (LfpSectionType.Metadata == s.type) return s
        } 

        return undefined
    }

    metadata() {
        if (this.#metadata) return this.#metadata

        let dec = new TextDecoder()
        this.#metadata = JSON.parse(dec.decode(this.metadataSection().content()))
        
        return this.#metadata
    }

    imageStack() {
        let images = 
            this.metadata()['views'][0]['accelerations'][0]['perImage'].
                sort((a, b) => a.focus - b.focus)
        for (let i of images) {
            let section = this.sections.get(i['imageRef'])
            if (!section) break 
            i['blob'] = section.blob()
            i['blobURL'] = section.blobURL()
        }

        return images
    }
}