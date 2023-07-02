import Title from "../components/Title"
import { useContext, useRef } from "react"
import { FormContext } from "../context/FormContext"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"
import { ThemeContext } from "../context/ThemeContext"
import Button from "../components/Button"
import { AiFillDelete } from "react-icons/ai"
import { CurrentUserContext } from "../context/CurrentUserContext"
import { getErrorMessage } from "../lib/getErrorMessage"
import { ToastContext } from "../context/ToastContext"
import {AiOutlineClose} from 'react-icons/ai'

export default function Create() {
    const {
        state: { currentUser },
    } = useContext(CurrentUserContext)
    const { state: themeState } = useContext(ThemeContext)
    const { state, dispatch } = useContext(FormContext)
    const ingredientRef = useRef<HTMLInputElement>(null)
    const methodRef = useRef<HTMLInputElement>(null)
    const { setToastNotify } = useContext(ToastContext)
    let navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if (state.methods.length === 0 || state.ingredients.length === 0)
                throw new Error("You have to write atleast 1 method!")
            const docRef = await addDoc(collection(db, "recipes"), {
                ...state,
                createdAt: serverTimestamp(),
                createdBy: currentUser
                    ? {
                          id: currentUser.uid,
                          displayName: currentUser.displayName,
                          photoUrl: currentUser.photoURL,
                      }
                    : {
                          id: "unknown",
                          displayName: "Anonymous",
                          photoUrl:
                              "https://cdn.vectorstock.com/i/preview-1x/48/06/image-preview-icon-picture-placeholder-vector-31284806.jpg",
                      },
            })
            dispatch({ type: "CLEAR_FORM_STATE" })
            if (docRef) {
                setToastNotify({
                    toastType: "success",
                    toastMessage: "Recipe has been added!",
                })
                navigate("/")
            }
        } catch (err) {
            const errMessage = getErrorMessage(err)
            setToastNotify({ toastType: "error", toastMessage: errMessage })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "CHANGE_INPUT",
            payload: {
                name: e.target.name,
                value:
                    e.target.name === "cookingTime"
                        ? parseFloat(e.target.value)
                        : e.target.value.toLocaleLowerCase(),
            },
        })
    }

    const handleAddMethod = () => {
        if (methodRef.current) {
            dispatch({
                type: "ADD_METHOD",
                payload: methodRef.current.value.toLocaleLowerCase(),
            })
            methodRef.current.value = ""
        }
    }

    const updateIngredientsInput = (ingredient: string) => {
        if (ingredientRef.current) {
            const inputs = ingredientRef.current.value
                .split(",")
                .map((word) => word.trim())
            const newInputs = inputs
                .filter((item) => item !== ingredient)
                .join(", ")
            ingredientRef.current.value = newInputs
        }
    }

    return (
        <div
            className={`sm:max-w-[70%] lg:max-w-[55%] mx-auto w-full grid place-items-center ${
                themeState.theme === "dark"
                    ? "text-slate-300"
                    : "text-slate-500"
            }`}
        >
            <Title
                type="colorful"
                className="text-2xl sm:text-3xl"
                text="Add a New Recipe"
            />
            <form
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        return false
                    }
                }}
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-3 items-center mt-6"
            >
                <span className="flex flex-col gap-0.5 sm:gap-1 sm:text-xl w-full">
                    <label className=" cursor-pointer" htmlFor="recipe">
                        Recipe title:
                    </label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="recipe"
                        name="title"
                        required
                        className={`p-3 duration-300 rounded-md outline outline-[1px] ${
                            themeState.theme === "dark"
                                ? "bg-gray-400 outline-gray-500 text-gray-100"
                                : "bg-white outline-slate-200"
                        }`}
                    />
                </span>
                <span className="flex flex-col gap-0.5 sm:gap-1 sm:text-xl w-full">
                    <label className=" cursor-pointer" htmlFor="ingredients">
                        Recipe Ingredients:
                    </label>

                    <input
                        ref={ingredientRef}
                        placeholder="Seperate with ',' e.g., carrot, garlic, salt, pepper"
                        onChange={(e) =>
                            dispatch({
                                type: "ADD_INGREDIENT",
                                payload: e.target.value,
                            })
                        }
                        required
                        type="text"
                        id="ingredients"
                        name="ingredients"
                        className={`p-3 duration-300 rounded-md outline outline-[1px] ${
                            themeState.theme === "dark"
                                ? "bg-gray-400 outline-gray-500 text-gray-100"
                                : "bg-white outline-slate-200"
                        }`}
                    />
                    {state.ingredients.length >= 1 && (
                        <div className="flex gap-4 text-base mt-2">
                            <p
                                className={`${
                                    themeState.theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-400"
                                }`}
                            >
                                Ingredients:
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                {state.ingredients.map((ingredient) => (
                                    <span
                                        key={ingredient}
                                        className={`italic px-1.5 flex gap-1 items-center rounded-md ${
                                            themeState.theme === "dark"
                                                ? "bg-gray-500 text-gray-300"
                                                : `${themeState.color} text-white opacity-70`
                                        }`}
                                    >
                                        {ingredient}
                                        <button
                                        type="button"
                                        onClick={() => {
                                            dispatch({
                                                type: "REMOVE_INGREDIENT",
                                                payload: ingredient,
                                            })
                                            updateIngredientsInput(ingredient)
                                        }}
                                        className="text-sm p-1">
                                        <AiOutlineClose/>

                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </span>
                <span className="flex flex-col gap-0.5 sm:gap-1 sm:text-xl w-full">
                    <label className=" cursor-pointer" htmlFor="recipe">
                        Recipe method:
                    </label>
                    <span className="flex gap-3 w-full">
                        <input
                            placeholder="e.g., Prepare 420 kgs of meat"
                            ref={methodRef}
                            className={`p-3 duration-300 rounded-md outline w-full outline-[1px] ${
                                themeState.theme === "dark"
                                    ? "bg-gray-400 outline-gray-500 text-gray-100"
                                    : "bg-white outline-slate-200"
                            }`}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    handleAddMethod()
                                }
                            }}
                            name="method"
                            id="method"
                        ></input>
                        <Button
                            type="button"
                            style="fill"
                            onclick={() => {
                                handleAddMethod()
                            }}
                            className="px-8"
                        >
                            add
                        </Button>
                    </span>
                    {state.methods.length >= 1 && (
                        <div className="flex flex-col gap-4 text-base mt-2">
                            <p
                                className={`${
                                    themeState.theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-400"
                                }`}
                            >
                                Methods:
                            </p>

                            <div className="flex flex-col gap-2">
                                {state.methods.map((method, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-2"
                                    >
                                        <button
                                            onClick={() =>
                                                dispatch({
                                                    type: "REMOVE_METHOD",
                                                    payload: method,
                                                })
                                            }
                                            className={`flex-[1] mt-[3px] rounded-full h-[20px] aspect-[1/1] grid place-content-center text-white/75 ${
                                                themeState.theme === "dark"
                                                    ? "bg-slate-500"
                                                    : themeState.color
                                            }`}
                                        >
                                            <AiFillDelete />
                                        </button>
                                        <span className="flex-[1] text-center">{i+1}.</span>
                                        <p className="flex-[22] break-words">
                                            {method}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </span>
                <span className="flex flex-col gap-0.5 sm:gap-1 sm:text-xl w-full">
                    <label className="cursor-pointer" htmlFor="time">
                        Cooking time (minutes):
                    </label>
                    <input
                        onChange={handleChange}
                        type="number"
                        id="time"
                        name="cookingTime"
                        required
                        className={`p-3 duration-300 rounded-md outline outline-[1px] ${
                            themeState.theme === "dark"
                                ? "bg-gray-400 outline-gray-500 text-gray-100"
                                : "bg-white outline-slate-200"
                        }`}
                    />
                </span>

                <Button
                    type="submit"
                    style="fill"
                    className="mt-8 px-12 py-4 font-semibold"
                >
                    Submit
                </Button>
            </form>
        </div>
    )
}
