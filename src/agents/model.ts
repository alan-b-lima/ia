import { Set } from "../container/set.ts"

namespace ModelBasedReflex {
    export interface Problem<E> {
        Start(): E
        Next(state: E): E[]
        IsGoal(state: E): boolean

        Equal(o0: E, o1: E): boolean
    }

    export interface Reflex<E> {
        (memory: Memory<E>, problem: Problem<E>): E | null
    }

    export interface Memory<E> {
        current: E
        visited: Set<E>

        iteration: number
        success?: boolean
    }

    export function* Agent<E>(problem: Problem<E>, reflex: Reflex<E>): Generator<Memory<E>, Memory<E>, void> {
        const mem: Memory<E> = {
            current: problem.Start(),
            visited: new Set<E>(problem.Equal),

            iteration: 0,
        }

        for (; ; mem.iteration++) {
            yield mem

            mem.visited.Add(mem.current)

            if (problem.IsGoal(mem.current)) {
                mem.success = true
                return mem
            }

            const next = reflex(mem, problem)
            if (next === null) {
                break
            }

            mem.current = next
            mem.visited.Add(mem.current)
        }

        mem.success = false
        return mem
    }
}

export default ModelBasedReflex