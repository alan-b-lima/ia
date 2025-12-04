import GoalAgent from "./agents/present/goal.ts"
import LearningAgent from "./agents/present/learning.ts"
import ModelBasedReflexAgent from "./agents/present/model.ts"
import SimpleReflexAgent from "./agents/present/simple.ts"
import UtilityAgent from "./agents/present/utility.ts"
import { AsyncTry } from "./error/try.ts"
import { Euclidean, Manhattan, ManhattanWithLookAhead, GreedySearch as GreddySearch } from "./maze/agent.ts"
import { MazeKeeper } from "./maze/keeper.ts"
import { Maze } from "./maze/maze.ts"
import { Orquestrator, Simulator } from "./tabs.ts"

const Agents = {
    "agente reativo simples": "SimpleReflexAgent",
    "agente reativo baseado em modelo": "ModelBasedAgent",
    "agente orientado a objetivo por profundidade": "DepthGoalAgent",
    "agente orientado a objetivo por largura": "BreadthGoalAgent",
    "agente orientado a objetivo por profundidade com memória": "DepthGoalAgentWithMemory",
    "agente orientado a objetivo por largura com memória": "BreadthGoalAgentWithMemory",
    "agente orientado a utilidade euclidiana": "EuclideanUtilityAgent",
    "agente orientado a utilidade com Manhattan": "ManhattanUtilityAgent",
    "agente orientado a utilidade com Manhattan espião": "ManhattanUtilityAgentWithLookAhead",
    // "agente de aprendizado por reforço": "ReinforcementLearningAgent",
} as const

const Mazes = {
    "aleatório": "./mazes/random.txt",
    "aleatório 2": "./mazes/random_2.txt",
    "aleatório 3": "./mazes/random_3.txt",
    "aneis": "./mazes/rigns.txt",
    "campo": "./mazes/field.txt",
    "colmeia": "./mazes/hive.txt",
    "espiral": "./mazes/spiral.txt",
    "estrela": "./mazes/star.txt",
    "gigante": "./mazes/gigantic.txt",
    "gigante 2": "./mazes/gigantic_2.txt",
    "onda": "./mazes/wave.txt",
} as const

function main(): void {
    const orq = new_orquestrator()
    setup_navigation(orq)
}

const AgentFactory: Record<typeof Agents[keyof typeof Agents], (maze: Maze) => Simulator> = {
    SimpleReflexAgent: (maze: Maze) => new SimpleReflexAgent(maze),
    ModelBasedAgent: (maze: Maze) => new ModelBasedReflexAgent(maze, GreddySearch.bind(null, maze, Manhattan)),

    DepthGoalAgent: (maze: Maze) => new GoalAgent(maze, "DFS", false),
    DepthGoalAgentWithMemory: (maze: Maze) => new GoalAgent(maze, "DFS", true),

    BreadthGoalAgent: (maze: Maze) => new GoalAgent(maze, "BFS", false),
    BreadthGoalAgentWithMemory: (maze: Maze) => new GoalAgent(maze, "BFS", true),

    EuclideanUtilityAgent: (maze: Maze) => new UtilityAgent(maze, Euclidean),
    ManhattanUtilityAgent: (maze: Maze) => new UtilityAgent(maze, Manhattan),
    ManhattanUtilityAgentWithLookAhead: (maze: Maze) => new UtilityAgent(maze, ManhattanWithLookAhead.bind(null, maze)),
    // ReinforcementLearningAgent: (maze: Maze) => new LearningAgent(maze),
} as const

function new_orquestrator() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")
    if (canvas === null) {
        throw new Error("there must be a #canvas element")
    }

    const ctx = canvas.getContext('2d')
    if (ctx === null) {
        throw new Error("fail to get 2d context")
    }

    return new Orquestrator(ctx)
}

