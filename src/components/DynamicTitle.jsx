import React, { useRef, useCallback } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { useDrag, useWheel } from "@use-gesture/react";

// const CarouselContainer = styled.div`
//   position: relative;
//   perspective: 1600px;
//   overflow: hidden;
//   width: 100%;
//   height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   touch-action: none;
//   top: -500px;
// `;
const CarouselContainer = styled.div`
  position: absolute;
  perspective: 1600px;
  overflow: hidden;
  width: 100%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  top: 90px;
`;

const CarouselTrack = styled(animated.div)`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
`;

const Card = styled(animated.a)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(240px, 70vw, 350px);
  height: clamp(120px, 20vh, 160px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 0 20px rgba(255, 105, 180, 0.4);
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition: 0.7s;
  &:active {
    cursor: grabbing;
  }
`;

const StyledH1Title = styled.h1`
  padding: 1rem;
  font-size: clamp(1rem, 2.5vw, 1.8rem);
  text-align: center;
  margin: 0;
  color: white;
  background: darkslategray;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const DynamicTitle = ({ blogs }) => {
  const CARD_HEIGHT = Math.max(window.innerHeight * 0.25, 350);
  const NUM_CARDS = blogs.length;

  if (NUM_CARDS === 0)
    return <p style={{ textAlign: "center" }}>No blog posts to display.</p>;

  if (NUM_CARDS === 1) {
    return (
      <CarouselContainer>
        <Card
          href={blogs[0].link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transform: "none",
            position: "relative",
            top: "auto",
            left: "auto",
            margin: "auto",
            cursor: "default",
          }}
        >
          <StyledH1Title>{blogs[0].title}</StyledH1Title>
        </Card>
      </CarouselContainer>
    );
  }

  const ANGLE_PER_CARD = 360 / NUM_CARDS;
  const RADIUS = CARD_HEIGHT / 2 / Math.tan(Math.PI / NUM_CARDS);

  const [{ carouselRotation }, api] = useSpring(() => ({
    carouselRotation: 0,
    config: { mass: 1, tension: 300, friction: 30 },
  }));

  const getCardProps = useCallback(
    (cardIndex) => {
      const currentTrackRotation = carouselRotation.get();
      let cardAngle = (cardIndex * ANGLE_PER_CARD + currentTrackRotation) % 360;
      if (cardAngle < 0) cardAngle += 360;

      const zIndex = Math.round(
        50 + 50 * Math.cos((cardAngle * Math.PI) / 180)
      );
      const dynamicTranslateZ = RADIUS + (Math.abs(cardAngle - 180) / 180) * 50;

      return {
        zIndex,
        opacity: carouselRotation.to((r) => {
          const angle = (cardIndex * ANGLE_PER_CARD + r + 360) % 360;
          return angle < 10 || angle > 350 ? 1 : 0.2;
        }),
        transform: carouselRotation.to((r) => {
          const angle = cardIndex * ANGLE_PER_CARD;
          return `
            translateX(-50%)
            translateY(-50%)
            rotateX(${angle}deg)
            translateZ(${dynamicTranslateZ}px)
          `;
        }),
      };
    },
    [carouselRotation, ANGLE_PER_CARD, RADIUS]
  );

  useDrag(
    ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      const flickSpeed = 0.5;
      const delta = my * 0.2;
      if (!down && Math.abs(vy) > flickSpeed) {
        const snapTo = carouselRotation.get() + dy * 150;
        api.start({
          carouselRotation:
            Math.round(snapTo / ANGLE_PER_CARD) * ANGLE_PER_CARD,
        });
      } else if (!down) {
        api.start({
          carouselRotation:
            Math.round(carouselRotation.get() / ANGLE_PER_CARD) *
            ANGLE_PER_CARD,
        });
      } else {
        api.start({
          carouselRotation: carouselRotation.get() + delta,
          immediate: true,
        });
      }
    },
    {
      eventOptions: { passive: false },
      filterTaps: true,
      from: () => [0, 0],
      target: window,
    }
  );

  useWheel(
    ({ active, delta: [, dy] }) => {
      const scrollSpeed = 0.5;
      const nextRotation = carouselRotation.get() + dy * scrollSpeed;
      api.start({ carouselRotation: nextRotation, immediate: true });

      if (!active) {
        const snapTo =
          Math.round(nextRotation / ANGLE_PER_CARD) * ANGLE_PER_CARD;
        api.start({ carouselRotation: snapTo });
      }
    },
    { eventOptions: { passive: false }, target: window }
  );

  return (
    <CarouselContainer>
      <CarouselTrack
        style={{ transform: carouselRotation.to((r) => `rotateX(${r}deg)`) }}
      >
        {blogs.map((blog, index) => {
          const { zIndex, transform, opacity } = getCardProps(index);
          return (
            <Card
              key={index}
              href={blog.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                zIndex,
                transform,
                opacity,
                filter: opacity.to((o) => `blur(${1 - o}px)`),
              }}
            >
              <StyledH1Title>{blog.title}</StyledH1Title>
            </Card>
          );
        })}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default DynamicTitle;
