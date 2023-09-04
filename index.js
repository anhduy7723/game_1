kaboom({
  scale: window.innerWidth / 393,
  font: 'sans-serif',
  background: [0, 0, 0],
  crisp: true, // Enable crisp rendering
});

// loadSprite('logo', 'https://fffcom.com/game/game-jump/logo.jpg');
// loadSprite('player', 'https://fffcom.com/game/game-jump/fffcom.png');

function draw(data) {
  const isMain = data.scene == 'main';

  const SCALE_FACTOR = window.innerWidth / 393; // Adjust this scale factor as needed

  const SPEED = isMain ? 600 : 0;
  const JUMP = 928;

  const plane = add([rect(width(), height()), pos(0, 0), color(255, 255, 255)]);

  const land = add([
    rect(width(), 20),
    pos(0, plane.pos.y + plane.height),
    body({ isStatic: true }),
    area(),
  ]);

  // Adjust the text size based on the scale factor
  const textSize = 50;

  add([
    text('FFFCOM.COM', {
      size: textSize,
      font:'Helvetica'
    }),
    pos(10, plane.pos.y),
    color(0, 0, 0),
  ]);

  let player; // Define the player variable outside the if-else block

  if (isMain) {
    let stt = 0;
    loop(0.8, () => {
      stt++;

      add([
        rect(80, 80 ), // Điều chỉnh kích thước ở đây
        pos(width(), plane.pos.y + plane.height),
        color(0, 0, 0),
        anchor('botleft'),
        move(LEFT, SPEED),
        area(),
        {
          stt: stt,
        },
        'wall',
      ]);

      add([
        text(stt, {
          size: 60,
        }),
        pos(width() + 20, plane.pos.y + plane.height),
        anchor('botleft'),
        move(LEFT, SPEED),
        color(255, 0, 0),
      ]);
    });

    player = add([
      rect(80, 80), // Điều chỉnh kích thước ở đây
      scale(1),
      isMain
        ? pos(80, plane.pos.y)
        : pos(data.player.pos.x, data.player.pos.y),
      isMain && body(),
      color(255, 0, 0),
      area(),
    ]);
  } else {
    for (var i of data.wall) {
      add([
        rect(80  ,80), // Điều chỉnh kích thước ở đây
        pos(i.pos.x, i.pos.y),
        color(0, 0, 0),
        anchor('botleft'),
      ]);

      add([
        text(i.stt, {
          size: 60,
        }),
        pos(i.pos.x + 20, i.pos.y),
        anchor('botleft'),
        color(255, 0, 0),
      ]);
    }

    player = add([
      rect(80, 80), // Điều chỉnh kích thước ở đây
      scale(1),
      isMain
        ? pos(50, plane.pos.y + 60)
        : pos(data.player.pos.x, data.player.pos.y),
      isMain && body(),
      color(255, 0, 0),
      area(),
    ]);
  }

  function Jump() {
    if (player.isGrounded()) {
      player.jump(JUMP);
    }
  }

  onClick(() => {
    if (isMain) Jump();
    else
      go('main', {
        scene: 'main',
      });
  });

  onKeyDown('space', () => {
    if (isMain) Jump();
    else
      go('main', {
        scene: 'main',
      });
  });

  player.onCollide('wall', (wall) => {
    go('end', {
      scene: 'end',
      player: player,
      wall: get('wall'),
    });
  });
}

scene('main', (data) => {
  setGravity(3400);
  draw(data);
});
scene('end', (data) => draw(data));

go('main', {
  scene: 'main',
});

window.addEventListener('orientationchange', function (e) {
  window.location.reload();
});
