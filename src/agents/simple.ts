namespace SimpleReflex {
    export interface Problem<E> {
        Start(): E
        Next(state: E): E[]
        IsGoal(state: E): boolean
    }

    export interface Reflex<E> {
        (state: E, states: E[]): E
    }

    export interface Memory<E> {
        current: E
        success?: boolean

        iteration: number
    }

    export function* Agent<E>(problem: Problem<E>, reflex: Reflex<E>): Generator<Memory<E>, Memory<E>, void> {
        const mem: Memory<E> = {
            current: problem.Start(),
            iteration: 0,
        }

        for (; ; mem.iteration++) {
            yield mem

            if (problem.IsGoal(mem.current)) {
                mem.success = true
                return mem
            }

            const next = problem.Next(mem.current)
            if (next.length === 0) {
                break
            }

            mem.current = reflex(mem.current, next)
        }

        mem.success = false
        return mem
    }

    export namespace reflex {
        export function Random<E>(_: E, states: E[]): E {
            const index = Math.floor(Math.random() * states.length)
            return states[index]
        }
    }
}

export default SimpleReflex