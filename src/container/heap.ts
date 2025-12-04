export class Heap<T extends Lesser<T>> {
    #elements: T[]

    public constructor(...elements: T[]) {
        this.#elements = elements

        if (elements.length > 0) {
            this.Heapify()
        }
    }

    Length(): number {
        return this.#elements.length
    }

    Empty(): boolean {
        return this.#elements.length <= 0
    }

    Heapify() {
        const n = this.Length()
        for (let i = (n >> 1) - 1; i >= 0; i--) {
            this.down(i, n)
        }
    }

    Push(x: T) {
        this.#elements.push(x)
        this.up(this.Length() - 1)
    }

    Peek(): T | undefined {
        return this.#elements[0]
    }

    Pop(): T | undefined {
        let n = this.Length() - 1
        this.swap(0, n)
        this.down(0, n)
        return this.#elements.pop()
    }

    Remove(i: number): T | undefined {
        let n = this.Length() - 1
        if (n != i) {
            this.swap(i, n)
            if (!this.down(i, n)) {
                this.up(i)
            }
        }
        return this.#elements.pop()
    }

    Fix(i: number): void {
        if (!this.down(i, this.Length())) {
            this.up(i)
        }
    }

    *[Symbol.iterator](): Iterator<T, void, void> {
        for (let i = 0; i < this.#elements.length; i++) {
            yield this.#elements[i]
        }
    }

    private swap(i: number, j: number): void {
        const v = this.#elements[i]
        this.#elements[i] = this.#elements[j]
        this.#elements[j] = v
    }

    private less(i: number, j: number): boolean {
        return this.#elements[i].Less(this.#elements[j])
    }

    private up(j: number): void {
        while (true) {
            let i = Math.max((j - 1) >> 1, 0) // parent
            if (i == j || !this.less(j, i)) {
                break
            }
            this.swap(i, j)
            j = i
        }
    }

    private down(i0: number, n: number): boolean {
        let i = i0
        while (true) {
            let j1 = (i << 1) + 1
            if (j1 >= n || j1 < 0) { // j1 < 0 after int overflow
                break
            }
            let j = j1 // left child
            let j2 = j1 + 1
            if (j2 < n && this.less(j2, j1)) {
                j = j2 // = 2*i + 2  // right child
            }
            if (!this.less(j, i)) {
                break
            }
            this.swap(i, j)
            i = j
        }
        return i > i0
    }
}
