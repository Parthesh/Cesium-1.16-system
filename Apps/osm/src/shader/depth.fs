
#ifdef GL_ES
  precision mediump float;
#endif

uniform float uFogDistance;
uniform float uFogBlurDistance;

varying float verticalDistanceToLowerEdge;

/* Note: the depth shader needs to not only store depth information, but
 *       also the fog intensity as well.
 * Rationale: In the current infrastructure, ambient occlusion does not 
 * directly affect the building and map shading, but rather is later blended 
 * onto the whole scene as a screen-space effect. This, however, is not
 * compatible with fogging: buildings in the fog gradually blend into the 
 * background, but the ambient occlusion applied in screen space does not.
 * In the foggy area, this yields barely visible buildings with fully visible
 * ambient occlusion - an irritating effect.
 * To fix this, the depth shader stores not only depth values per pixel, but
 * also computes the fog intensity and stores it in the depth texture along
 * with the color-encoded depth values.
 * This way, the ambient occlusion shader can later not only compute the
 * actual ambient occlusion based on the depth values, but can attenuate
 * the effect in the foggy areas based on the fog intensity.
 */

void main() {
  // 7500.0 is the position of the far plane in OSMBuildings
  float depth = (gl_FragCoord.z / gl_FragCoord.w)/7500.0;
  if (depth > 1.0)
    depth = 1.0;
    
  float z = floor(depth*256.0)/256.0;
  depth = (depth - z) * 256.0;
  float z1 = floor(depth*256.0)/256.0;
  depth = (depth - z) * 256.0;
  float z2 = floor(depth*256.0)/256.0;

  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;
  fogIntensity = clamp(fogIntensity, 0.0, 1.0);

  // option 1: this line outputs high-precision (24bit) depth values
  gl_FragColor = vec4(z, z1, z2, fogIntensity);
  
  // option 2: this line outputs human-interpretable depth values, but with low precision
  //gl_FragColor = vec4(z, z, z, 1.0); 

}
