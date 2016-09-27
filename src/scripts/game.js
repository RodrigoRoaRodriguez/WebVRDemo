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

class Main extends AbstractVRApplication  {
// class Main extends AbstractApplication {

    constructor() {
        super();
        this.cubes = [];

        this.params = {
            usePostProcessing: true,
            useFXAA: true,
            useBlur: true,
            useBloom: true
        };

        const light = new THREE.PointLight(0xFFFFFF, 1);
        light.position.copy(this._camera.position);
        this._scene.add(light);
        //TODO: create 12 colored materials.
        this.materials = []
        for (var i = 0; i < 12; i++) {
          this.materials.push(new THREE.MeshPhongMaterial({
            color:new THREE.Color(`hsl(${30*i}, 90%, 65%)`),
            // shading:THREE.FlatShading,
            opacity: 0.5,
            transparent: true,
            shininess:500
          }))
        }

        let model;
        for (let i = 0; i < 500; i++) {
            model = this.add3DModel();
            this.cubes.push(model);
            this._scene.add(model);
        }
        //model.position.set(0, 0, 50);
        this.initPostprocessing();
        // this.initGui();

        this.animate();

    }

    add3DModel() {
      //TODO: Replace with low poly wine glasses
        let geometry = new THREE.Mesh(new THREE.OctahedronGeometry(50,2), this.materials[_.random(12)]);
        geometry.position.set(
            _.random(50,750)* (Math.random() < 0.5 ? -1 : 1),
            _.random(50,750)* (Math.random() < 0.5 ? -1 : 1),
            _.random(50,750)* (Math.random() < 0.5 ? -1 : 1)
        );
        geometry.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        return geometry;
    }

    initPostprocessing() {
        this._renderer.autoClearColor = true;
        this.composer = new WAGNER.Composer(this._renderer);
        this.fxaaPass = new FXAAPass();
        this.boxBlurPass = new BoxBlurPass(3, 3);
        this.bloomPass = new MultiPassBloomPass({
            blurAmount: 3,
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
