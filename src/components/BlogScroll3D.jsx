import React, { useRef, useCallback } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { useDrag, useWheel } from "@use-gesture/react";

const CarouselContainer = styled.div`
  perspective: 1600px;
  overflow: hidden;
  width: 100vw;
  height: 450px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -50px;
  touch-action: none;
`;

const CarouselTrack = styled(animated.div)`
  width: 100%;
  max-width: 700px;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  margin: 0 auto;
`;

const Card = styled(animated.a)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex: 0 0 250px;
  width: clamp(240px, 70vw, 350px);
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 14px cyan;
  text-decoration: none;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: grab;
  transition: 0.7s;
  &:active {
    cursor: grabbing;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardTitle = styled.h5`
  padding: 1rem;
  font-size: 1.1rem;
  text-align: center;
  margin: 0;
  background: darkslategray;
`;

const BlogScroll3D = ({ blogs }) => {
  const CARD_WIDTH = 350;
  const NUM_CARDS = blogs.length;

  const ANGLE_PER_CARD = 360 / NUM_CARDS;
  const RADIUS = CARD_WIDTH / 2 / Math.tan(Math.PI / NUM_CARDS);

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
          return angle < 35 || angle > 300 ? 1 : 0.2;
        }),

        transform: carouselRotation.to((r) => {
          const angle = cardIndex * ANGLE_PER_CARD;
          return `
            translateX(-50%)
            translateY(-50%)
            rotateY(${angle}deg)
            translateZ(${dynamicTranslateZ}px)
          `;
        }),
        scale: carouselRotation.to((r) => {
          const angle = (cardIndex * ANGLE_PER_CARD + r) % 360;
          return 1 - (Math.abs(angle - 180) / 180) * 0.15;
        }),
      };
    },
    [carouselRotation, ANGLE_PER_CARD, RADIUS]
  );

  useDrag(
    ({ down, movement: [mx], velocity: [vx], direction: [dx] }) => {
      const flickSpeed = 0.5;
      const delta = mx * 0.2;
      if (!down && Math.abs(vx) > flickSpeed) {
        const snapTo = carouselRotation.get() + dx * 150;
        api.start({
          carouselRotation:
            Math.round(snapTo / ANGLE_PER_CARD) * ANGLE_PER_CARD,
        });
      } else if (!down) {
        const snapTo =
          Math.round(carouselRotation.get() / ANGLE_PER_CARD) * ANGLE_PER_CARD;
        api.start({ carouselRotation: snapTo });
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
          <CardImage src={blogs[0].image} alt={blogs[0].title} />
          <CardTitle>{blogs[0].title}</CardTitle>
        </Card>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer>
      <CarouselTrack
        style={{ transform: carouselRotation.to((r) => `rotateY(${r}deg)`) }}
      >
        {blogs.map((blog, index) => {
          const { zIndex, transform, scale, opacity } = getCardProps(index);
          return (
            <Card
              key={index}
              href={blog.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                zIndex,
                transform,
                scale,
                opacity,
                filter: opacity.to((o) => `blur(${(1 - o) }px)`),
              }}
            >
              <CardImage src={blog.image} alt={blog.title} />
              {/* <CardTitle>{blog.title}</CardTitle> */}
            </Card>
          );
        })}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default BlogScroll3D;
