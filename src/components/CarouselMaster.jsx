import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web"; // For physics-based animations
import { useDrag, useWheel } from "@use-gesture/react"; // For drag and scroll gestures

// --- Styled Components (CSS-in-JS) ---
// These are slightly adjusted to work with react-spring's animated components
// and to prepare for more dynamic transforms.

const CarouselContainer = styled.div`
  perspective: 1600px; /* Stronger perspective for a more pronounced 3D effect */
  overflow: hidden; /* Hide overflow outside the carousel area */
  width: 100%;
  max-width: 100%;
  height: 450px; /* Slightly taller for more space */
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  touch-action: none; /* Prevents default touch behavior that conflicts with drag */
`;

const CarouselTrack = styled(animated.div)`
  /* Use animated.div for react-spring animation */
  width: 700px; /* Reference width for card positioning */
  height: 100%;
  position: relative;
  transform-style: preserve-3d; /* Crucial for 3D children */
  /* transform will be directly controlled by react-spring */
`;

const Card = styled(animated.a)`
  /* Use animated.a for react-spring animation */
  position: absolute;
  top: 50%;
  left: 50%;
  /* Transform will be calculated dynamically for each card */

  flex: 0 0 250px;
  width: 350px;
  height: 300px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 14px cyan;
  text-decoration: none;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: grab; /* Indicate it's draggable */
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
  color: white;
  background: darkslategray;
`;

