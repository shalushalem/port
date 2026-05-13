import { Howl } from "howler";

export function playAmbient(src: string, volume = 0.25): Howl {
  const sound = new Howl({
    src: [src],
    loop: true,
    volume
  });
  sound.play();
  return sound;
}
