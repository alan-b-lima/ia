import { Point } from "./maze"

export class VisitedSet {
    #items: Record<string, [Point, number]>
    #length: number

    constructor() {
        this.#items = {}
        this.#length = 0
    }

    Length(): number {
        return this.#length
    }

    Has(point: Point): boolean {
        return `${point.X},${point.Y}` in this.#items
    }

    Add(point: Point, cost: number): void {
        if (this.Has(point)) {
            return
        }

        this.#items[`${point.X},${point.Y}`] = [point, cost]
        this.#length++
    }

    *[Symbol.iterator](): IterableIterator<[Point, number]> {
        for (const key in this.#items) {
            yield this.#items[key]
        }
    }
}
