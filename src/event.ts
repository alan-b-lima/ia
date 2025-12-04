export interface Profile {
    Pause: boolean
    Speed: number
    Flash: boolean
    Step: boolean
    Iteration: number
    Accumulated: number
    Estimated: number
}

export interface State {
    get Pause(): boolean
    get Speed(): number
    get Flash(): boolean
    get Step(): boolean
    get Iteration(): number

    set Iteration(iteration: number)
    set Accumulated(accumulated: number)
    set Estimated(estimated: number)

    Profile(): Profile
    SetProfile(profile: Profile): void
}

export const DefaultProfile: Profile = {
    Pause: true,
    Speed: 100,
    Flash: true,
    Step: false,
    Iteration: 0,
    Accumulated: 0,
    Estimated: 0,
}

export function NewState(profile: Profile = DefaultProfile): State {
    const pause_input = document.querySelector<HTMLInputElement>("#pause")
    const speed_input = document.querySelector<HTMLInputElement>("#speed")
    const flash_input = document.querySelector<HTMLInputElement>("#flash")
    const step_input = document.querySelector<HTMLInputElement>("#step")

    const iteration_output = document.querySelector<HTMLInputElement>("#iteration-output")
    const accumulated_output = document.querySelector<HTMLInputElement>("#accumulated-output")
    const estimated_output = document.querySelector<HTMLInputElement>("#estimated-output")

    if (pause_input === null) { throw new Error("there must be a #pause element") }
    if (speed_input === null) { throw new Error("there must be a #speed element") }
    if (flash_input === null) { throw new Error("there must be a #flash element") }
    if (step_input === null) { throw new Error("there must be a #step element") }
    if (iteration_output === null) { throw new Error("there must be a #iteration-output element") }
    if (accumulated_output === null) { throw new Error("there must be a #accumulated-output element") }
    if (estimated_output === null) { throw new Error("there must be a #estimated-output element") }

    const state = {
        internal: {} as Profile,

        get Pause(): boolean { return this.internal.Pause },
        get Speed(): number { return this.internal.Speed },
        get Flash(): boolean { return this.internal.Flash },

        get Step(): boolean {
            const old = this.internal.Step
            this.Step = false
            return old
        },

        get Iteration(): number { return this.internal.Iteration },

        set Pause(pause: boolean) {
            step_input.disabled = !pause
            pause_input.checked = pause
            this.internal.Pause = pause
        },

        set Speed(speed: number) {
            speed_input.value = String(speed)
            this.internal.Speed = speed
        },

        set Flash(flash: boolean) {
            flash_input.checked = flash
            speed_input.disabled = flash
            this.internal.Flash = flash
        },

        set Step(step: boolean) {
            step_input.disabled = step
            this.internal.Step = step
        },

        set Iteration(iteration: number) {
            iteration_output.textContent = iteration.toString()
            this.internal.Iteration = iteration
        },

        set Accumulated(accumulated: number) {
            accumulated_output.textContent = accumulated.toFixed(3)
            this.internal.Accumulated = accumulated
        },

        set Estimated(estimated: number) {
            estimated_output.textContent = estimated.toFixed(3)
            this.internal.Estimated = estimated
        },

        Profile(): Profile {
            return structuredClone(this.internal)
        },

        SetProfile(profile: Profile): void {
            this.Pause = profile.Pause
            this.Speed = profile.Speed
            this.Flash = profile.Flash
            this.Iteration = profile.Iteration
            this.Step = profile.Step
            this.Accumulated = profile.Accumulated
            this.Estimated = profile.Estimated
        },
    }

    state.SetProfile(profile)

    pause_input.addEventListener("input", function () { state.Pause = pause_input.checked })
    speed_input.addEventListener("input", function () { state.Speed = +speed_input.value })
    flash_input.addEventListener("input", function () { state.Flash = flash_input.checked })
    step_input.addEventListener("click", function () { state.Step = true })

    window.addEventListener("keydown", function (event: KeyboardEvent) {
        switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
            state.Step = true
            break

        case " ":
            state.Pause = !state.Pause
            break

        default:
            return
        }

        event.preventDefault()
    })

    return state
}
