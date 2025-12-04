export const DefaultProfile = {
    Pause: true,
    Speed: 100,
    Flash: true,
    Step: false,
    Iteration: 0,
    Accumulated: 0,
    Estimated: 0,
};
export function NewState(profile = DefaultProfile) {
    const pause_input = document.querySelector("#pause");
    const speed_input = document.querySelector("#speed");
    const flash_input = document.querySelector("#flash");
    const step_input = document.querySelector("#step");
    const iteration_output = document.querySelector("#iteration-output");
    const accumulated_output = document.querySelector("#accumulated-output");
    const estimated_output = document.querySelector("#estimated-output");
    if (pause_input === null) {
        throw new Error("there must be a #pause element");
    }
    if (speed_input === null) {
        throw new Error("there must be a #speed element");
    }
    if (flash_input === null) {
        throw new Error("there must be a #flash element");
    }
    if (step_input === null) {
        throw new Error("there must be a #step element");
    }
    if (iteration_output === null) {
        throw new Error("there must be a #iteration-output element");
    }
    if (accumulated_output === null) {
        throw new Error("there must be a #accumulated-output element");
    }
    if (estimated_output === null) {
        throw new Error("there must be a #estimated-output element");
    }
    const state = {
        internal: {},
        get Pause() { return this.internal.Pause; },
        get Speed() { return this.internal.Speed; },
        get Flash() { return this.internal.Flash; },
        get Step() {
            const old = this.internal.Step;
            this.Step = false;
            return old;
        },
        get Iteration() { return this.internal.Iteration; },
        set Pause(pause) {
            step_input.disabled = !pause;
            pause_input.checked = pause;
            this.internal.Pause = pause;
        },
        set Speed(speed) {
            speed_input.value = String(speed);
            this.internal.Speed = speed;
        },
        set Flash(flash) {
            flash_input.checked = flash;
            speed_input.disabled = flash;
            this.internal.Flash = flash;
        },
        set Step(step) {
            step_input.disabled = step;
            this.internal.Step = step;
        },
        set Iteration(iteration) {
            iteration_output.textContent = iteration.toString();
            this.internal.Iteration = iteration;
        },
        set Accumulated(accumulated) {
            accumulated_output.textContent = accumulated.toFixed(3);
            this.internal.Accumulated = accumulated;
        },
        set Estimated(estimated) {
            estimated_output.textContent = estimated.toFixed(3);
            this.internal.Estimated = estimated;
        },
        Profile() {
            return structuredClone(this.internal);
        },
        SetProfile(profile) {
            this.Pause = profile.Pause;
            this.Speed = profile.Speed;
            this.Flash = profile.Flash;
            this.Iteration = profile.Iteration;
            this.Step = profile.Step;
            this.Accumulated = profile.Accumulated;
            this.Estimated = profile.Estimated;
        },
    };
    state.SetProfile(profile);
    pause_input.addEventListener("input", function () { state.Pause = pause_input.checked; });
    speed_input.addEventListener("input", function () { state.Speed = +speed_input.value; });
    flash_input.addEventListener("input", function () { state.Flash = flash_input.checked; });
    step_input.addEventListener("click", function () { state.Step = true; });
    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowRight":
                state.Step = true;
                break;
            case " ":
                state.Pause = !state.Pause;
                break;
            default:
                return;
        }
        event.preventDefault();
    });
    return state;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBeUJBLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBWTtJQUNuQyxLQUFLLEVBQUUsSUFBSTtJQUNYLEtBQUssRUFBRSxHQUFHO0lBQ1YsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLFNBQVMsRUFBRSxDQUFDO0lBQ1osV0FBVyxFQUFFLENBQUM7SUFDZCxTQUFTLEVBQUUsQ0FBQztDQUNmLENBQUE7QUFFRCxNQUFNLFVBQVUsUUFBUSxDQUFDLFVBQW1CLGNBQWM7SUFDdEQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBbUIsUUFBUSxDQUFDLENBQUE7SUFDdEUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBbUIsUUFBUSxDQUFDLENBQUE7SUFDdEUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBbUIsUUFBUSxDQUFDLENBQUE7SUFDdEUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBbUIsT0FBTyxDQUFDLENBQUE7SUFFcEUsTUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFtQixtQkFBbUIsQ0FBQyxDQUFBO0lBQ3RGLE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBbUIscUJBQXFCLENBQUMsQ0FBQTtJQUMxRixNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQW1CLG1CQUFtQixDQUFDLENBQUE7SUFFdEYsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFLENBQUM7UUFBQyxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFBQyxDQUFDO0lBQy9FLElBQUksV0FBVyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0lB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