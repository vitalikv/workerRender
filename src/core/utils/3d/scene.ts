import { BufferGeometry, Material, Mesh, Object3D, Scene } from 'three';

export class SceneUtil {
  public clearScene(scene: Scene): void {
    scene.children.forEach((children, i) => {
      this.clearObject3D(children);
      scene.remove(children);
    });
  }

  public clearObject3D(object: Object3D): void {
    if (object instanceof Mesh) {
      this.clearMesh(object);
    }

    object?.traverse((children: Object3D) => {
      if (children instanceof Mesh) {
        this.clearMesh(children);
      }
    });

    object?.clear();
  }

  public clearMesh(mesh: Mesh): void {
    this.clearGeometry(mesh.geometry);
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material: Material) => {
        this.clearMaterial(material);
      });
    } else if (mesh.material instanceof Material) {
      this.clearMaterial(mesh.material);
    }
  }

  public clearGeometry(geometry: BufferGeometry): void {
    geometry.dispose();
  }

  public clearMaterial(material: Material): void {
    Object.keys(material).forEach((property) => {
      if (!material[property]) {
        return;
      }

      if (material[property] !== null && typeof material[property].dispose === 'function') {
        material[property].dispose();
      }
    });
    material.dispose();
  }

  public hasChildren(scene: Scene, name: string, recursive: boolean = false): boolean {
    let exists = false;

    if (recursive) {
      scene.traverse((object: Object3D) => {
        if (object.name === name) {
          exists = true;
        }
      });
    } else {
      scene.children.forEach((object: Object3D) => {
        if (object.name === name) {
          exists = true;
        }
      });
    }
    return exists;
  }
}
