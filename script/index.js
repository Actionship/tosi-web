const targetsList = ["bar1", "bar2"];
let targetIndex = -1;

const log = (text) => {
  console.log("log", text)
  let logEl = document.getElementById('log');
  logEl.innerText = text.toString();
}

const addModel = (name) => {
  const imageTarget = document.querySelector(`xrextras-named-image-target[name=${name}]`);

  if (imageTarget) {
    return;
  }

  const newImageTarget = document.createElement('xrextras-named-image-target');
  newImageTarget.setAttribute('name', name);
  const newEntity = document.createElement('a-entity');
  newEntity.setAttribute('scale', '18 18 18');
  newEntity.setAttribute('position', '0 -1.75 0');
  newEntity.setAttribute('animation-mixer', "clip: start; loop: once;");
  newEntity.setAttribute('xrextras-one-finger-rotate', '');
  newEntity.setAttribute('gltf-model', `#${name}`);
  newEntity.addEventListener('animation-finished', ({detail}) => {
    const {action, direction} = detail;
    if (action._clip.name === "start") {
      newEntity.setAttribute('animation-mixer', "clip: end; loop: once;");
      const arItem = document.querySelectorAll('.ar-item').item(targetIndex);
      !arItem.className.includes('activated') && arItem.setAttribute('class', arItem.className + " activated");

    } else if (action._clip.name === "end") {
      newEntity.setAttribute('animation-mixer', "clip: start; loop: once;");
    }
  });
  newImageTarget.append(newEntity)
  const scene = document.getElementById('scene');
  scene.append(newImageTarget);
}

const removeModel = (name) => {
  const imageTarget = document.querySelector(`xrextras-named-image-target[name=${name}]`);
  imageTarget.remove();
};

const setScene = (number) => {
  const screens = document.querySelectorAll('#root > div');
  for (const screen of screens) {
    screen.setAttribute('class', '');
  }
  screens.item(number).setAttribute('class', 'active');

  if (number === 1) {
    document.getElementById("scene-root").setAttribute("class", "active");
  } else {
    document.getElementById("scene-root").setAttribute("class", "");
  }
}

const setArItems = (number) => {
  targetIndex = number;
  const arItems = document.querySelectorAll('.ar-item');
  for (const item of arItems) {
    item.setAttribute('class', 'ar-item');
  }
  arItems[number].setAttribute('class', 'ar-item active');
}

AFRAME.registerComponent('tosi', {
  schema: {},
  init() {
    const scene = document.getElementById('scene');
    scene.addEventListener('xrimagefound', ({detail}) => {
      log(`target: ${detail.name}`)
      if (detail.name === targetsList[targetIndex]) {
        log(`in if target ${detail.name}`);
        const arItem = document.querySelectorAll('.ar-item').item(targetIndex);
        !arItem.className.includes('scanning') && arItem.setAttribute('class', arItem.className + " scanning");
        addModel(detail.name);
      }
    });

    const screens = document.querySelectorAll('#root > div');
    const button1 = screens[0].querySelector('.button-block .button');
    button1.addEventListener('click', () => {
      setScene(1);
      document.getElementById("scene-root").setAttribute("class", "active");
      targetIndex = 0;
    });
    const button21 = screens[1].querySelectorAll('.button-block .button')[0];
    button21.addEventListener('click', () => {
      setArItems(1);
      removeModel("bar1");
    })
    const button22 = screens[1].querySelectorAll('.button-block .button')[1];
    button22.addEventListener('click', () => {
      setScene(2);
      removeModel("bar2");
      targetIndex = 2;
    })
    const button3 = screens[2].querySelector('.button-block .button');
    button3.addEventListener('click', () => {
      window.location.href = 'https://tosi.com/';
    })
  }
});
