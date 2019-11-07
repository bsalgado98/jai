var GlowShader = {

    uniforms: {

    },

    vertexShader: [
        "attribute vec4 vPosition;",
        "void main (void) {",
            "gl_Position = vPosition;",
        "}",
    ].join("\n"),

    fragmentShader: [
        "precision highp float;",

        "uniform float time;",
        "uniform vec2 mouse;",
        "uniform vec2 resolution;",

        "float ball(vec2 p, float fx, float fy, float ax, float ay) {",
            "vec2 r = vec2(p.x + cos(time * fx) * ax, p.y + sin(time * fy) * ay);",	
            "return 0.09 / length(r);",
        "}",

        "void main() {",
            "vec2 q = gl_FragCoord.xy / resolution.xy;",
            "vec2 p = -1.0 + 2.0 * q;"	,
            "p.x	*= resolution.x / resolution.y;",

            "float col = 0.0;",
            "col += ball(p, 1.0, 2.0, 0.1, 0.2);",
            "col += ball(p, 1.5, 2.5, 0.2, 0.3);",
            "col += ball(p, 2.0, 3.0, 0.3, 0.4);",
            "col += ball(p, 2.5, 3.5, 0.4, 0.5);",
            "col += ball(p, 3.0, 4.0, 0.5, 0.6);",
            "col += ball(p, 1.5, 0.5, 0.6, 0.7);",
            
            "gl_FragColor = vec4(col, col * 0.3, col, 1.0);",
        "}",
    ].join("\n")
            
};
export { GlowShader };