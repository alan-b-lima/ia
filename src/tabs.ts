import { DrawMaze } from "./draw/canvas.ts"
import { MazePresentation } from "./draw/present.ts"
import { DefaultProfile, NewState, Profile, State } from "./event.ts"

export interface Simulator {
    Advance(state: State): boolean
    Render(): MazePresentation
}

export class Orquestrator {
    #tabs: Record<string, [Profile, Simulator]>
    #current: string | undefined

    #ctx: CanvasRenderingContext2D
    #state: State

    #dispose: boolean

    constructor(ctx: CanvasRenderingContext2D) {
        this.#tabs = {}
        this.#current = undefined

        this.#ctx = ctx
        this.#state = NewState()

        this.#dispose = false
        this.loop()
    }

    Link(tab: string, simulator: Simulator, profile: Profile = DefaultProfile): void {
        this.#tabs[tab] = [profile, simulator]
    }

    Unlink(tab: string): void {
        if (this.#current === tab) {
            for (const t in this.#tabs) {
                if (t !== tab) {
                    this.SwapTo(t)
                    break
                }
            }

            if (this.#current === tab) {
                this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height)
                this.#current = undefined
            }
        }

        delete this.#tabs[tab]
    }

    Current(): string | undefined {
        return this.#current
    }

    SwapTo(tab: string): boolean {
        if (!Object.hasOwn(this.#tabs, tab)) {
            return false
        }

        if (this.#current !== undefined) {
            this.#tabs[this.#current][0] = this.#state.Profile()
        }
        this.#current = tab

        const [profile, simulator] = this.#tabs[tab]
        this.#state.SetProfile(profile)

        DrawMaze(this.#ctx, simulator.Render())
        return true
    }

    Dispose(): void {
        this.#dispose = true
    }

    private loop(): void {
        if (this.#dispose) {
            return
        }

        if (this.#current === undefined) {
            this.next_frame()
            return
        }

        if (this.#state.Pause && !this.#state.Step) {
            this.next_frame()
            return
        }

        const [, current] = this.#tabs[this.#current]
        if (current.Advance(this.#state)) {
            const present = current.Render()
            DrawMaze(this.#ctx, present)
        }

        this.next_frame()
    }

    private next_frame() {
        if (this.#state.Flash) {
            requestAnimationFrame(this.loop.bind(this))
        } else {
            setTimeout(this.loop.bind(this), this.#state.Speed)
        }
    }
}
