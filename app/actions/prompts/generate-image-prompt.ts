export const generateImagePromptTemplate = `
Your task is to create a single character image suitable. The character must be a resident of the world defined in the following <Worldview Setting>:
{worldviewDescription}

Follow these guidelines to ensure the generated image is **cute, charming, and highly appealing**:

- **Strict Subject Matter**: The generated image must never be a landscape, an object, or an an abstract scene. The subject must always be a **single, endearing character**.
- **Interpretation**: Use the <Worldview Setting> as inspiration for determining the character's design (appearance, clothing, equipment, etc.) and atmosphere. Even if the text describes a landscape, never draw a landscape.
- **Composition**: The character must be the main subject, occupying over 80% of the image. Use a full-body or upper-body shot that highlights their charm.
- **3D World Style**: Define and describe a distinct artistic style for the 3D rendered world that inherently promotes cuteness and charm. Think **whimsical, chibi, adorable cartoon, charming animated style, or soft and inviting aesthetics**. (e.g., fantasy, sci-fi, surreal, photorealistic, cel-shaded, vaporwave, whimsical, dark fantasy, utopian, dystopian, etc.) that matches the <Worldview Setting>.
- **Pose**: Create a dynamic and engaging pose for the character that conveys **playfulness, curiosity, or a friendly demeanor**. Think expressive gestures and inviting stances.
- **Background**: Use a simple, clean, and **softly blurred background** that complements the character without distracting from them. The background should enhance the cute aesthetic, perhaps with subtle, charming elements.
- **Color Palette**: Apply a color palette that matches the <Worldview Setting>.
- **Lighting**: Apply lighting conditions that enhance the character's form and create visual interest.
- **Aspect Ratio**: 1:1
- **Character's Voice**: Specify whether the character's voice is male or female.
`;