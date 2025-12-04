type Function = (...args: any) => any

export function Try<T extends Function, E = Error>(func: T, ...params: Parameters<T>): [ReturnType<T>, null] | [undefined, E] {
    try {
        return [func(...params), null]
    } catch (error) {
        return [undefined, error as E]
    }
}

type AsyncFunction = (...args: any) => Promise<any>

export async function AsyncTry<T extends AsyncFunction, E = Error>(func: T, ...params: Parameters<T>): Promise<[ReturnType<T> extends Promise<infer P> ? P : never, null] | [undefined, E]> {
    try {
        return [await func(...params), null]
    } catch (error) {
        return [undefined, error as E]
    }
}
