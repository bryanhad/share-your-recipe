import SearchBar from "../SearchBar"
import { Link } from "react-router-dom"
import ChangeThemeIcon from "./ChangeThemeIcon"
import ChangeColorsButtons from "./ChangeColorsButtons"
import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"
import Profile_Login_SignUp from "./Profile-Login-SignUp"


export default function BurgerMenu({navState}:{navState:boolean}) {
    const { state, dispatch } = useContext(ThemeContext)
    return (
        <div
            className={`block lg:hidden duration-300 w-full overflow-hidden pr-3  ${
                navState ? "max-h-[220px]" : "max-h-[0px]"
            }`}
        >
            <div className="flex flex-col items-end gap-4 py-4">
                <SearchBar direction="left" />
                <Link to="create">
                    <button
                        type="button"
                        className="p-2 text-sm rounded-md outline outline-[1px] outline-white"
                    >
                        Create Recipe
                    </button>
                </Link>
                <div className="flex items-center gap-4">
                    <ChangeColorsButtons className="flex gap-4"/>
                    <ChangeThemeIcon themeState={state.theme} onClick={() => dispatch({type:'CHANGE_THEME'})}/>
                </div>
                <Profile_Login_SignUp/>
            </div>
        </div>
    )
}