function setup_navigation(orq: Orquestrator) {
    const navbar = document.querySelector<HTMLElement>("#navbar")
    if (navbar === null) {
        throw new Error("there must be a #navbar element")
    }

    const new_tab = document.querySelector<HTMLElement>("#new-tab")
    if (new_tab === null) {
        throw new Error("there must be a #new-tab element")
    }

    const dialog = document.querySelector<HTMLDialogElement>("#dialog")
    if (dialog === null) {
        throw new Error("there must be a #dialog element")
    }

    const form = dialog.querySelector("form")
    if (form === null) {
        throw new Error("there must be a #dialog form element")
    }

    const tab_input = form.querySelector<HTMLSelectElement>("#tab")
    if (tab_input === null) {
        throw new Error("there must be a #dialog form #tab form element")
    }

    {
        const agent_select = form.querySelector<HTMLSelectElement>("#agent")
        if (agent_select === null) {
            throw new Error("there must be a #dialog form #agent form element")
        }
        for (const agent in Agents) {
            const option = document.createElement("option")
            option.value = (Agents as Record<string, string>)[agent]
            option.textContent = agent

            agent_select.append(option)
        }

        const maze_select = form.querySelector<HTMLSelectElement>("#maze")
        if (maze_select === null) {
            throw new Error("there must be a #dialog form #agent form element")
        }
        for (const maze in Mazes) {
            const option = document.createElement("option")
            option.value = (Mazes as Record<string, string>)[maze]
            option.textContent = maze

            maze_select.append(option)
        }

        const cancel = form.querySelector("#cancel")
        if (cancel === null) {
            throw new Error("there must be a #dialog form #cancel button")
        }
        cancel.addEventListener("click", function (event) {
            event.preventDefault()
            dialog.close()
        })

        const submit = form.querySelector("#submit")
        if (submit === null) {
            throw new Error("there must be a #dialog form #submit button")
        }
        submit.addEventListener("click", function (event) {
            event.preventDefault()
            form.requestSubmit()
        })
    }

    const mazes = new MazeKeeper()
    let count = 0

    new_tab.addEventListener("click", async function () {
        form.reset()
        tab_input.value = `Agente ${count + 1}`

        await new Promise<void>(function (resolve) {
            dialog.onclose = function (event) {
                event.preventDefault()
                resolve()
            }

            form.oncancel = function (event) {
                event.preventDefault()
                resolve()
            }

            form.onsubmit = async function (event) {
                event.preventDefault()
                await insert_tab(orq, navbar, new_tab, form, mazes)
                resolve()
            }

            dialog.showModal()
        })

        dialog.onclose = null
        form.oncancel = null
        form.onsubmit = null

        count++
        dialog.close()
    })
}

async function insert_tab(orq: Orquestrator, navbar: HTMLElement, nav_tab: HTMLElement, form: HTMLFormElement, mazes: MazeKeeper): Promise<void> {
    const data = new FormData(form)
    const tab_name = data.get("tab") as string
    const agent_name = data.get("agent") as string
    const maze_name = data.get("maze") as string

    const [maze, error] = await AsyncTry(() => mazes.Fetch(maze_name))
    if (error !== null) {
        return
    }

    if (!Object.hasOwn(AgentFactory, agent_name)) {
        return
    }

    orq.Link(tab_name, (AgentFactory as Record<string, any>)[agent_name](maze))
    orq.SwapTo(tab_name)

    const tab = document.createElement("div")
    tab.addEventListener("click", handle_navbar_click.bind(null, orq, navbar, tab))
    tab.dataset["name"] = tab_name
    tab.classList.add("tab")

    const name = document.createElement("span")
    name.textContent = tab_name

    const close = document.createElement("button")
    close.addEventListener("click", handle_close_click.bind(null, orq, navbar, tab))
    close.textContent = "×"

    tab.append(name, close)
    navbar.insertBefore(tab, nav_tab)

    handle_navbar_click(orq, navbar, tab)
}

function handle_navbar_click(orq: Orquestrator, navbar: HTMLElement, option: HTMLElement) {
    const tab_name = option.dataset["name"]
    if (tab_name === undefined) {
        return
    }

    if (!orq.SwapTo(tab_name)) {
        return
    }

    const options = navbar.querySelectorAll<HTMLElement>(".tab")
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("selected")
    }
    option.classList.add("selected")
}

function handle_close_click(orq: Orquestrator, navbar: HTMLElement, option: HTMLElement) {
    navbar.removeChild(option)

    const tab_name = option.dataset["name"]
    if (tab_name === undefined) {
        return
    }

    orq.Unlink(tab_name)

    const current = orq.Current()
    if (current === undefined) {
        return
    }

    const options = navbar.querySelectorAll<HTMLElement>(".tab")
    for (let i = 0; i < options.length; i++) {
        if (options[i].dataset["name"] === current) {
            options[i].classList.add("selected")
            return
        }
    }
}

window.addEventListener("DOMContentLoaded", main, { once: true })
