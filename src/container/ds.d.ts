interface DataStructure<T> {
    Empty(): boolean
    Length(): number
    Push(x: T): void
    Pop(): T | undefined

    [Symbol.iterator](): Iterator<T>
}

interface Equaler<T> {
    Equal(a: T): boolean
}

interface Lesser<T> {
    Less(a: T): boolean
}
