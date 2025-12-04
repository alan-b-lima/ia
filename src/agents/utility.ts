import { Heap } from "../container/heap.ts"
import { Set } from "../container/set.ts"

namespace Utility {
    export interface Problem<E> {
        Start(): E
        Next(state: E): E[]
        IsGoal(state: E): boolean

        Weight(o0: E, o1: E): number
        Equal(o0: E, o1: E): boolean
    }

    export interface Heuristic<E> {
        (state: E): number
    }

    export interface Memory<E> {
        current: Node<E>
        visited: Set<E>
        edge: Heap<Node<E>>
        
        iteration: number
        success?: boolean
    }

    export function* Agent<E>(problem: Problem<E>, heuristic: Heuristic<E>): Generator<Memory<E>, Memory<E>, void> {
        const start = problem.Start()
        const current = new Node(0, heuristic(start), start)

        const mem: Memory<E> = {
            current: current,
            visited: new Set<E>(problem.Equal),
            edge: new Heap<Node<E>>(),
            
            iteration: 0,
        }

        mem.edge.Push(current)

        for (; mem.edge.Length(); mem.iteration++) {
            yield mem

            mem.current = mem.edge.Pop()!
            if (!mem.visited.Add(mem.current.head)) {
                continue
            }

            if (problem.IsGoal(mem.current.head)) {
                mem.success = true
                return mem
            }

            const successors = problem.Next(mem.current.head)
            for (const next of successors) {
                const accumulated = mem.current.accumulated + problem.Weight(mem.current.head, next)
                const heuristic_value = heuristic(next)

                const node = new Node(accumulated, accumulated + heuristic_value, next, mem.current)
                mem.edge.Push(node)
            }
        }

        mem.success = false
        return mem
    }

    class Node<E> {
        readonly accumulated: number
        readonly estimated: number
        readonly head: E
        readonly prev: Node<E> | null

        constructor(accumulated: number, estimated: number, head: E, prev: Node<E> | null = null) {
            this.accumulated = accumulated
            this.estimated = estimated
            this.head = head
            this.prev = prev
        }

        Less(other: Node<E>): boolean {
            return this.estimated < other.estimated
        }

        *[Symbol.iterator](): Iterator<E, void, void> {
            for (let n: Node<E> | null = this; n !== null; n = n.prev) {
                yield n.head
            }
        }
    }
}

export default Utility