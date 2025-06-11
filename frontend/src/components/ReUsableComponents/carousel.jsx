import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BoardBG from "../../assets/png/board_bg.png";
import { useNavigate } from "react-router-dom";



const CardCarousel = ({boards, showArrows}) => {
    const navigate = useNavigate()
    const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };
  return (
    <div>
      <div className="w-full">
        <Carousel
          responsive={responsive}
          arrows={showArrows}
          infinite={true}
          autoPlay={false}
          containerClass="py-5"
        >
          {boards.map((board, index) => (
            <div
              key={index}
              className="w-[85%]  h-auto border relative rounded-lg cursor-pointer"
              onClick={()=>navigate(`/kanban/${board.id}`)}
            >
              <p className="absolute p-2 text-white bold ">{board.title}</p>
              <img
                src={board.background_image || BoardBG}
                alt=""
                className="border rounded-lg w-full h-[10rem] "
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CardCarousel;
