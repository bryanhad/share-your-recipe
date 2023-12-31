import Title from "../../components/Title"
import RecipeCard from "../../components/RecipeCard"
import Loading from "../../components/Loading"
import ErrorMessage from "../../components/ErrorMessage"
import CreateYourOwn from "./CreateYourOwn"
import ThemedContainer from "../../components/ThemedContainer"
import CoverAndProfilePic from "./customizable/CoverAndProfilePic"
import getCurrentUserData from "../../lib/getCurrentUserData"
import QuoteForm from "./customizable/QuoteForm"
import PaddingWrapper from "../../components/PaddingWrapper"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"

export default function MyProfilePage() {
    const {userState} = useContext(UserContext)
    const { userRecipes, loading, error } = getCurrentUserData()

    return (
        <>
            {loading && <Loading basicLarge iconClassName="mt-[200px]" />}
            {error && <ErrorMessage errorMessage={error} noGoHomeButton />}
            {userState && !loading && (
                <div className="relative w-full">
                    <CoverAndProfilePic userData={userState} className="z-[2]" />
                    <section className="relative z-[1] pb-8">
                        <PaddingWrapper>
                            <div className="pt-[8vw] sm:pt-[70px] ">
                                <ThemedContainer className="mx-auto flex max-w-[500px] flex-col items-center gap-2 px-5 pb-4 pt-2">
                                    <h1 className="font-bold">
                                        {userState.displayName}
                                    </h1>
                                    <QuoteForm
                                        currentUserQuote={userState.quote}
                                    />
                                </ThemedContainer>

                                <div className="mt-4">
                                    <Title
                                        text="Recipes"
                                        type="normal"
                                        className="mx-auto mb-3 max-w-max text-2xl"
                                    />
                                    {userRecipes.length === 0 ? (
                                        <CreateYourOwn />
                                    ) : (
                                        <div className="flex flex-wrap justify-center gap-5 max-sm:px-2">
                                            {userRecipes.map((recipe) => (
                                                <RecipeCard
                                                    key={recipe.id}
                                                    recipe={recipe}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </PaddingWrapper>
                    </section>
                </div>
            )}
        </>
    )
}
