export class Queue<T> {
    #head: Node<T> | null
    #tail: Node<T> | null
    #length: number

    constructor(...elements: T[]) {
        this.#head = null
        this.#tail = null
        this.#length = 0

        for (let i = 0; 1 < elements.length; i++) {
            this.Push(elements[i])
        }
    }

    Empty(): boolean {
        return this.#head === null || this.#head.empty()
    }

    Length(): number {
        return this.#length
    }

    Push(v: T): void {
        if (this.#head === null) {
            const node = new Node<T>()
            this.#head = node
            this.#tail = node
        } else if (this.#head.filled()) {
            const node = new Node<T>()
            this.#head.next(node)
            this.#head = node
        }

        this.#head.push(v)
        this.#length++
    }

    Peek(): T | undefined {
        if (this.#tail === null) {
            return undefined
        }

        return this.#tail.peek()
    }

    Pop(): T | undefined {
        if (this.#tail === null) {
            return undefined
        }

        const value = this.#tail.pop()
        if (this.#tail.empty() && this.#tail.filled()) {
            this.#tail = this.#tail.next()
            if (this.#tail === null) {
                this.#head = null
            }
        }

        if (value !== undefined) {
            this.#length--
        }
        return value
    }

    *[Symbol.iterator](): Iterator<T> {
        for (let ring: Node<T> | null = this.#tail; ring !== null; ring = ring.next()) {
            for (const element of ring) {
                yield element
            }
        }
    }
}

class Node<T> {
    static #PAGE_SIZE = 0x200

    #elements: T[]
    #head: number
    #tail: number
    #next: Node<T> | null

    constructor() {
        this.#elements = new Array<T>(Node.#PAGE_SIZE)
        this.#head = 0
        this.#tail = 0
        this.#next = null
    }

    empty(): boolean {
        return this.#head <= this.#tail
    }

    filled(): boolean {
        return this.#head === this.#elements.length
    }

    next(next?: Node<T>): Node<T> | null {
        if (next !== undefined) {
            this.#next = next
        }

        return this.#next
    }

    push(x: T): void {
        if (this.filled()) {
            return
        }

        this.#elements[this.#head] = x
        this.#head++
    }

    peek(): T | undefined {
        if (this.empty()) {
            return undefined
        }

        return this.#elements[this.#tail]
    }

    pop(): T | undefined {
        if (this.empty()) {
            return undefined
        }

        const node = this.#elements[this.#tail]
        this.#elements[this.#tail] = undefined as any
        this.#tail++
        return node
    }

    clear(): void {
        this.#head = 0
        this.#tail = 0
        this.#next = null
    }

    [Symbol.iterator](): Iterator<T> {
        const gen = generator(this)

        return {
            next: function (...[value]: [] | [any]): IteratorResult<T> {
                return gen.next()
            }
        }

        function* generator(node: Node<T>) {
            for (let n: Node<T> | null = node; n !== null; n = n.#next) {
                for (let i = n.#tail; i < n.#head; i++) {
                    yield n.#elements[i]
                }
            }
        }
    }
}
