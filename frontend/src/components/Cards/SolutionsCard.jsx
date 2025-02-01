import React from "react";
import './SolutionsCard.css';
const SolutionsCard = ({imageSrc, title, content}) => {
    return(
        <div className="solution-card">
            <img src= {imageSrc} alt={title} />
            <h2>{title}</h2>
            <p>{content}</p>

        </div>
    )
}
export default SolutionsCard;