// --- React Component ---
const BlogScroll3D = ({ blogs }) => {
  const containerRef = useRef(null); // Ref for the gesture binding

  const CARD_WIDTH = 350;
  const NUM_CARDS = blogs.length;

  // Handle case with 0 or 1 blogs
  if (NUM_CARDS === 0) {
    return <p style={{ textAlign: "center" }}>No blog posts to display.</p>;
  }
  if (NUM_CARDS === 1) {
    return (
      <CarouselContainer style={{ display: "block", height: "auto" }}>
        <Card
          href={blogs[0].link}
          target="_blank"
          rel="noopener noreferrer"
          // Reset styles for single card if it's the only one
          style={{
            position: "relative",
            transform: "none",
            margin: "auto",
            top: "auto",
            left: "auto",
            cursor: "default",
          }}
        >
          <CardImage src={blogs[0].image} alt={blogs[0].title} />
          <CardTitle>{blogs[0].title}</CardTitle>
        </Card>
      </CarouselContainer>
    );
  }

  const ANGLE_PER_CARD = 360 / NUM_CARDS;
  // Calculate radius for cards to form a circle
  const RADIUS = CARD_WIDTH / 2 / Math.tan(Math.PI / NUM_CARDS);

  // react-spring for animation
  // `carouselRotation` is the animated value (degrees) for the entire track
  const [{ carouselRotation }, api] = useSpring(() => ({
    carouselRotation: 0, // Initial rotation
    config: { mass: 1, tension: 300, friction: 30 }, // Physics properties for smooth animation
  }));

  // Function to calculate individual card transforms and z-index
  const getCardProps = useCallback(
    (cardIndex) => {
      // We need to use the _live_ value of carouselRotation from react-spring
      // For `animated` components, this is often handled by spring passing value to style prop.
      // Here, we calculate based on the current state of the spring.

      // Get the current value of the spring animation (not necessarily the target)
      const currentTrackRotation = carouselRotation.get();

      // Calculate the absolute angle of the current card relative to the viewer's front (0 degrees)
      let cardAngle = (cardIndex * ANGLE_PER_CARD + currentTrackRotation) % 360;
      if (cardAngle < 0) cardAngle += 360; // Ensure positive angle

      // Z-index calculation (cards in front have higher z-index)
      // Cosine is 1 at 0deg (front), 0 at 90deg, -1 at 180deg (back)
      const zIndex = Math.round(
        50 + 50 * Math.cos((cardAngle * Math.PI) / 180)
      );

      // Dynamic scale based on how far from the front the card is
      // Cards at the front (0deg) are full size, scale down as they move to the back (180deg)
      const scale = 1 - (Math.abs(cardAngle - 180) / 180) * 0.15; // Max 15% scale down

      // Dynamic translateZ based on angle to bring cards closer/further
      // Cards at the very front might come slightly forward, cards at the back recede
      // A more complex curve could be used here
      const dynamicTranslateZ = RADIUS + (Math.abs(cardAngle - 180) / 180) * 50; // Max 50px additional Z-depth
      //OPACITY
      const opacity = carouselRotation.to((r) => {
        const totalCardRotateY = cardIndex * ANGLE_PER_CARD;
        let currentCardAngle = (totalCardRotateY + r) % 360;
        if (currentCardAngle < 0) currentCardAngle += 360;

        return currentCardAngle < 35 || currentCardAngle > 300 ? 1 : 0.2;
      });
      return {
        zIndex: zIndex,
        opacity: opacity,
        // The individual card's rotation is its base angle
        // Its position is also affected by the overall carousel's rotation,
        // but `transform: rotateY()` in CSS stacks rotations.
        // So the combined effect is that each card rotates around the center.
        transform: carouselRotation.to((r) => {
          const totalCardRotateY = cardIndex * ANGLE_PER_CARD; // Fixed position in the circle
          return `
          translateX(-50%) 
          translateY(-50%) 
          rotateY(${totalCardRotateY}deg) 
          translateZ(${dynamicTranslateZ}px) 
        `;
        }),
        // Use the animated scale value directly from react-spring
        scale: carouselRotation.to((r) => {
          const totalCardRotateY = cardIndex * ANGLE_PER_CARD;
          let currentCardAngle = (totalCardRotateY + r) % 360;
          if (currentCardAngle < 0) currentCardAngle += 360;
          return 1 - (Math.abs(currentCardAngle - 180) / 180) * 0.15;
        }),
      };
    },
    [carouselRotation, ANGLE_PER_CARD, RADIUS]
  );

  // Gesture binding for mouse drag
  const bindDrag = useDrag(
    ({
      down,
      movement: [mx],
      velocity: [vx],
      direction: [dx],
      distance,
      cancel,
    }) => {
      // Calculate target rotation based on drag movement
      // A large `dx` or `vx` indicates a flick
      const flickSpeed = 0.5; // How much initial flick speed affects rotation
      const rotationDelta = mx * 0.2; // Convert pixel drag to rotation degrees (adjust sensitivity)

      if (!down && Math.abs(vx) > flickSpeed) {
        // When drag ends with a flick, calculate a target based on flick velocity
        const finalRotation = carouselRotation.get() + dx * 150; // Add extra rotation for flick
        api.start({
          carouselRotation:
            Math.round(finalRotation / ANGLE_PER_CARD) * ANGLE_PER_CARD,
        }); // Snap to nearest card
      } else if (!down) {
        // When drag ends without flick, snap to the nearest card
        const currentSnapRotation =
          Math.round(carouselRotation.get() / ANGLE_PER_CARD) * ANGLE_PER_CARD;
        api.start({ carouselRotation: currentSnapRotation });
      } else {
        // While dragging, directly update rotation
        api.start({
          carouselRotation: carouselRotation.get() + rotationDelta,
          immediate: true,
        });
      }
    },
    { eventOptions: { passive: false }, filterTaps: true, from: () => [0, 0] } // Passive false allows preventDefault if needed
  );

  // Gesture binding for mouse wheel scroll
  const bindWheel = useWheel(
    ({ active, delta: [, dy] }) => {
      const scrollSpeed = 0.5; // Adjust sensitivity
      const newRotation = carouselRotation.get() + dy * scrollSpeed;
      api.start({ carouselRotation: newRotation, immediate: true });

      if (!active) {
        // When scroll ends, snap to nearest card
        const currentSnapRotation =
          Math.round(carouselRotation.get() / ANGLE_PER_CARD) * ANGLE_PER_CARD;
        api.start({ carouselRotation: currentSnapRotation });
      }
    },
    { eventOptions: { passive: false }, target: window } // <-- Added target: window
  );

  return (
    <>
      {/*  this effect limits to container */}
      {/* <CarouselContainer ref={containerRef} {...bindDrag()} {...bindWheel()}> */}
      <CarouselContainer ref={containerRef}>
        {" "}
        {/* Removed gesture bindings here */}
        <CarouselTrack
          style={{
            transform: carouselRotation.to((r) => `rotateY(${r}deg)`),
          }}
        >
          {blogs.map((blog, index) => {
            const { zIndex, transform, scale, opacity } = getCardProps(index);
            return (
              <>
                <Card
                  key={index}
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Pass calculated styles directly to animated.Card
                  style={{
                    zIndex: zIndex,
                    opacity: opacity,
                    transform: transform,
                    scale: scale, // Apply scale as a separate animated property
                    // Hover effect can still be handled by CSS as a transition
                    // but for a true Webflow effect, hover would also be animated by react-spring.
                    // For simplicity, we keep the styled-components hover here.
                  }}
                >
                  <CardImage src={blog.image} alt={blog.title} />
                  <CardTitle>{blog.title}</CardTitle>
                </Card>
              </>
            );
          })}
        </CarouselTrack>
      </CarouselContainer>
    </>
  );
};

export default BlogScroll3D;
