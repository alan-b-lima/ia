export class Set<T> {
    #elements: T[]
    #equal: (o0: T, o1: T) => boolean


    constructor(equal: (o0: T, o1: T) => boolean) {
        this.#elements = []
        this.#equal = equal
    }

    Length(): number {
        return this.#elements.length
    }

    Has(element: T): boolean {
        for (let i = 0; i < this.#elements.length; i++) {
            if (this.#equal(this.#elements[i], element)) {
                return true
            }
        }

        return false
    }

    Add(element: T): boolean {
        if (this.Has(element)) {
            return false
        }

        this.#elements.push(element)
        return true
    }

    *[Symbol.iterator](): Iterator<T> {
        for (let i = 0; i < this.#elements.length; i++) {
            yield this.#elements[i]
        }
    }
}