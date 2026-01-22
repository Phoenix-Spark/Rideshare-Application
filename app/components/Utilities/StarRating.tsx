import { StarIcon } from "../Icons/Star";

export default function StarRating({length, user = {rating: 5, ratingCount: 1776}, showRatingCount = false}: {length: "short" | "long", user: {rating: number, ratingCount: number},  showRatingCount?: boolean}){
    const stars = 5;
    // const rating = 3;
    // const ratings = 3;

    function formatRatings(ratings: number){
        if(ratings >= 1000){
            const thousands = ratings / 1000;
            return thousands >= 10 
                ? Math.floor(thousands) + "k"  // 10k, 11k, etc.
                : (Math.floor(thousands * 10) / 10) + "k";  // 1.2k, 9.8k, etc.
        }
        return ratings;
    }
    
    return(
        <div className="flex text-black font-normal">
            {length === "short" &&
                <p className="flex items-center">
                    <p className="text-sm">{user.rating}</p>
                    <StarIcon key="rating" className="size-5 text-yellow-400 fill-yellow-300"/>
                    {showRatingCount && <p className="text-sm text-gray-400">{formatRatings(user.ratingCount)}</p>}
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