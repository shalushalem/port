export function supportsMicrophone(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}
