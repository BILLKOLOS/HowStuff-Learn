import Lottie from "lottie-react";
import loveAnimation from "../assets/animations/love.json"; // Import animation file

const Animation = () => {
  return (
    <div>
      <Lottie animationData={loveAnimation} loop={true} />
    </div>
  );
};

export default Animation;
