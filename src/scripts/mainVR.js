import * as THREE from 'three'
import AbstractVRApplication from 'scripts/views/AbstractVRApplication'

const glslify = require('glslify')
const shaderVert = glslify('./../shaders/custom.vert')
const shaderFrag = glslify('./../shaders/custom.frag')
const noiseMaterial = require('materials/noise')

class Main extends AbstractVRApplication {
    constructor(){

        super();

        var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

        var geometry = new THREE.BoxGeometry( 200, 200, 200 );
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var material2 = new THREE.ShaderMaterial({
            vertexShader: shaderVert,
            fragmentShader: shaderFrag
        });
        this._mesh = new THREE.Mesh( geometry, material2);//noiseMaterial );
        // this._mesh.position.set(0,0,-300);
        this._mesh.position.set(100,0,300);
        //const mat1 = noiseMaterial();
        //this._mesh = new THREE.Mesh( geometry, mat1 );

        this._scene.add( this._mesh );

        const light = new THREE.PointLight(0xFFFFFF, 1);
        light.position.copy(this._camera.position);
        this._scene.add(light);

        //  This is where introtowebgl uses CubeGeometry
        var geometry = new THREE.BoxGeometry(100,100,100);

        var material = new THREE.MeshPhongMaterial({color: 0x3a9ceb});

        var cube = new THREE.Mesh(geometry,material);
        cube.position.set(0,0,-300);
        this._scene.add(cube);

        function render (){
          requestAnimationFrame(render);
          cube.rotation.x +=.01;
          cube.rotation.y += .04;

          renderer.render(scene,camera);
        }
        render();

        this.animate();

    }

}
export default Main;
