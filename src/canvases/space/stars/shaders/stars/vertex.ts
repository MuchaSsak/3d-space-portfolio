const starsVertexShader = /*glsl*/ `
uniform vec2 uResolution;

attribute float aSize;

void main() {
   // Final position
   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
   vec4 viewPosition = viewMatrix * modelPosition;
   vec4 projectedPosition = projectionMatrix * viewPosition;
   gl_Position = projectedPosition;
   
   // Point size
   // Tuned to match the look of the stars when they were baked into a cube map
   float size = 0.007;
   gl_PointSize = size * aSize * uResolution.y;
}
`;

export default starsVertexShader;
