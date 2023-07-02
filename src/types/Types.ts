export type RecipeType = {
    id: string
    title: string
    ingredients: string[]
    methods: string[]
    cookingTime: number
    createdBy: { id: string; displayName: string; photoUrl: string }
}

export type OptionsType = {
    method: string
    headers: {
        "Content-Type": string
    }
    body: string
}

export type FormInputProps = {
    id: string
    name: string
    type: "text" | "password" | "email" | "number"
    placeholder?: string
    required: boolean
    inputClassName: string
    labelClassName?: string
    label?: string
}

export type ToastTypes = "info" | "success" | "warning" | "error" | "default"
