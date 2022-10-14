import { assertIsArrayBuffer } from "@tool-belt/type-predicates/dist/index"
import LfpSection from "LfpSection"

let LfpMagicNumber = Uint8Array.from([0x89, 0x4C, 0x46, 0x50, 0x0D, 0x0A, 0x1A, 0x0A])

export default class LfpFile {
    url: URL
    content?: ArrayBuffer
    content_cursor = 0
    has_correct_magic_number: Boolean = false
    sections: LfpSection[] = []

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

        while (start < end) {
            let new_section = new LfpSection(this.content, start)
            this.sections.push(new_section)
            start += new_section.paddedLength
        }
    }
}