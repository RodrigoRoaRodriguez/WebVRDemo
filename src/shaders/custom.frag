import noise from 'glsl-noise/simplex/2d'

uniform float screenWidth;
uniform float screenHeight;

void main() {

    float x = gl_FragCoord.x/screenWidth;
    float y = gl_FragCoord.y/screenHeight;
    float z = gl_FragCoord.z; // Already in range [0,1]
    gl_FragColor = vec4(x*2.0,y*2.0, 0, 0.0);

}
