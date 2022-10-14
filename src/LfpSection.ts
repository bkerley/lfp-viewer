export enum LfpSectionType {
    Unknown = 0,
    Component = 0x43,
    Metadata = 0x4d,
    Package = 0x50
}

export let headerLength = 0x60

export default class LfpSection {
    buf: ArrayBuffer
    view: DataView
    start: number

    type: LfpSectionType
    contentLength: number
    paddedLength: number
    name: Uint8Array

    #blob?: Blob
    #blob_url: string

    constructor(buf: ArrayBuffer, start: number) {
        this.buf = buf
        this.view = new DataView(buf)
        this.start = start

        this.readSectionHeader()
    }

    get [Symbol.toStringTag]() {
        return 'LfpSection'
    }

    readSectionHeader() {
        this.type = this.view.getUint8(this.start + 3)
        this.start += 12
        this.contentLength = this.view.getUint32(this.start, false)
        this.padLength()
        this.start += 4
        this.name = new Uint8Array(this.buf, this.start, 0x30)
        this.start += 80
    }

    content() {
        return this.buf.slice(this.start, this.start + this.contentLength)
    }

    blob() {
        if (this.#blob) return this.#blob

        this.#blob = new Blob([this.content()])

        return this.#blob
    }

    blobURL() {
        if (this.#blob_url) return this.#blob_url

        this.#blob_url = URL.createObjectURL(this.blob())

        return this.#blob_url
    }

    padLength() {
        let total_length = this.contentLength + headerLength
        let rem = total_length % 0x10
        if (0 == rem) {
            this.paddedLength = total_length
            return
        }
        this.paddedLength = total_length - rem + 0x10
    }
}