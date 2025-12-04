export class Stack<T> {
    #elements: T[]

    constructor(...element: T[]) {
        this.#elements = element
    }

    Empty(): boolean {
        return this.#elements.length <= 0
    }

    Length(): number {
        return this.#elements.length
    }

    Push(v: T): void {
        this.#elements.push(v)
    }

    Peek(): T | undefined {
        return this.#elements[this.#elements.length - 1]
    }

    Pop(): T | undefined {
        return this.#elements.pop()
    }

    [Symbol.iterator](): Iterator<T> {
        return this.#elements[Symbol.iterator]()
    }
}