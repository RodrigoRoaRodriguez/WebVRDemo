import * as THREE from 'three'
import dat from 'dat-gui'
import WAGNER from '@superguigui/wagner/'
import AbstractApplication from 'scripts/views/AbstractApplication'
import AbstractVRApplication from 'scripts/views/AbstractVRApplication'
import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import ZoomBlurPassfrom from '@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import _ from 'lodash'
const glslify = require('glslify')
const skyVert = glslify('./../shaders/sky.vert')
const skyFrag = glslify('./../shaders/sky.frag')

class Main extends AbstractVRApplication  {
// class Main extends AbstractApplication {

    constructor() {
        super();
        //Add sky-dome.
        //TODO: Make a proper sky-box
        var geometry = new THREE.SphereGeometry(1000, 0,0);

        var texture = new THREE.TextureLoader().load( 'textures/bg.jpg' );
        var uniforms = {
          texture: { type: 't', value: texture }
        };

        var material = new THREE.ShaderMaterial( {
          uniforms:       uniforms,
          vertexShader:   skyVert,
          fragmentShader: skyFrag
        })

        let skyBox = new THREE.Mesh(geometry, material)
        skyBox.scale.set(-1, 1, 1)
        skyBox.rotation.order = 'XZY'
        skyBox.renderDepth = 1000.0
        this.scene.add(skyBox);

        this.cubes = [];

        this.params = {
            usePostProcessing: false,
            useFXAA: true,
            useBlur: true,
            useBloom: true
        };

        var lights = [
          new THREE.AmbientLight( 0x202044 ), // soft white light
          new THREE.PointLight(0xffdd88, 1),
          new THREE.PointLight(0x88ccff, .5)
        ]
        lights[1].position.set(-500, 990, 0)
        lights[2].position.set(500, 750, 0)

        lights.forEach(light =>this._scene.add(light))

        // TODO: create 12 colored materials.
        this.materials = []

        for (var i = 0; i < 12; i++) {
          this.materials.push(new THREE.MeshLambertMaterial({
                color:new THREE.Color(`hsl(${30*i}, 90%, 65%)`),
                blending:THREE.AdditiveBlending,
                opacity: 0.8,
                transparent: true,
              }))
        }

        let model;
        for (let i = 0; i < 100; i++) {
            model = this.add3DModel();
            this.cubes.push(model);
            this.scene.add(model);
        }

        this.initPostprocessing();
        // this.initGui();

        this.animate();

    }

    add3DModel() {
      //TODO: Replace with low poly wine glasses
        let geometry = new THREE.Mesh(new THREE.TetrahedronGeometry(50,1), this.materials[_.random(11)]);
        geometry.position.set(
            _.random(75,750)* (Math.random() < 0.5 ? -1 : 1),
            _.random(75,750)* (Math.random() < 0.5 ? -1 : 1),
            _.random(75,750)* (Math.random() < 0.5 ? -1 : 1)
        )
        geometry.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        )
        return geometry
    }

    initPostprocessing() {
        this._renderer.autoClearColor = true;
        this.composer = new WAGNER.Composer(this._renderer);
        this.fxaaPass = new FXAAPass();
        this.boxBlurPass = new BoxBlurPass(.1, .1);
        this.bloomPass = new MultiPassBloomPass({
            blurAmount: .2,
            applyZoomBlur: true
        });
    }

    initGui() {
        const gui = new dat.GUI();
        gui.add(this.params, 'usePostProcessing');
        gui.add(this.params, 'useFXAA');
        gui.add(this.params, 'useBlur');
        gui.add(this.params, 'useBloom');
        return gui;
    }

    animate() {
        super.animate();
        for (let i = 0; i < this.cubes.length; i++) {
            this.cubes[i].rotation.y += 0.01 + ((i - this.cubes.length) * 0.00001);
            this.cubes[i].rotation.x += 0.01 + ((i - this.cubes.length) * 0.00001);
        }

        // this.scene.remove(this.cubes.pop())

        if (this.params.usePostProcessing) {
            this.composer.reset();
            this.composer.render(this._scene, this._camera);
            if (this.params.useFXAA) this.composer.pass(this.fxaaPass);
            if (this.params.useBlur) this.composer.pass(this.boxBlurPass);
            if (this.params.useBloom) this.composer.pass(this.bloomPass);
            this.composer.toScreen();
        }
        else {
            this._renderer.render(this._scene, this._camera);
        }



    }

}
export default Main;
