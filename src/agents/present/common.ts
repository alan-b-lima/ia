export const Color = {
    wall: "#000000",
    clear: "#ffffff",

    start: "#f8ddac",
    goal: "#64b43e",

    agent: "#ec2121",
    edge: "#e945f8",
    path: "#51ee66",
    visited: "#0000ff",
} as const

export function Heat(minimum: number, maximum: number, value: number): string {
    let ratio = mod((value - minimum) / (maximum - minimum), 2)
    if (ratio >= 1) {
        ratio = 2 - ratio
    }

    const r = clamp(0, Math.floor(255 * ratio), 255)
    const b = clamp(0, Math.floor(255 * (1 - ratio)), 255)

    return `rgb(${r}, 0, ${b})`
}

function mod(n: number, m: number): number {
    return ((n % m) + m) % m
}

function clamp(minimum: number, value: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, value))
}