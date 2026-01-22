import { StarIcon } from "../Icons/Star";

export default function StarRating({length, user = {rating: 5, ratingCount: 999}, showRatingCount = false}: {length: "short" | "long", user: {rating: number, ratingCount: number},  showRatingCount?: boolean}){
    const stars = 5;
    // const rating = 3;
    // const ratings = 3;
    return(
        <div className="flex text-black font-normal">
            {length === "short" &&
                <p className="flex items-center">
                    <p className="text-sm">{user.rating}</p>
                    <StarIcon key="rating" className="size-5 text-yellow-400 fill-yellow-300"/>
                    {showRatingCount && <p className="text-sm text-gray-400">{user.ratingCount}</p>}
                </p>
            }
            {length === "long" &&
                <p className="flex items-center">
                    {Array.from({ length: stars}, (_, index) => (
                        <StarIcon
                            key={index}
                            className={`size-5 ${index < user.rating ? "text-yellow-400 fill-yellow-300" : "text-gray-300"}`} 
                        />
                    ))}
                </p>
            } 
        </div>
    )
}